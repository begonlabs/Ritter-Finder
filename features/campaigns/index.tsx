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
export { useEmailTemplates } from './hooks/useEmailTemplates'
export { useCampaignHistory } from './hooks/useCampaignHistory'

// Styles
export { default as campaignPageStyles } from './styles/CampaignPage.module.css'
export { default as emailComposerStyles } from './styles/EmailComposer.module.css'
export { default as composeTabStyles } from './styles/ComposeTab.module.css'
export { default as recipientsTabStyles } from './styles/RecipientsTab.module.css'
export { default as previewTabStyles } from './styles/PreviewTab.module.css'
export { default as emailHistoryStyles } from './styles/EmailHistory.module.css'
export { default as campaignSuccessStyles } from './styles/CampaignSuccess.module.css'

// Types
export type {
  Lead,
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
  UseTemplatesReturn
} from './types'

// Hook Types
export type { UseEmailComposerReturn } from './hooks/useEmailComposer'
