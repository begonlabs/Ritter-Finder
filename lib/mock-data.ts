export const mockLeads = [
  {
    id: "1",
    
    // Contact Information
    email: "john.doe@solartech.com",
    verified_email: true,
    phone: "+34 912 345 678",
    verified_phone: true,
    
    // Company Information
    company_name: "SolarTech Inc.",
    company_website: "www.solartech.com",
    verified_website: true,
    
    // Location Information
    address: "Calle Mayor 123",
    state: "Madrid",
    country: "España",
    
    // New Fields from schema
    activity: "Solar panel installation and maintenance",
    description: "Empresa líder en instalaciones solares residenciales",
    category: "Solar Installation",
    
    // Data Quality Score (1-5 scale)
    data_quality_score: 5, // High quality: all verifications passed
    
    // Legacy fields for compatibility
    name: "John Doe",
    position: "CEO",
    location: "Madrid, España",
    industry: "Solar Installation",
    employees: "50-100",
    revenue: "€2M-5M",
    source: "www.solarinstallers.com",
    confidence: 95,
    lastActivity: "2024-01-15",
    notes: "Empresa líder en instalaciones solares residenciales",
    // Legacy compatibility fields (keep for backward compatibility)
    hasWebsite: true,
    websiteExists: true,
    emailValidated: true,
  },
  {
    id: "2",
    
    // Contact Information
    email: "jane.smith@greenenergyco.net",
    verified_email: true,
    phone: "+34 913 456 789",
    verified_phone: true,
    
    // Company Information
    company_name: "Green Energy Co.",
    company_website: "www.greenenergyco.net",
    verified_website: true,
    
    // Location Information
    address: "Passeig de Gràcia 456",
    state: "Barcelona",
    country: "España",
    
    // New Fields from schema
    activity: "Commercial renewable energy projects",
    description: "Especializada en proyectos comerciales de gran escala",
    category: "Renewable Energy",
    
    // Data Quality Score (1-5 scale)
    data_quality_score: 5, // High quality: all verifications passed
    
    // Legacy fields for compatibility
    name: "Jane Smith",
    position: "Director of Operations",
    location: "Barcelona, España",
    industry: "Renewable Energy",
    employees: "100-250",
    revenue: "€5M-10M",
    source: "www.greenenergyfirms.net",
    confidence: 88,
    lastActivity: "2024-01-25T15:45:00Z",
    notes: "Especializada en proyectos comerciales de gran escala",
    hasWebsite: true,
    websiteExists: true,
    emailValidated: true,
  },
  {
    id: "3",
    
    // Contact Information
    email: "robert@ecosolutions.org",
    verified_email: true,
    phone: "+34 914 567 890",
    verified_phone: true,
    
    // Company Information
    company_name: "EcoSolutions",
    company_website: "www.ecosolutions.org",
    verified_website: true,
    
    // Location Information
    address: "Avenida del Puerto 789",
    state: "Valencia",
    country: "España",
    
    // New Fields from schema
    activity: "Environmental consulting and energy efficiency",
    description: "Consultoría especializada en eficiencia energética",
    category: "Environmental Consulting",
    
    // Data Quality Score (1-5 scale)
    data_quality_score: 5, // High quality: all verifications passed
    
    // Legacy fields for compatibility
    name: "Robert Johnson",
    position: "Sustainability Manager",
    location: "Valencia, España",
    industry: "Environmental Consulting",
    employees: "25-50",
    revenue: "€1M-2M",
    source: "www.eco-consultants.org",
    confidence: 92,
    lastActivity: "2024-01-24T09:15:00Z",
    notes: "Consultoría especializada en eficiencia energética",
    hasWebsite: true,
    websiteExists: true,
    emailValidated: true,
  },
  {
    id: "4",
    
    // Contact Information
    email: "emily@renewablepower.com",
    verified_email: false, // Email not verified
    phone: "+34 915 678 901",
    verified_phone: true,
    
    // Company Information
    company_name: "Renewable Power Systems",
    company_website: "www.renewablepower.com",
    verified_website: true,
    
    // Location Information
    address: "Calle Betis 321",
    state: "Sevilla",
    country: "España",
    
    // New Fields from schema
    activity: "Industrial renewable power systems",
    description: "Sistemas de energía renovable para industria",
    category: "Power Systems",
    
    // Data Quality Score (1-5 scale)
    data_quality_score: 4, // Good quality: email not verified
    
    // Legacy fields for compatibility
    name: "Emily Williams",
    position: "Technical Director",
    location: "Sevilla, España",
    industry: "Power Systems",
    employees: "75-150",
    revenue: "€3M-7M",
    source: "www.renewableenergy.com",
    confidence: 90,
    lastActivity: "2024-01-23T14:20:00Z",
    notes: "Sistemas de energía renovable para industria",
    hasWebsite: true,
    websiteExists: true,
    emailValidated: false,
  },
  {
    id: "5",
    
    // Contact Information
    email: "michael@sunpower-install.com",
    verified_email: true,
    phone: "+34 916 789 012",
    verified_phone: true,
    
    // Company Information
    company_name: "SunPower Installations",
    company_website: "www.sunpower-install.com",
    verified_website: false, // Website not verified
    
    // Location Information
    address: "Gran Víaù 654",
    state: "Bilbao",
    country: "España",
    
    // New Fields from schema
    activity: "Residential solar panel installations",
    description: "Instalaciones solares para sector residencial",
    category: "Solar Installation",
    
    // Data Quality Score (1-5 scale)
    data_quality_score: 4, // Good quality: website not verified
    
    // Legacy fields for compatibility
    name: "Michael Brown",
    position: "Sales Manager",
    location: "Bilbao, España",
    industry: "Solar Installation",
    employees: "30-75",
    revenue: "€1.5M-3M",
    source: "www.solarinstallers.com",
    confidence: 85,
    lastActivity: "2024-01-22T11:30:00Z",
    notes: "Instalaciones solares para sector residencial",
    hasWebsite: true,
    websiteExists: false,
    emailValidated: true,
  },
  {
    id: "6",
    
    // Contact Information
    email: "sarah@cleanenergypartners.net",
    verified_email: true,
    phone: "+34 917 890 123",
    verified_phone: true,
    
    // Company Information
    company_name: "Clean Energy Partners",
    company_website: "www.cleanenergypartners.net",
    verified_website: true,
    
    // Location Information
    address: "Plaza del Pilar 987",
    state: "Zaragoza",
    country: "España",
    
    // New Fields from schema
    activity: "Clean energy consulting and partnerships",
    description: "Consultoría en transición energética",
    category: "Energy Consulting",
    
    // Data Quality Score (1-5 scale)
    data_quality_score: 5, // High quality: all verifications passed
    
    // Legacy fields for compatibility
    name: "Sarah Miller",
    position: "Business Development",
    location: "Zaragoza, España",
    industry: "Energy Consulting",
    employees: "20-40",
    revenue: "€800K-1.5M",
    source: "www.greenenergyfirms.net",
    confidence: 87,
    lastActivity: "2024-01-21T16:45:00Z",
    notes: "Consultoría en transición energética",
    hasWebsite: true,
    websiteExists: true,
    emailValidated: true,
  },
  {
    id: "7",
    
    // Contact Information
    email: "david@sustainablesolutions.co",
    verified_email: true,
    phone: "+34 918 901 234",
    verified_phone: true,
    
    // Company Information
    company_name: "Sustainable Solutions LLC",
    company_website: "www.sustainablesolutions.co",
    verified_website: true,
    
    // Location Information
    address: "Calle Larios 147",
    state: "Málaga",
    country: "España",
    
    // New Fields from schema
    activity: "Corporate sustainability solutions",
    description: "Soluciones sostenibles para empresas",
    category: "Sustainability",
    
    // Data Quality Score (1-5 scale)
    data_quality_score: 5, // High quality: all verifications passed
    
    // Legacy fields for compatibility
    name: "David Wilson",
    position: "Project Manager",
    location: "Málaga, España",
    industry: "Sustainability",
    employees: "15-30",
    revenue: "€500K-1M",
    source: "www.sustainablesolutions.co",
    confidence: 93,
    lastActivity: "2024-01-20T08:30:00Z",
    notes: "Soluciones sostenibles para empresas",
    hasWebsite: true,
    websiteExists: true,
    emailValidated: true,
  },
  {
    id: "8",
    
    // Contact Information
    email: "lisa@ecoconsult.org",
    verified_email: false, // Email not verified
    phone: "", // No phone number
    verified_phone: false,
    
    // Company Information
    company_name: "EcoConsult Group",
    company_website: "", // No website
    verified_website: false,
    
    // Location Information
    address: "Ronda Segura 258",
    state: "Murcia",
    country: "España",
    
    // New Fields from schema
    activity: "Environmental consulting and certifications",
    description: "Consultoría ambiental y certificaciones",
    category: "Environmental Consulting",
    
    // Data Quality Score (1-5 scale)
    data_quality_score: 1, // Low quality: no verifications passed
    
    // Legacy fields for compatibility
    name: "Lisa Taylor",
    position: "Senior Consultant",
    location: "Murcia, España",
    industry: "Environmental Consulting",
    employees: "40-80",
    revenue: "€2M-4M",
    source: "www.eco-consultants.org",
    confidence: 89,
    lastActivity: "2024-01-19T13:15:00Z",
    notes: "Consultoría ambiental y certificaciones",
    hasWebsite: false,
    websiteExists: false,
    emailValidated: false,
  },
]

