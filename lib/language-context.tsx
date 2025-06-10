"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Definir los idiomas disponibles
export type Language = "es" | "en" | "de"

// Interfaz para el contexto de idioma
interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

// Crear el contexto
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Traducciones
const translations: Record<Language, Record<string, string>> = {
  es: {
    // Login
    "login.title": "Ritter Finder",
    "login.subtitle": "Plataforma de generación de leads con IA",
    "login.username": "Usuario",
    "login.username.placeholder": "Introduzca su usuario",
    "login.password": "Contraseña",
    "login.password.placeholder": "Introduzca su contraseña",
    "login.button": "Iniciar Sesión",
    "login.demo": 'Modo Demo: Use cualquier usuario con contraseña "1234"',
    "login.error": "Credenciales inválidas. Por favor, inténtelo de nuevo.",

    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.search": "Buscar Leads",
    "nav.campaigns": "Campañas",
    "nav.history": "Historial",
    "nav.settings": "Configuración",
    "nav.logout": "Cerrar Sesión",
    "nav.profile": "Perfil",

    // Dashboard
    "dashboard.stats.leads": "Total Leads",
    "dashboard.stats.leads.desc": "Leads encontrados en todas las búsquedas",
    "dashboard.stats.campaigns": "Campañas Enviadas",
    "dashboard.stats.campaigns.desc": "Campañas de email entregadas",
    "dashboard.stats.searches": "Búsquedas Realizadas",
    "dashboard.stats.searches.desc": "Total de búsquedas con IA ejecutadas",
    "dashboard.stats.openrate": "Tasa de Apertura",
    "dashboard.stats.openrate.desc": "Rendimiento de campañas de email",
    "dashboard.trend.title": "Tendencias de Adquisición de Leads",
    "dashboard.trend.subtitle": "Leads encontrados vs. contactados por mes",
    "dashboard.trend.found": "Leads Encontrados",
    "dashboard.trend.contacted": "Leads Contactados",
    "dashboard.activity": "Actividad Reciente",
    "dashboard.activity.desc": "Sus últimas acciones y actualizaciones",
    "dashboard.search.completed": "Búsqueda completada",
    "dashboard.search.found": "Se encontraron {count} leads para clientes de {type}",
    "dashboard.campaign.sent": "Campaña de email enviada",
    "dashboard.campaign.to": '"{subject}" a {count} destinatarios',

    // Search
    "search.websites.title": "Seleccionar Sitios Web",
    "search.websites.placeholder": "Seleccionar sitios web...",
    "search.websites.selected": "{count} sitio(s) seleccionado(s)",
    "search.websites.search": "Buscar sitios web...",
    "search.websites.empty": "No se encontraron sitios web.",
    "search.client.title": "Tipo de Cliente Objetivo",
    "search.client.placeholder": "Seleccionar tipo de cliente...",
    "search.client.search": "Buscar tipos de cliente...",
    "search.client.empty": "No se encontró ningún tipo de cliente.",
    "search.button": "Buscar Leads",
    "search.progress": "Búsqueda de Leads con IA en Progreso",
    "search.analyzing": "Analizando: {website}",

    // Search steps
    "search.step.1": "Inicializando buscador con IA...",
    "search.step.2": "Conectando con sitios web...",
    "search.step.3": "Analizando estructura de sitios...",
    "search.step.4": "Extrayendo información de contacto...",
    "search.step.5": "Filtrando por criterios objetivo...",
    "search.step.6": "Validando direcciones de email...",
    "search.step.7": "Compilando datos de leads...",
    "search.step.8": "Finalizando resultados...",

    // Results
    "results.title": "Resultados de Leads",
    "results.search": "Buscar leads...",
    "results.empty": "No se encontraron resultados.",
    "results.selected": "{selected} de {total} leads seleccionados",
    "results.name": "Nombre",
    "results.company": "Empresa",
    "results.email": "Email",
    "results.website": "Sitio Web",
    "results.campaign.button": "Crear Campaña de Email",

    // History
    "history.search.title": "Historial de Búsquedas",
    "history.search.desc": "Ver y volver a ejecutar sus búsquedas anteriores",
    "history.search.filter": "Filtrar historial...",
    "history.search.empty": "No se encontró historial de búsquedas.",
    "history.search.date": "Fecha",
    "history.search.websites": "Sitios Web",
    "history.search.type": "Tipo de Cliente",
    "history.search.found": "Leads Encontrados",
    "history.search.contacted": "Contactados",
    "history.search.actions": "Acciones",
    "history.search.rerun": "Repetir Búsqueda",
    "history.search.view": "Ver Leads",

    "history.email.title": "Campañas de Email",
    "history.email.desc": "Seguimiento del rendimiento de sus campañas de email",
    "history.email.search": "Buscar campañas...",
    "history.email.empty": "No se encontraron campañas.",
    "history.email.date": "Fecha",
    "history.email.subject": "Asunto",
    "history.email.recipients": "Destinatarios",
    "history.email.open": "Tasa de Apertura",
    "history.email.click": "Tasa de Clics",
    "history.email.actions": "Acciones",
    "history.email.view": "Ver Detalles",
    "history.email.duplicate": "Duplicar Campaña",

    // Months
    "month.jan": "Ene",
    "month.feb": "Feb",
    "month.mar": "Mar",
    "month.apr": "Abr",
    "month.may": "May",
    "month.jun": "Jun",
    "month.jul": "Jul",
    "month.aug": "Ago",
    "month.sep": "Sep",
    "month.oct": "Oct",
    "month.nov": "Nov",
    "month.dec": "Dic",

    // Client types
    "client.industrial": "Empresas Industriales",
    "client.solar": "Instaladores Solares",
    "client.energy": "Consultores Energéticos",
    "client.residential": "Contratistas Residenciales",
    "client.commercial": "Gestores de Propiedades Comerciales",

    // Websites
    "website.solarinstallers": "Instaladores Solares",
    "website.greenenergy": "Empresas de Energía Verde",
    "website.ecoconsultants": "Consultores Ecológicos",
    "website.renewableenergy": "Energía Renovable",
    "website.sustainablesolutions": "Soluciones Sostenibles",

    // Notifications
    "notification.leads": "Nuevos leads disponibles",
    "notification.leads.desc": "15 nuevos leads de su última búsqueda",
    "notification.campaign": "Campaña completada",
    "notification.campaign.desc": "Su campaña de email ha sido enviada",
    "notification.system": "Actualización del sistema",
    "notification.system.desc": "Se han añadido nuevas funciones",
    "notification.time.hours": "Hace {count} horas",
    "notification.time.yesterday": "Ayer",
    "notification.time.days": "Hace {count} días",

    // Time
    "time.from.month": "desde el mes pasado",

    // EmailComposer
    "email.campaign.title": "Campaña de Email",
    "email.campaign.desc": "Componga su email para enviar a {count} leads seleccionados",
    "email.recipients": "Destinatarios",
    "email.content": "Contenido del Email",
    "email.placeholders": "Use [Contact Name] y [Company Name] como marcadores que serán reemplazados automáticamente.",
    "email.send": "Enviar Campaña",
    "email.success.title": "¡Éxito!",
    "email.success.desc": "Campaña de email enviada a {count} leads seleccionados.",

    // Onboarding
    "onboarding.welcome.title": "¡Bienvenido a Ritter Finder!",
    "onboarding.welcome.description":
      "Descubra cómo nuestra plataforma impulsada por IA puede ayudarle a encontrar y contactar leads de alta calidad en el sector de energías renovables.",
    "onboarding.search.title": "Búsqueda de Leads",
    "onboarding.search.description":
      "Seleccione los sitios web para buscar y el tipo de cliente objetivo. Nuestra IA analizará estos sitios para encontrar contactos relevantes.",
    "onboarding.results.title": "Resultados de Leads",
    "onboarding.results.description":
      "Revise los leads encontrados, seleccione los más relevantes y prepare campañas de email personalizadas.",
    "onboarding.campaigns.title": "Campañas de Email",
    "onboarding.campaigns.description":
      "Cree campañas de email personalizadas para sus leads seleccionados. Use plantillas y variables para personalizar sus mensajes.",
    "onboarding.history.title": "Historial y Análisis",
    "onboarding.history.description":
      "Acceda a su historial de búsquedas y campañas. Analice el rendimiento con métricas detalladas.",
    "onboarding.next": "Siguiente",
    "onboarding.previous": "Anterior",
    "onboarding.skip": "Omitir",
    "onboarding.finish": "Finalizar",
    "onboarding.email.title": "Composición de Emails",
    "onboarding.email.description":
      "Personalice sus emails con plantillas predefinidas. Puede usar variables como [Contact Name] y [Company Name].",

    // Scraping Stats
    "scraping.title": "Estadísticas del Scraping",
    "scraping.subtitle": "Datos en tiempo real de la recolección automatizada de leads",
    "scraping.sites.reviewed": "Sitios Revisados",
    "scraping.sites.desc": "Total de sitios web analizados",
    "scraping.leads.obtained": "Leads Obtenidos",
    "scraping.leads.desc": "Contactos válidos extraídos",
    "scraping.money.saved": "Dinero Ahorrado",
    "scraping.money.desc": "Vs. compra de leads tradicional",
    "scraping.success.rate": "Tasa de Éxito",
    "scraping.success.desc": "Sitios con leads válidos",
    "scraping.daily.performance": "Rendimiento Diario",
    "scraping.top.sources": "Mejores Fuentes",
    "scraping.avg.leads": "Promedio de leads por sitio",
    "scraping.cost.avoided": "Costo evitado por lead",
    "scraping.automated": "Scraping automatizado",
    "scraping.updated": "Actualizado hace",
    "scraping.saved": "ahorrado",
  },
  en: {
    // Login
    "login.title": "Ritter Finder",
    "login.subtitle": "AI-Powered Lead Generation Platform",
    "login.username": "Username",
    "login.username.placeholder": "Enter your username",
    "login.password": "Password",
    "login.password.placeholder": "Enter your password",
    "login.button": "Sign In",
    "login.demo": 'Demo Mode: Use any username with password "1234"',
    "login.error": "Invalid credentials. Please try again.",

    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.search": "Search Leads",
    "nav.campaigns": "Campaigns",
    "nav.history": "History",
    "nav.settings": "Settings",
    "nav.logout": "Logout",
    "nav.profile": "Profile",

    // Dashboard
    "dashboard.stats.leads": "Total Leads",
    "dashboard.stats.leads.desc": "Leads found across all searches",
    "dashboard.stats.campaigns": "Campaigns Sent",
    "dashboard.stats.campaigns.desc": "Email campaigns delivered",
    "dashboard.stats.searches": "Searches Run",
    "dashboard.stats.searches.desc": "Total AI searches executed",
    "dashboard.stats.openrate": "Avg. Open Rate",
    "dashboard.stats.openrate.desc": "Email campaign performance",
    "dashboard.trend.title": "Lead Acquisition Trends",
    "dashboard.trend.subtitle": "Monthly leads found vs. contacted",
    "dashboard.trend.found": "Leads Found",
    "dashboard.trend.contacted": "Leads Contacted",
    "dashboard.activity": "Recent Activity",
    "dashboard.activity.desc": "Your latest actions and updates",
    "dashboard.search.completed": "Search completed",
    "dashboard.search.found": "Found {count} leads for {type} clients",
    "dashboard.campaign.sent": "Email campaign sent",
    "dashboard.campaign.to": '"{subject}" to {count} recipients',

    // Search
    "search.websites.title": "Select Websites",
    "search.websites.placeholder": "Select websites...",
    "search.websites.selected": "{count} website(s) selected",
    "search.websites.search": "Search websites...",
    "search.websites.empty": "No website found.",
    "search.client.title": "Target Client Type",
    "search.client.placeholder": "Select client type...",
    "search.client.search": "Search client types...",
    "search.client.empty": "No client type found.",
    "search.button": "Search Leads",
    "search.progress": "AI Lead Search in Progress",
    "search.analyzing": "Currently analyzing: {website}",

    // Search steps
    "search.step.1": "Initializing AI scraper...",
    "search.step.2": "Connecting to websites...",
    "search.step.3": "Analyzing website structure...",
    "search.step.4": "Extracting contact information...",
    "search.step.5": "Filtering by target criteria...",
    "search.step.6": "Validating email addresses...",
    "search.step.7": "Compiling lead data...",
    "search.step.8": "Finalizing results...",

    // Results
    "results.title": "Lead Results",
    "results.search": "Search leads...",
    "results.empty": "No results found.",
    "results.selected": "{selected} of {total} leads selected",
    "results.name": "Name",
    "results.company": "Company",
    "results.email": "Email",
    "results.website": "Website",
    "results.campaign.button": "Compose Email Campaign",

    // History
    "history.search.title": "Search History",
    "history.search.desc": "View and rerun your previous searches",
    "history.search.filter": "Filter history...",
    "history.search.empty": "No search history found.",
    "history.search.date": "Date",
    "history.search.websites": "Websites",
    "history.search.type": "Client Type",
    "history.search.found": "Leads Found",
    "history.search.contacted": "Contacted",
    "history.search.actions": "Actions",
    "history.search.rerun": "Rerun Search",
    "history.search.view": "View Leads",

    "history.email.title": "Email Campaigns",
    "history.email.desc": "Track your email campaign performance",
    "history.email.search": "Search campaigns...",
    "history.email.empty": "No campaigns found.",
    "history.email.date": "Date",
    "history.email.subject": "Subject",
    "history.email.recipients": "Recipients",
    "history.email.open": "Open Rate",
    "history.email.click": "Click Rate",
    "history.email.actions": "Actions",
    "history.email.view": "View Details",
    "history.email.duplicate": "Duplicate Campaign",

    // Months
    "month.jan": "Jan",
    "month.feb": "Feb",
    "month.mar": "Mar",
    "month.apr": "Apr",
    "month.may": "May",
    "month.jun": "Jun",
    "month.jul": "Jul",
    "month.aug": "Aug",
    "month.sep": "Sep",
    "month.oct": "Oct",
    "month.nov": "Nov",
    "month.dec": "Dec",

    // Client types
    "client.industrial": "Industrial Companies",
    "client.solar": "Solar Installers",
    "client.energy": "Energy Consultants",
    "client.residential": "Residential Contractors",
    "client.commercial": "Commercial Property Managers",

    // Websites
    "website.solarinstallers": "Solar Installers",
    "website.greenenergy": "Green Energy Firms",
    "website.ecoconsultants": "Eco Consultants",
    "website.renewableenergy": "Renewable Energy",
    "website.sustainablesolutions": "Sustainable Solutions",

    // Notifications
    "notification.leads": "New leads available",
    "notification.leads.desc": "15 new leads from your latest search",
    "notification.campaign": "Campaign completed",
    "notification.campaign.desc": "Your email campaign has been sent",
    "notification.system": "System update",
    "notification.system.desc": "New features have been added",
    "notification.time.hours": "{count} hours ago",
    "notification.time.yesterday": "Yesterday",
    "notification.time.days": "{count} days ago",

    // Time
    "time.from.month": "from last month",

    // EmailComposer
    "email.campaign.title": "Email Campaign",
    "email.campaign.desc": "Compose your email to send to {count} selected leads",
    "email.recipients": "Recipients",
    "email.content": "Email Content",
    "email.placeholders": "Use [Contact Name] and [Company Name] as placeholders that will be automatically replaced.",
    "email.send": "Send Campaign",
    "email.success.title": "Success!",
    "email.success.desc": "Email campaign sent to {count} selected leads.",

    // Onboarding
    "onboarding.welcome.title": "Welcome to Ritter Finder!",
    "onboarding.welcome.description":
      "Discover how our AI-powered platform can help you find and contact high-quality leads in the renewable energy sector.",
    "onboarding.search.title": "Lead Search",
    "onboarding.search.description":
      "Select websites to search and target client type. Our AI will analyze these sites to find relevant contacts.",
    "onboarding.results.title": "Lead Results",
    "onboarding.results.description":
      "Review found leads, select the most relevant ones, and prepare personalized email campaigns.",
    "onboarding.campaigns.title": "Email Campaigns",
    "onboarding.campaigns.description":
      "Create personalized email campaigns for your selected leads. Use templates and variables to customize messages.",
    "onboarding.history.title": "History & Analytics",
    "onboarding.history.description":
      "Access your search and campaign history. Analyze your campaign performance with detailed metrics.",
    "onboarding.next": "Next",
    "onboarding.previous": "Previous",
    "onboarding.skip": "Skip",
    "onboarding.finish": "Finish",
    "onboarding.email.title": "Email Composition",
    "onboarding.email.description":
      "Customize your emails with predefined templates. You can use variables like [Contact Name] and [Company Name].",

    // Scraping Stats
    "scraping.title": "Scraping Statistics",
    "scraping.subtitle": "Real-time data from automated lead collection",
    "scraping.sites.reviewed": "Sites Reviewed",
    "scraping.sites.desc": "Total websites analyzed",
    "scraping.leads.obtained": "Leads Obtained",
    "scraping.leads.desc": "Valid contacts extracted",
    "scraping.money.saved": "Money Saved",
    "scraping.money.desc": "Vs. traditional lead purchase",
    "scraping.success.rate": "Success Rate",
    "scraping.success.desc": "Sites with valid leads",
    "scraping.daily.performance": "Daily Performance",
    "scraping.top.sources": "Top Sources",
    "scraping.avg.leads": "Average leads per site",
    "scraping.cost.avoided": "Cost avoided per lead",
    "scraping.automated": "Automated scraping",
    "scraping.updated": "Updated",
    "scraping.saved": "saved",
  },
  de: {
    // Login
    "login.title": "Ritter Finder",
    "login.subtitle": "KI-gestützte Lead-Generierungsplattform",
    "login.username": "Benutzername",
    "login.username.placeholder": "Geben Sie Ihren Benutzernamen ein",
    "login.password": "Passwort",
    "login.password.placeholder": "Geben Sie Ihr Passwort ein",
    "login.button": "Anmelden",
    "login.demo": 'Demo-Modus: Verwenden Sie einen beliebigen Benutzernamen mit dem Passwort "1234"',
    "login.error": "Ungültige Anmeldeinformationen. Bitte versuchen Sie es erneut.",

    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.search": "Leads suchen",
    "nav.campaigns": "Kampagnen",
    "nav.history": "Verlauf",
    "nav.settings": "Einstellungen",
    "nav.logout": "Abmelden",
    "nav.profile": "Profil",

    // Dashboard
    "dashboard.stats.leads": "Leads insgesamt",
    "dashboard.stats.leads.desc": "Leads aus allen Suchen",
    "dashboard.stats.campaigns": "Gesendete Kampagnen",
    "dashboard.stats.campaigns.desc": "Zugestellte E-Mail-Kampagnen",
    "dashboard.stats.searches": "Durchgeführte Suchen",
    "dashboard.stats.searches.desc": "Insgesamt ausgeführte KI-Suchen",
    "dashboard.stats.openrate": "Durchschn. Öffnungsrate",
    "dashboard.stats.openrate.desc": "E-Mail-Kampagnenleistung",
    "dashboard.trend.title": "Lead-Akquisitionstrends",
    "dashboard.trend.subtitle": "Monatlich gefundene vs. kontaktierte Leads",
    "dashboard.trend.found": "Gefundene Leads",
    "dashboard.trend.contacted": "Kontaktierte Leads",
    "dashboard.activity": "Neueste Aktivitäten",
    "dashboard.activity.desc": "Ihre neuesten Aktionen und Updates",
    "dashboard.search.completed": "Suche abgeschlossen",
    "dashboard.search.found": "{count} Leads für {type}-Kunden gefunden",
    "dashboard.campaign.sent": "E-Mail-Kampagne gesendet",
    "dashboard.campaign.to": '"{subject}" an {count} Empfänger',

    // Search
    "search.websites.title": "Websites auswählen",
    "search.websites.placeholder": "Websites auswählen...",
    "search.websites.selected": "{count} Website(s) ausgewählt",
    "search.websites.search": "Websites suchen...",
    "search.websites.empty": "Keine Website gefunden.",
    "search.client.title": "Zielkundentyp",
    "search.client.placeholder": "Kundentyp auswählen...",
    "search.client.search": "Kundentypen suchen...",
    "search.client.empty": "Kein Kundentyp gefunden.",
    "search.button": "Leads suchen",
    "search.progress": "KI-Lead-Suche läuft",
    "search.analyzing": "Analysiere aktuell: {website}",

    // Search steps
    "search.step.1": "KI-Scraper wird initialisiert...",
    "search.step.2": "Verbindung zu Websites wird hergestellt...",
    "search.step.3": "Website-Struktur wird analysiert...",
    "search.step.4": "Kontaktinformationen werden extrahiert...",
    "search.step.5": "Filterung nach Zielkriterien...",
    "search.step.6": "E-Mail-Adressen werden validiert...",
    "search.step.7": "Lead-Daten werden zusammengestellt...",
    "search.step.8": "Ergebnisse werden finalisiert...",

    // Results
    "results.title": "Lead-Ergebnisse",
    "results.search": "Leads suchen...",
    "results.empty": "Keine Ergebnisse gefunden.",
    "results.selected": "{selected} von {total} Leads ausgewählt",
    "results.name": "Name",
    "results.company": "Unternehmen",
    "results.email": "E-Mail",
    "results.website": "Website",
    "results.campaign.button": "E-Mail-Kampagne erstellen",

    // History
    "history.search.title": "Suchverlauf",
    "history.search.desc": "Sehen und wiederholen Sie Ihre vorherigen Suchen",
    "history.search.filter": "Verlauf filtern...",
    "history.search.empty": "Kein Suchverlauf gefunden.",
    "history.search.date": "Datum",
    "history.search.websites": "Websites",
    "history.search.type": "Kundentyp",
    "history.search.found": "Gefundene Leads",
    "history.search.contacted": "Kontaktiert",
    "history.search.actions": "Aktionen",
    "history.search.rerun": "Suche wiederholen",
    "history.search.view": "Leads anzeigen",

    "history.email.title": "E-Mail-Kampagnen",
    "history.email.desc": "Verfolgen Sie die Leistung Ihrer E-Mail-Kampagnen",
    "history.email.search": "Kampagnen suchen...",
    "history.email.empty": "Keine Kampagnen gefunden.",
    "history.email.date": "Datum",
    "history.email.subject": "Betreff",
    "history.email.recipients": "Empfänger",
    "history.email.open": "Öffnungsrate",
    "history.email.click": "Klickrate",
    "history.email.actions": "Aktionen",
    "history.email.view": "Details anzeigen",
    "history.email.duplicate": "Kampagne duplizieren",

    // Months
    "month.jan": "Jan",
    "month.feb": "Feb",
    "month.mar": "Mär",
    "month.apr": "Apr",
    "month.may": "Mai",
    "month.jun": "Jun",
    "month.jul": "Jul",
    "month.aug": "Aug",
    "month.sep": "Sep",
    "month.oct": "Okt",
    "month.nov": "Nov",
    "month.dec": "Dez",

    // Client types
    "client.industrial": "Industrieunternehmen",
    "client.solar": "Solarinstallateure",
    "client.energy": "Energieberater",
    "client.residential": "Wohnungsbauunternehmen",
    "client.commercial": "Gewerbliche Immobilienverwalter",

    // Websites
    "website.solarinstallers": "Solarinstallateure",
    "website.greenenergy": "Grüne Energieunternehmen",
    "website.ecoconsultants": "Öko-Berater",
    "website.renewableenergy": "Erneuerbare Energie",
    "website.sustainablesolutions": "Nachhaltige Lösungen",

    // Notifications
    "notification.leads": "Neue Leads verfügbar",
    "notification.leads.desc": "15 neue Leads aus Ihrer letzten Suche",
    "notification.campaign": "Kampagne abgeschlossen",
    "notification.campaign.desc": "Ihre E-Mail-Kampagne wurde gesendet",
    "notification.system": "Systemaktualisierung",
    "notification.system.desc": "Neue Funktionen wurden hinzugefügt",
    "notification.time.hours": "Vor {count} Stunden",
    "notification.time.yesterday": "Gestern",
    "notification.time.days": "Vor {count} Tagen",

    // Time
    "time.from.month": "vom letzten Monat",

    // EmailComposer
    "email.campaign.title": "E-Mail-Kampagne",
    "email.campaign.desc": "Verfassen Sie Ihre E-Mail an {count} ausgewählte Leads",
    "email.recipients": "Empfänger",
    "email.content": "E-Mail-Inhalt",
    "email.placeholders":
      "Verwenden Sie [Contact Name] und [Company Name] als Platzhalter, die automatisch ersetzt werden.",
    "email.send": "Kampagne senden",
    "email.success.title": "Erfolg!",
    "email.success.desc": "E-Mail-Kampagne an {count} ausgewählte Leads gesendet.",

    // Onboarding
    "onboarding.welcome.title": "Willkommen bei Ritter Finder!",
    "onboarding.welcome.description":
      "Entdecken Sie, wie unsere KI-gestützte Plattform Ihnen helfen kann, hochwertige Leads im Bereich erneuerbare Energien zu finden.",
    "onboarding.search.title": "Lead-Suche",
    "onboarding.search.description":
      "Wählen Sie Websites zur Suche und den Zielkundentyp aus. Unsere KI analysiert diese Websites.",
    "onboarding.results.title": "Lead-Ergebnisse",
    "onboarding.results.description":
      "Überprüfen Sie gefundene Leads, wählen Sie die relevantesten aus und bereiten Sie personalisierte E-Mail-Kampagnen vor.",
    "onboarding.campaigns.title": "E-Mail-Kampagnen",
    "onboarding.campaigns.description": "Erstellen Sie personalisierte E-Mail-Kampagnen für Ihre ausgewählten Leads.",
    "onboarding.history.title": "Verlauf & Analysen",
    "onboarding.history.description":
      "Greifen Sie auf Ihren Such- und Kampagnenverlauf zu. Analysieren Sie Ihre Kampagnenleistung.",
    "onboarding.next": "Weiter",
    "onboarding.previous": "Zurück",
    "onboarding.skip": "Überspringen",
    "onboarding.finish": "Fertigstellen",
    "onboarding.email.title": "E-Mail-Erstellung",
    "onboarding.email.description":
      "Passen Sie Ihre E-Mails mit vordefinierten Vorlagen an. Sie können Variablen wie [Contact Name] verwenden.",

    // Scraping Stats
    "scraping.title": "Scraping-Statistiken",
    "scraping.subtitle": "Echtzeitdaten aus automatisierter Lead-Sammlung",
    "scraping.sites.reviewed": "Überprüfte Websites",
    "scraping.sites.desc": "Insgesamt analysierte Websites",
    "scraping.leads.obtained": "Erhaltene Leads",
    "scraping.leads.desc": "Gültige extrahierte Kontakte",
    "scraping.money.saved": "Gesparte Kosten",
    "scraping.money.desc": "Vs. traditioneller Lead-Kauf",
    "scraping.success.rate": "Erfolgsrate",
    "scraping.success.desc": "Websites mit gültigen Leads",
    "scraping.daily.performance": "Tägliche Leistung",
    "scraping.top.sources": "Top-Quellen",
    "scraping.avg.leads": "Durchschnittliche Leads pro Website",
    "scraping.cost.avoided": "Vermiedene Kosten pro Lead",
    "scraping.automated": "Automatisiertes Scraping",
    "scraping.updated": "Aktualisiert",
    "scraping.saved": "gespart",
  },
}

// Proveedor del contexto de idioma
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [isClient, setIsClient] = useState(false)

  // Solo ejecutar en el cliente para evitar problemas de hidratación
  useEffect(() => {
    setIsClient(true)
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "es" || savedLanguage === "en" || savedLanguage === "de")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Guardar el idioma en localStorage cuando cambie
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("language", language)
    }
  }, [language, isClient])

  // Función para obtener una traducción
  const t = (key: string): string => {
    return translations[language]?.[key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// Hook para usar el contexto de idioma
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// Función para formatear textos con variables
export function formatMessage(message: string, variables: Record<string, any>): string {
  return Object.entries(variables).reduce((acc, [key, value]) => {
    return acc.replace(new RegExp(`{${key}}`, "g"), value.toString())
  }, message)
}
