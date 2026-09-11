/**
 * Hand-maintained types for the Supabase schema in
 * `supabase/migrations/20260911000001_init.sql`. Regenerate with
 * `supabase gen types typescript --project-id <ref> > src/lib/database.types.ts`
 * once the project is linked, if preferred.
 */

export type UserRole = 'company' | 'creator'
export type CampaignStatus = 'draft' | 'published' | 'closed' | 'completed'
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'
export type CollaborationStatus = 'invited' | 'accepted' | 'declined' | 'draft_ready' | 'scheduled' | 'live' | 'completed' | 'cancelled'
export type PaymentStatus = 'scheduled' | 'paid' | 'failed'

type Timestamps = { created_at: string; updated_at: string }

export type ProfileRow = Timestamps & {
  id: string
  role: UserRole
  email: string
  full_name: string | null
  avatar_url: string | null
  locale: 'en' | 'fr'
  role_locked: boolean
  onboarding_completed: boolean
}

export type CompanyRow = Timestamps & {
  id: string
  owner_id: string
  name: string
  website: string | null
  industry: string | null
  size: string | null
  country: string | null
  logo_url: string | null
  description: string | null
}

export type CreatorRow = Timestamps & {
  id: string
  user_id: string | null
  slug: string
  name: string
  headline: string | null
  position: string | null
  bio: string | null
  avatar_url: string | null
  country: string | null
  languages: string[]
  sectors: string[]
  linkedin_url: string | null
  followers: number | null
  median_views: number | null
  avg_reactions: number | null
  avg_comments: number | null
  engagement_rate: number | null
  price_cents: number | null
  bundle_posts: number | null
  bundle_price_cents: number | null
  accepting_bookings: boolean
  is_public: boolean
  stats_updated_at: string | null
}

export type CreatorPostRow = {
  id: string
  creator_id: string
  kind: string | null
  body: string
  reactions: number
  comments: number
  url: string | null
  via_naano: boolean
  posted_at: string | null
  created_at: string
}

export type CampaignRow = Timestamps & {
  id: string
  company_id: string
  title: string
  description: string
  objective: string | null
  brief: string | null
  creator_requirements: string | null
  target_audience: string | null
  industry: string | null
  sectors: string[]
  min_followers: number | null
  budget_cents: number
  price_per_post_cents: number | null
  posts_wanted: number
  start_date: string | null
  end_date: string | null
  status: CampaignStatus
  published_at: string | null
}

export type ApplicationRow = Timestamps & {
  id: string
  campaign_id: string
  creator_id: string
  status: ApplicationStatus
  message: string | null
  proposed_price_cents: number | null
}

export type CollaborationRow = Timestamps & {
  id: string
  campaign_id: string
  company_id: string
  creator_id: string
  application_id: string | null
  status: CollaborationStatus
  agreed_price_cents: number
  brief: string | null
  post_url: string | null
  due_date: string | null
  scheduled_at: string | null
  published_at: string | null
  completed_at: string | null
}

export type MetricsRow = {
  collaboration_id: string
  impressions: number
  clicks: number
  leads: number
  pipeline_cents: number
  updated_at: string
}

export type PaymentRow = Timestamps & {
  id: string
  collaboration_id: string
  company_id: string
  creator_id: string
  amount_cents: number
  currency: string
  status: PaymentStatus
  scheduled_for: string | null
  paid_at: string | null
}

export type BookmarkRow = { company_id: string; creator_id: string; created_at: string }

export type ConversationRow = {
  id: string
  company_id: string
  creator_id: string
  campaign_id: string | null
  last_message_at: string | null
  created_at: string
}

export type MessageRow = {
  id: string
  conversation_id: string
  sender_id: string
  body: string
  read_at: string | null
  created_at: string
}

export type NotificationRow = {
  id: string
  user_id: string
  kind: string
  title: string
  body: string | null
  href: string | null
  read_at: string | null
  created_at: string
}

