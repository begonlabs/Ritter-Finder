// Components
export { CampaignIntegration } from './components/CampaignIntegration'
export { CampaignSuccess } from './components/CampaignSuccess'
export { EmailComposer } from './components/EmailComposer'
export { ComposeTab } from './components/ComposeTab'
export { PreviewTab } from './components/PreviewTab'
export { RecipientsTab } from './components/RecipientsTab'
export { EmailHistory } from './components/EmailHistory'

// Pages
export { CampaignPage } from './pages/CampaignPage'

// Hooks
export { useEmailComposer } from './hooks/useEmailComposer'
export { useEmailTemplates } from './hooks/useEmailTemplates'
export { useLeadAdapter } from './hooks/useLeadAdapter'
export { useCampaignHistory } from './hooks/useCampaignHistory'

// Types
export type {
  Lead,
  NormalizedLead,
  Campaign,
  EmailTemplate,
  TemplateVariable,
  EmailComposerState,
  EmailComposerActions,
  CampaignHistory,
  CampaignHistoryActions,
  TemplateFilters,
  UseTemplatesReturn
} from './types'
