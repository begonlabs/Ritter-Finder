# History Module Styles Documentation

## Overview
This directory contains modular CSS files for the RitterFinder History feature, implementing the RitterMor Design System.

## File Structure
- `HistoryPage.module.css` - Main page layout and tabs
- `SearchHistory.module.css` - Search history table and filters  
- `CampaignHistory.module.css` - Campaign performance metrics
- `ActivityTimeline.module.css` - Timeline visualization

## Design System
- **Primary Gold**: `#F2B705` (ritter-gold)
- **Dark**: `#1A1E25` (ritter-dark)  
- **Light**: `#FFFFFF` (ritter-light)
- **Gray**: `#F5F5F5` (ritter-gray)

## Animation Patterns
- **slideInUp**: Container entry animations
- **fadeInUp**: Section transitions
- **slideInRight**: Timeline item animations
- **Progressive delays**: Staggered list animations

## Responsive Breakpoints
- Desktop: Full layouts
- Tablet (≤768px): Stacked layouts
- Mobile (≤640px): Compressed layouts

## Usage Example
```tsx
import styles from "../styles/HistoryPage.module.css"

<div className={styles.historyPage}>
  <div className={styles.historyHeader}>
    <h2 className={styles.historyTitle}>History</h2>
  </div>
</div>
```

## 🎨 Design System Integration

### RitterMor Color Palette
- **ritter-gold**: `#F2B705` - Primary gold for highlights and actions
- **ritter-dark**: `#1A1E25` - Dark blue/black for text and headers
- **ritter-light**: `#FFFFFF` - White for backgrounds
- **ritter-gray**: `#F5F5F5` - Light gray for subtle backgrounds

### Component-Specific Colors
- **Search Activity**: Blue tones (`#3b82f6`, `#eff6ff`)
- **Campaign Activity**: Purple tones (`#8b5cf6`, `#f3e8ff`)
- **Export Activity**: Green tones (`#10b981`, `#ecfdf5`)
- **Import Activity**: Orange tones (`#f59e0b`, `#fffbeb`)
- **System Activity**: Gray tones (`#6b7280`, `#f9fafb`)

## 🧩 Component Modules

### HistoryPage.module.css
Main container for the history feature with responsive tab system.

**Key Classes:**
- `.historyPage` - Main container with modular padding
- `.historyHeader` - Flexible header with title and actions
- `.tabsList` - Grid-based tab navigation
- `.tabContent` - Content area with proper spacing
- `.exportButton` - Export functionality button

### SearchHistory.module.css
Table-based display for search history with filtering capabilities.

**Key Features:**
- **Progressive animations**: Staggered entry for table rows
- **Advanced filtering**: Search and status filter integration
- **Status indicators**: Color-coded status badges
- **Stats grid**: Performance metrics display
- **Website tags**: Compact website display with truncation

**Animation Patterns:**
```css
.tableRow:nth-child(1) { animation-delay: 0.05s; }
.tableRow:nth-child(2) { animation-delay: 0.1s; }
/* Progressive delays for smooth entry */
```

### CampaignHistory.module.css
Campaign performance tracking with metrics and progress visualization.

**Key Features:**
- **Performance metrics**: Open rate and click rate visualization
- **Progress bars**: Animated progress indicators with gradients
- **Campaign types**: Color-coded campaign categorization
- **Status tracking**: Campaign lifecycle status indicators

**Progress Bar Styling:**
```css
.progressFill.openRate {
  background: linear-gradient(90deg, #10b981, #059669);
}
.progressFill.clickRate {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}
```

### ActivityTimeline.module.css
Comprehensive timeline visualization for user activity tracking.

**Key Features:**
- **Timeline markers**: Color-coded activity type indicators
- **Date grouping**: Organized activity by date with separators
- **Activity icons**: Contextual icons for different activity types
- **Hover interactions**: Reveal additional actions on hover
- **Pulse animations**: Error states with attention-drawing animations

**Timeline Structure:**
```css
.activityList {
  position: relative;
  padding-left: 1rem;
  border-left: 2px solid #f3f4f6;
}

.activityMarker {
  position: absolute;
  left: -1.375rem;
  /* Activity type specific colors */
}
```