export type CompanyDashboard = {
  campaigns_total: number
  campaigns_active: number
  applications_pending: number
  collaborations_active: number
  posts_live: number
  impressions: number
  clicks: number
  leads: number
  pipeline_cents: number
  spend_cents: number
  bookmarks: number
}

export type CreatorDashboard = {
  applications_pending: number
  invitations_pending: number
  collaborations_active: number
  posts_live: number
  impressions: number
  clicks: number
  leads: number
  earned_cents: number
  pending_cents: number
  open_campaigns: number
}

type Rel = { foreignKeyName: string; columns: string[]; isOneToOne: boolean; referencedRelation: string; referencedColumns: string[] }
type Table<Row, Insert = Partial<Row>, Update = Partial<Row>, Relationships extends Rel[] = []> = { Row: Row; Insert: Insert; Update: Update; Relationships: Relationships }

export type Database = {
  public: {
    Tables: {
      profiles: Table<ProfileRow>
      companies: Table<CompanyRow, Omit<Partial<CompanyRow>, 'name' | 'owner_id'> & { name: string; owner_id: string }, Partial<CompanyRow>, [{ foreignKeyName: 'companies_owner_id_fkey'; columns: ['owner_id']; isOneToOne: true; referencedRelation: 'profiles'; referencedColumns: ['id'] }]>
      creators: Table<CreatorRow, Omit<Partial<CreatorRow>, 'slug' | 'name'> & { slug: string; name: string }, Partial<CreatorRow>, [{ foreignKeyName: 'creators_user_id_fkey'; columns: ['user_id']; isOneToOne: true; referencedRelation: 'profiles'; referencedColumns: ['id'] }]>
      creator_posts: Table<CreatorPostRow, Partial<CreatorPostRow>, Partial<CreatorPostRow>, [{ foreignKeyName: 'creator_posts_creator_id_fkey'; columns: ['creator_id']; isOneToOne: false; referencedRelation: 'creators'; referencedColumns: ['id'] }]>
      campaigns: Table<CampaignRow, Omit<Partial<CampaignRow>, 'company_id' | 'title' | 'budget_cents'> & { company_id: string; title: string; budget_cents: number }, Partial<CampaignRow>, [{ foreignKeyName: 'campaigns_company_id_fkey'; columns: ['company_id']; isOneToOne: false; referencedRelation: 'companies'; referencedColumns: ['id'] }]>
      campaign_applications: Table<
        ApplicationRow,
        Omit<Partial<ApplicationRow>, 'campaign_id' | 'creator_id'> & { campaign_id: string; creator_id: string },
        Partial<ApplicationRow>,
        [{ foreignKeyName: 'campaign_applications_campaign_id_fkey'; columns: ['campaign_id']; isOneToOne: false; referencedRelation: 'campaigns'; referencedColumns: ['id'] }, { foreignKeyName: 'campaign_applications_creator_id_fkey'; columns: ['creator_id']; isOneToOne: false; referencedRelation: 'creators'; referencedColumns: ['id'] }]
      >
      collaborations: Table<
        CollaborationRow,
        Omit<Partial<CollaborationRow>, 'campaign_id' | 'company_id' | 'creator_id' | 'agreed_price_cents'> & {
          campaign_id: string
          company_id: string
          creator_id: string
          agreed_price_cents: number
        },
        Partial<CollaborationRow>,
        [
          { foreignKeyName: 'collaborations_campaign_id_fkey'; columns: ['campaign_id']; isOneToOne: false; referencedRelation: 'campaigns'; referencedColumns: ['id'] },
          { foreignKeyName: 'collaborations_company_id_fkey'; columns: ['company_id']; isOneToOne: false; referencedRelation: 'companies'; referencedColumns: ['id'] },
          { foreignKeyName: 'collaborations_creator_id_fkey'; columns: ['creator_id']; isOneToOne: false; referencedRelation: 'creators'; referencedColumns: ['id'] },
          { foreignKeyName: 'collaborations_application_id_fkey'; columns: ['application_id']; isOneToOne: false; referencedRelation: 'campaign_applications'; referencedColumns: ['id'] },
        ]
      >
      collaboration_metrics: Table<MetricsRow, Partial<MetricsRow>, Partial<MetricsRow>, [{ foreignKeyName: 'collaboration_metrics_collaboration_id_fkey'; columns: ['collaboration_id']; isOneToOne: true; referencedRelation: 'collaborations'; referencedColumns: ['id'] }]>
      payments: Table<
        PaymentRow,
        Partial<PaymentRow>,
        Partial<PaymentRow>,
        [
          { foreignKeyName: 'payments_collaboration_id_fkey'; columns: ['collaboration_id']; isOneToOne: true; referencedRelation: 'collaborations'; referencedColumns: ['id'] },
          { foreignKeyName: 'payments_company_id_fkey'; columns: ['company_id']; isOneToOne: false; referencedRelation: 'companies'; referencedColumns: ['id'] },
          { foreignKeyName: 'payments_creator_id_fkey'; columns: ['creator_id']; isOneToOne: false; referencedRelation: 'creators'; referencedColumns: ['id'] },
        ]
      >
      bookmarks: Table<BookmarkRow, { company_id: string; creator_id: string }, Partial<BookmarkRow>, [{ foreignKeyName: 'bookmarks_company_id_fkey'; columns: ['company_id']; isOneToOne: false; referencedRelation: 'companies'; referencedColumns: ['id'] }, { foreignKeyName: 'bookmarks_creator_id_fkey'; columns: ['creator_id']; isOneToOne: false; referencedRelation: 'creators'; referencedColumns: ['id'] }]>
      conversations: Table<
        ConversationRow,
        { company_id: string; creator_id: string; campaign_id?: string | null },
        Partial<ConversationRow>,
        [{ foreignKeyName: 'conversations_company_id_fkey'; columns: ['company_id']; isOneToOne: false; referencedRelation: 'companies'; referencedColumns: ['id'] }, { foreignKeyName: 'conversations_creator_id_fkey'; columns: ['creator_id']; isOneToOne: false; referencedRelation: 'creators'; referencedColumns: ['id'] }, { foreignKeyName: 'conversations_campaign_id_fkey'; columns: ['campaign_id']; isOneToOne: false; referencedRelation: 'campaigns'; referencedColumns: ['id'] }]
      >
      messages: Table<MessageRow, { conversation_id: string; sender_id: string; body: string }, Partial<MessageRow>, [{ foreignKeyName: 'messages_conversation_id_fkey'; columns: ['conversation_id']; isOneToOne: false; referencedRelation: 'conversations'; referencedColumns: ['id'] }, { foreignKeyName: 'messages_sender_id_fkey'; columns: ['sender_id']; isOneToOne: false; referencedRelation: 'profiles'; referencedColumns: ['id'] }]>
      notifications: Table<NotificationRow, Partial<NotificationRow>, Partial<NotificationRow>, [{ foreignKeyName: 'notifications_user_id_fkey'; columns: ['user_id']; isOneToOne: false; referencedRelation: 'profiles'; referencedColumns: ['id'] }]>
    }
    Views: Record<string, never>
    Functions: {
      company_dashboard: { Args: Record<string, never>; Returns: CompanyDashboard }
      creator_dashboard: { Args: Record<string, never>; Returns: CreatorDashboard }
      choose_role: { Args: { p_role: UserRole }; Returns: ProfileRow }
      my_company_id: { Args: Record<string, never>; Returns: string | null }
      my_creator_id: { Args: Record<string, never>; Returns: string | null }
      current_role_of_user: { Args: Record<string, never>; Returns: UserRole | null }
    }
    Enums: {
      user_role: UserRole
      campaign_status: CampaignStatus
      application_status: ApplicationStatus
      collaboration_status: CollaborationStatus
      payment_status: PaymentStatus
    }
    CompositeTypes: Record<string, never>
  }
}
