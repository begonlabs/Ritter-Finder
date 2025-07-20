// Components
export { CampaignIntegration } from './components/CampaignIntegration'
export { CampaignSuccess } from './components/CampaignSuccess'
export { ComposeTab } from './components/ComposeTab'
export { EmailComposer } from './components/EmailComposer'
export { EmailHistory } from './components/EmailHistory'
export { Pagination } from './components/Pagination'
export { PreviewTab } from './components/PreviewTab'
export { RecipientsTab } from './components/RecipientsTab'

// Pages
export { CampaignPage } from './pages/CampaignPage'

// Hooks
export { useCampaignHistory } from './hooks/useCampaignHistory'
export { useEmailComposer } from './hooks/useEmailComposer'
export { useEmailTemplates } from './hooks/useEmailTemplates'
export { useLeadAdapter } from './hooks/useLeadAdapter'
export { usePagination } from './hooks/usePagination'

// Types
export type {
  Lead,
  NormalizedLead,
  LeadAdapter,
  EmailTemplate,
  TemplateVariable,
  Campaign,
  EmailComposerState,
  EmailComposerActions,
  CampaignHistory,
  CampaignHistoryActions,
  Language,
  TemplateData,
  CampaignTabProps,
  TemplateFilters,
  UseTemplatesReturn,
  PaginationState,
  PaginationActions,
  PaginationInfo,
  PaginationReturn
} from './types' 