export type HubSpotLead = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type HubSpotLeadSummary = {
  configured: boolean
  source: string
  total: number
  recent: HubSpotLead[]
  error?: string
}

type HubSpotProperty = {
  name: string
  label: string
  options?: Array<{ label: string; value: string }>
}

async function resolveSourceProperty(token: string) {
  const response = await fetch('https://api.hubapi.com/crm/v3/properties/contacts', {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`Unable to read HubSpot properties (${response.status})`)
  }

  const data = await response.json()
  const properties: HubSpotProperty[] = data.results || []
  const requestedLabel = process.env.HUBSPOT_SOURCE_LABEL || 'FocablyED Source'
  const configuredName = process.env.HUBSPOT_SOURCE_PROPERTY

  const property = configuredName
    ? properties.find((item) => item.name === configuredName)
    : properties.find((item) => item.label.toLowerCase() === requestedLabel.toLowerCase())

  if (!property) {
    throw new Error(`HubSpot contact property "${requestedLabel}" was not found`)
  }

  return property
}

function resolveOptionValue(property: HubSpotProperty, requestedLabel: string) {
  const option = property.options?.find(
    (item) => item.label.toLowerCase() === requestedLabel.toLowerCase() || item.value === requestedLabel,
  )

  if (!option) {
    throw new Error(`HubSpot option "${requestedLabel}" was not found in ${property.label}`)
  }

  return option.value
}

async function searchLeads(
  token: string,
  property: HubSpotProperty,
  sourceLabel: string,
): Promise<HubSpotLeadSummary> {
  try {
    const sourceValue = resolveOptionValue(property, sourceLabel)
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              {
                propertyName: property.name,
                operator: 'EQ',
                value: sourceValue,
              },
            ],
          },
        ],
        properties: ['firstname', 'lastname', 'email', 'createdate', property.name],
        sorts: ['-createdate'],
        limit: 5,
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      const detail = await response.text()
      return {
        configured: true,
        source: sourceLabel,
        total: 0,
        recent: [],
        error: `HubSpot returned ${response.status}: ${detail.slice(0, 160)}`,
      }
    }

    const data = await response.json()
    const recent: HubSpotLead[] = (data.results || []).map((contact: any) => {
      const firstName = contact.properties?.firstname || ''
      const lastName = contact.properties?.lastname || ''
      return {
        id: contact.id,
        name: `${firstName} ${lastName}`.trim() || 'Unnamed lead',
        email: contact.properties?.email || 'No email',
        createdAt: contact.properties?.createdate || contact.createdAt || '',
      }
    })

    return {
      configured: true,
      source: sourceLabel,
      total: data.total || 0,
      recent,
    }
  } catch (error) {
    return {
      configured: true,
      source: sourceLabel,
      total: 0,
      recent: [],
      error: error instanceof Error ? error.message : 'Unable to load HubSpot leads',
    }
  }
}

export async function getLeadSources() {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN
  const siteMarginLabel = process.env.HUBSPOT_SITEMARGIN_SOURCE || 'SiteMargin Waitlist'
  const focablyLabel = process.env.HUBSPOT_FOCABLY_SOURCE || 'FocablyED Waitlist'
  const yfdLabel = process.env.HUBSPOT_YFD_SOURCE || 'YFD Lead'

  if (!token) {
    const empty = (source: string): HubSpotLeadSummary => ({ configured: false, source, total: 0, recent: [] })
    return {
      siteMargin: empty(siteMarginLabel),
      focably: empty(focablyLabel),
      yfd: empty(yfdLabel),
    }
  }

  try {
    const property = await resolveSourceProperty(token)
    const [siteMargin, focably, yfd] = await Promise.all([
      searchLeads(token, property, siteMarginLabel),
      searchLeads(token, property, focablyLabel),
      searchLeads(token, property, yfdLabel),
    ])

    return { siteMargin, focably, yfd }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to resolve HubSpot lead source property'
    const failed = (source: string): HubSpotLeadSummary => ({ configured: true, source, total: 0, recent: [], error: message })
    return {
      siteMargin: failed(siteMarginLabel),
      focably: failed(focablyLabel),
      yfd: failed(yfdLabel),
    }
  }
}
