export type HubSpotLead = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type HubSpotLeadSummary = {
  configured: boolean
  total: number
  recent: HubSpotLead[]
  error?: string
}

export async function getEarlyAccessLeads(): Promise<HubSpotLeadSummary> {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN
  const propertyName = process.env.HUBSPOT_EARLY_ACCESS_PROPERTY || 'lifecyclestage'
  const propertyValue = process.env.HUBSPOT_EARLY_ACCESS_VALUE || 'lead'

  if (!token) {
    return { configured: false, total: 0, recent: [] }
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
                value: propertyValue,
              },
            ],
          },
        ],
        properties: ['firstname', 'lastname', 'email', 'createdate'],
        sorts: ['-createdate'],
        limit: 5,
      }),
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      const detail = await response.text()
      return {
        configured: true,
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
      total: data.total || 0,
      recent,
    }
  } catch (error) {
    return {
      configured: true,
      total: 0,
      recent: [],
      error: error instanceof Error ? error.message : 'Unable to load HubSpot leads',
    }
  }
}