export const mockSearchHistory = [
  {
    id: "1",
    date: "2023-04-15T14:30:00Z",
    websites: ["www.solarinstallers.com", "www.greenenergyfirms.net"],
    clientType: "industrial",
    leadsFound: 24,
    leadsContacted: 18,
    status: "completed",
  },
  {
    id: "2",
    date: "2023-04-10T09:15:00Z",
    websites: ["www.eco-consultants.org"],
    clientType: "solar",
    leadsFound: 12,
    leadsContacted: 10,
    status: "completed",
  },
  {
    id: "3",
    date: "2023-04-05T16:45:00Z",
    websites: ["www.renewableenergy.com", "www.sustainablesolutions.co"],
    clientType: "energy",
    leadsFound: 31,
    leadsContacted: 25,
    status: "completed",
  },
  {
    id: "4",
    date: "2023-03-28T11:20:00Z",
    websites: ["www.greenenergyfirms.net"],
    clientType: "residential",
    leadsFound: 18,
    leadsContacted: 15,
    status: "completed",
  },
  {
    id: "5",
    date: "2023-03-20T13:10:00Z",
    websites: ["www.solarinstallers.com", "www.eco-consultants.org"],
    clientType: "commercial",
    leadsFound: 27,
    leadsContacted: 20,
    status: "completed",
  },
]

export const mockEmailCampaigns = [
  {
    id: "1",
    date: "2023-04-15T15:45:00Z",
    subject: "Innovative Solutions for Industrial Energy Efficiency",
    recipients: 18,
    openRate: 72,
    clickRate: 38,
    status: "sent",
  },
  {
    id: "2",
    date: "2023-04-10T10:30:00Z",
    subject: "Partnership Opportunity for Solar Installers",
    recipients: 10,
    openRate: 80,
    clickRate: 50,
    status: "sent",
  },
  {
    id: "3",
    date: "2023-04-05T17:30:00Z",
    subject: "Exclusive Offer for Energy Consultants",
    recipients: 25,
    openRate: 68,
    clickRate: 32,
    status: "sent",
  },
  {
    id: "4",
    date: "2023-03-28T12:15:00Z",
    subject: "New Solutions for Residential Contractors",
    recipients: 15,
    openRate: 73,
    clickRate: 40,
    status: "sent",
  },
  {
    id: "5",
    date: "2023-03-20T14:00:00Z",
    subject: "Commercial Property Energy Optimization",
    recipients: 20,
    openRate: 65,
    clickRate: 35,
    status: "sent",
  },
]
