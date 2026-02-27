/**
 * Supabase database types for the api_keys table.
 * Matches supabase-schema.sql.
 */
export interface ApiKeyRow {
  id: string;
  name: string;
  key: string;
  description: string | null;
  permissions: string[] | null;
  expires_at: string | null;
  created_at: string;
  last_used: string | null;
  is_active: boolean;
  usage: number;
  monthly_usage_limit: number | null;
  user_id: string | null;
  created_at_iso?: string;
}

export interface ApiKeyInsert {
  id?: string;
  name: string;
  key: string;
  description?: string | null;
  permissions?: string[] | null;
  expires_at?: string | null;
  created_at?: string;
  last_used?: string | null;
  is_active?: boolean;
  usage?: number;
  monthly_usage_limit?: number | null;
  user_id?: string | null;
  created_at_iso?: string;
}

export interface ApiKeyUpdate {
  id?: string;
  name?: string;
  key?: string;
  description?: string | null;
  permissions?: string[] | null;
  expires_at?: string | null;
  created_at?: string;
  last_used?: string | null;
  is_active?: boolean;
  usage?: number;
  monthly_usage_limit?: number | null;
  user_id?: string | null;
  created_at_iso?: string;
}

export interface Database {
  public: {
    Tables: {
      api_keys: {
        Row: ApiKeyRow;
        Insert: ApiKeyInsert;
        Update: ApiKeyUpdate;
      };
    };
    Functions: {
      validate_api_key: {
        Args: { p_input_key: string };
        Returns: boolean;
      };
    };
  };
}
