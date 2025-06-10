// Pages
export { CampaignPage } from './pages/CampaignPage'

// Main components
export { EmailComposer } from './components/EmailComposer'
export { EmailHistory } from './components/EmailHistory'
export { CampaignSuccess } from './components/CampaignSuccess'

// Sub-components
export { ComposeTab } from './components/ComposeTab'
export { RecipientsTab } from './components/RecipientsTab'
export { PreviewTab } from './components/PreviewTab'

// Hooks
export { useEmailComposer } from './hooks/useEmailComposer'
export { useCampaignHistory } from './hooks/useCampaignHistory'

// Types
export type {
  Lead,
  EmailTemplate,
  Campaign,
  EmailComposerState,
  EmailComposerActions,
  CampaignHistory,
  CampaignHistoryActions,
  Language,
  TemplateData,
  CampaignTabProps
} from './types'
