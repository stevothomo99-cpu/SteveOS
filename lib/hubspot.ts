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

async function searchLeads(sourceValue: string): Promise<HubSpotLeadSummary> {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN
  const propertyName = process.env.HUBSPOT_SOURCE_PROPERTY || 'focablyed_source'

  if (!token) {
    return { configured: false, source: sourceValue, total: 0, recent: [] }
  }

  try {
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
                propertyName,
                operator: 'EQ',
                value: sourceValue,
              },
            ],
          },
        ],
        properties: ['firstname', 'lastname', 'email', 'createdate', propertyName],
        sorts: ['-createdate'],
        limit: 5,
      }),
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      const detail = await response.text()
      return {
        configured: true,
        source: sourceValue,
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
      source: sourceValue,
      total: data.total || 0,
      recent,
    }
  } catch (error) {
    return {
      configured: true,
      source: sourceValue,
      total: 0,
      recent: [],
      error: error instanceof Error ? error.message : 'Unable to load HubSpot leads',
    }
  }
}

export async function getLeadSources() {
  const siteMarginValue = process.env.HUBSPOT_SITEMARGIN_SOURCE || 'SiteMargin Waitlist'
  const focablyValue = process.env.HUBSPOT_FOCABLY_SOURCE || 'FocablyED Waitlist'
  const yfdValue = process.env.HUBSPOT_YFD_SOURCE || 'YFD Lead'

  const [siteMargin, focably, yfd] = await Promise.all([
    searchLeads(siteMarginValue),
    searchLeads(focablyValue),
    searchLeads(yfdValue),
  ])

  return { siteMargin, focably, yfd }
}
