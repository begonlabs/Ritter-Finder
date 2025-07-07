# History Module - Supabase Integration

## Overview
The History module has been updated to connect with Supabase instead of using mock data. It supports activity logs, campaign history, and search history with real-time data from your Supabase database.

## Database Schema Requirements

### Required Tables

The following tables need to exist in your Supabase database. You can create them using the SQL script at `models/history/history.sql`:

#### 1. activity_logs
```sql
-- Stores all user activity for timeline
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  activity_type VARCHAR(50) NOT NULL,
  action VARCHAR(255) NOT NULL,
  description TEXT,
  resource_type VARCHAR(100),
  resource_id UUID,
  timestamp TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  before_data JSONB,
  after_data JSONB,
  changes JSONB
);
```

#### 2. search_history
```sql
-- Stores search execution history
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  query_name TEXT,
  search_parameters JSONB,
  filters_applied JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  total_results INTEGER DEFAULT 0,
  valid_results INTEGER DEFAULT 0,
  duplicate_results INTEGER DEFAULT 0,
  execution_time_ms INTEGER DEFAULT 0,
  pages_scraped INTEGER DEFAULT 0,
  websites_searched INTEGER DEFAULT 0,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  error_message TEXT,
  search_config_id UUID
);
```

#### 3. campaigns
```sql
-- Stores email campaign data
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id),
  template_id UUID,
  total_recipients INTEGER DEFAULT 0,
  emails_sent INTEGER DEFAULT 0,
  emails_delivered INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  open_rate DECIMAL(5,2) DEFAULT 0,
  click_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  subject TEXT,
  content TEXT
);
```

### Views (Optional but Recommended)

The module also supports these views for enhanced functionality:

- `comprehensive_activity_history` - Joins activity logs with user and resource data
- `campaign_history` - Enhanced campaign data with user names and template info
- `search_history_detailed` - Search history with calculated duration and status mapping

## Features

### 🔄 Real-time Data Loading
- Fetches data directly from Supabase tables
- Automatic fallback to base tables if views aren't available
- User-specific data filtering (supports anonymous users)

### 📊 Activity Timeline
- Tracks all user activities (searches, campaigns, exports, etc.)
- Intelligent activity type detection and title generation
- Metadata extraction from activity changes
- Status determination based on activity actions

### 📧 Campaign History
- Lists all email campaigns with performance metrics
- Campaign duplication functionality
- Campaign deletion with database synchronization
- Performance statistics calculation

### 🔍 Search History
- Complete search execution history
- Search parameter and filter preservation
- Search deletion functionality
- Performance metrics and success rate calculation

## Integration Details

### User Identification
The module uses a consistent user identification approach:
- Authenticated users: Uses their Supabase user ID
- Anonymous users: Uses fixed UUID `550e8400-e29b-41d4-a716-446655440000`

### Data Adapters
Each hook includes adapter functions that convert database records to frontend-compatible types:
- `adaptActivityView()` - Converts activity log records
- `adaptCampaignView()` - Converts campaign records  
- `adaptSearchView()` - Converts search history records

### Error Handling
- Graceful fallback to base tables if views aren't available
- Comprehensive error logging for debugging
- Empty state handling when no data is available
- Loading states for better UX

## Testing the Integration

### 1. Database Setup
Run the SQL script to create required tables:
```bash
# Apply the history schema
psql -h your-supabase-host -U postgres -d postgres -f models/history/history.sql
```

### 2. Verify Tables
Check that the required tables exist in your Supabase dashboard:
- `activity_logs`
- `search_history` 
- `campaigns`

### 3. Test Components
Navigate to the History page in your app:
```
/dashboard → History Tab
```

### 4. Monitor Console
Watch the browser console for:
- `🔄 Loading [type] for user: [user-id]` - Data loading starts
- `✅ Loaded [count] records from [source]` - Successful data fetch
- `📊 [Table] view not available, falling back...` - View fallback
- `❌ Error loading [type]:` - Error messages

### 5. Expected Behavior
- **Empty State**: Shows "No [type] available" when tables are empty
- **Loading State**: Shows loading spinner during data fetch
- **Error State**: Shows error message if tables don't exist
- **Data Display**: Shows actual data when available

## Development Notes

### Adding New Activity Types
To add new activity types:

1. Update the `ActivityLogRecord` interface in `types/index.ts`
2. Add the new type to `generateActivityTitle()` in `useActivityTimeline.ts`
3. Update metadata extraction logic in `adaptActivityView()`

### Extending Search Parameters
To support new search parameters:

1. Update the adapter functions in `useSearchHistory.ts`
2. Modify parameter extraction logic in `adaptSearchView()`
3. Add new filter types to the `SearchFilters` interface

### Performance Optimization
- Tables include proper indexes on user_id and timestamp fields
- Queries are limited to reasonable result counts (50-100 records)
- Views provide pre-calculated data for better performance

## Troubleshooting

### "Table doesn't exist" errors
1. Verify the table was created in Supabase
2. Check RLS (Row Level Security) policies
3. Ensure user has proper permissions

### "No data loading"
1. Check user authentication status
2. Verify user_id in database matches current user
3. Look for RLS policy restrictions

### "View not available" warnings
This is normal - the app will fall back to base tables automatically.

## File Structure
```
features/history/
├── hooks/
│   ├── useActivityTimeline.ts    # ✅ Supabase integrated
│   ├── useCampaignHistory.ts     # ✅ Supabase integrated  
│   └── useSearchHistory.ts       # ✅ Supabase integrated
├── types/
│   └── index.ts                  # ✅ Database types added
├── components/                   # ✅ No changes needed
├── pages/                        # ✅ No changes needed
└── styles/                       # ✅ No changes needed
```

The integration is complete and all hooks now use real Supabase data instead of mock data while maintaining full backward compatibility with the existing UI components. 