## 🎬 Animation System

### Entry Animations
- **slideInUp**: Main containers (0.3s ease-out)
- **fadeInUp**: Date groups and sections (0.4s ease-out)
- **slideInRight**: Timeline items (0.4s ease-out)
- **scaleIn**: Statistics cards (0.4s ease-out)

### Interaction Animations
- **Progressive delays**: Staggered entry for list items
- **Hover transforms**: Subtle lift effects on cards
- **Pulse effects**: Error state attention-grabbing
- **Gold shadows**: Hover states with brand color

### Performance Optimizations
- **GPU acceleration**: Using `transform` and `opacity`
- **Hardware acceleration**: `will-change` for frequently animated elements
- **Reduced motion support**: Respects user preferences

## 📱 Responsive Design

### Breakpoint Strategy
- **Desktop**: Full feature set with side-by-side layouts
- **Tablet** (`≤768px`): Stacked layouts with maintained functionality
- **Mobile** (`≤640px`): Compressed layouts with essential information

### Layout Adaptations
```css
@media (max-width: 768px) {
  .statsGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .statsGrid {
    grid-template-columns: 1fr;
  }
}
```

## ♿ Accessibility Features

### Visual Accessibility
- **High contrast mode**: Enhanced contrast for accessibility
- **Focus indicators**: Clear focus states with RitterMor gold
- **Color blindness**: Pattern-based status indicators beyond color

### Motion Accessibility
```css
@media (prefers-reduced-motion: reduce) {
  .activityTimeline,
  .dateGroup,
  .activityItem {
    animation: none;
  }
}
```

### Screen Reader Support
- **Semantic structure**: Proper heading hierarchy
- **Screen reader text**: Hidden descriptive text for context
- **ARIA labels**: Comprehensive labeling for complex interactions

## 🔧 Integration Patterns

### CSS Module Usage
```tsx
import styles from "../styles/HistoryPage.module.css"

<div className={`${styles.historyPage} ${compact ? styles.compact : ''}`}>
  <div className={styles.historyHeader}>
    <h2 className={styles.historyTitle}>History</h2>
  </div>
</div>
```

### Conditional Styling
```tsx
// Compact mode support
className={`${styles.header} ${compact ? styles.compact : ''}`}

// Activity type variants
className={`${styles.activityIcon} ${styles[activity.type]}`}

// Status-based styling
className={`${styles.statusBadge} ${styles[status]}`}
```

### Component Communication
- **Prop-based styling**: `compact`, `showActions`, `groupByDate`
- **State-driven classes**: Active states, loading states
- **Theme integration**: RitterMor color system

## 🚀 Performance Considerations

### CSS Optimizations
- **Modular imports**: Only load required styles
- **GPU acceleration**: Transform-based animations
- **Efficient selectors**: Class-based targeting

### Bundle Size
- **Shared variables**: Common values extracted to CSS custom properties
- **Utility classes**: Reusable patterns for common styling
- **Tree shaking**: Unused styles eliminated in production

## 🎯 Usage Guidelines

### Component Integration
1. Import the appropriate CSS module
2. Apply base classes to container elements
3. Use conditional classes for state variations
4. Implement responsive patterns with provided breakpoints

### Customization
- **Color variables**: Override CSS custom properties for theming
- **Animation timing**: Adjust duration and easing for different feels
- **Spacing scales**: Modify padding and margin for different densities

### Best Practices
- **Consistent naming**: Follow established class naming conventions
- **Modular structure**: Keep components self-contained
- **Performance first**: Use efficient animation techniques
- **Accessibility**: Always include accessibility considerations

## 🔮 Future Enhancements

### Planned Features
- **Dark mode support**: Complete dark theme implementation
- **Advanced filtering**: Enhanced search and filter capabilities
- **Data visualization**: Charts and graphs for activity trends
- **Export options**: Styled export interfaces

### Extensibility
- **Plugin system**: Modular activity type additions
- **Theme variants**: Alternative color schemes
- **Layout options**: Different timeline visualization modes 