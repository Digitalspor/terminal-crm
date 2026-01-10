export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      agencies: {
        Row: {
          billing_system: string | null;
          created_at: string | null;
          gmail_email: string | null;
          id: string;
          name: string;
          settings: Json | null;
          tripletex_project_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          billing_system?: string | null;
          created_at?: string | null;
          gmail_email?: string | null;
          id?: string;
          name: string;
          settings?: Json | null;
          tripletex_project_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          billing_system?: string | null;
          created_at?: string | null;
          gmail_email?: string | null;
          id?: string;
          name?: string;
          settings?: Json | null;
          tripletex_project_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      agency_integrations: {
        Row: {
          access_token: string | null;
          account_email: string | null;
          agency_id: string;
          api_key: string | null;
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          provider: string;
          refresh_token: string | null;
          settings: Json | null;
          token_expires_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          access_token?: string | null;
          account_email?: string | null;
          agency_id: string;
          api_key?: string | null;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          provider: string;
          refresh_token?: string | null;
          settings?: Json | null;
          token_expires_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          access_token?: string | null;
          account_email?: string | null;
          agency_id?: string;
          api_key?: string | null;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          provider?: string;
          refresh_token?: string | null;
          settings?: Json | null;
          token_expires_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "agency_integrations_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
        ];
      };
      agent_executions: {
        Row: {
          agency_id: string | null;
          agent_name: string;
          completed_at: string | null;
          created_at: string | null;
          error_message: string | null;
          execution_time_ms: number | null;
          id: string;
          input_data: Json | null;
          output_data: Json | null;
          started_at: string | null;
          status: string | null;
          task_id: string | null;
          tokens_used: number | null;
        };
        Insert: {
          agency_id?: string | null;
          agent_name: string;
          completed_at?: string | null;
          created_at?: string | null;
          error_message?: string | null;
          execution_time_ms?: number | null;
          id?: string;
          input_data?: Json | null;
          output_data?: Json | null;
          started_at?: string | null;
          status?: string | null;
          task_id?: string | null;
          tokens_used?: number | null;
        };
        Update: {
          agency_id?: string | null;
          agent_name?: string;
          completed_at?: string | null;
          created_at?: string | null;
          error_message?: string | null;
          execution_time_ms?: number | null;
          id?: string;
          input_data?: Json | null;
          output_data?: Json | null;
          started_at?: string | null;
          status?: string | null;
          task_id?: string | null;
          tokens_used?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "agent_executions_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "agent_executions_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      agent_logs: {
        Row: {
          id: string;
          agency_id: string | null;
          agent_name: string;
          agent_version: string | null;
          task_id: string | null;
          email_id: string | null;
          status: string;
          message: string | null;
          input_summary: string | null;
          output_summary: string | null;
          error_message: string | null;
          error_stack: string | null;
          duration_ms: number | null;
          tokens_used: number | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          agency_id?: string | null;
          agent_name: string;
          agent_version?: string | null;
          task_id?: string | null;
          email_id?: string | null;
          status: string;
          message?: string | null;
          input_summary?: string | null;
          output_summary?: string | null;
          error_message?: string | null;
          error_stack?: string | null;
          duration_ms?: number | null;
          tokens_used?: number | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          agency_id?: string | null;
          agent_name?: string;
          agent_version?: string | null;
          task_id?: string | null;
          email_id?: string | null;
          status?: string;
          message?: string | null;
          input_summary?: string | null;
          output_summary?: string | null;
          error_message?: string | null;
          error_stack?: string | null;
          duration_ms?: number | null;
          tokens_used?: number | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "agent_logs_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "agent_logs_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      agent_alerts: {
        Row: {
          id: string;
          agency_id: string | null;
          log_id: string | null;
          severity: string;
          title: string;
          description: string | null;
          acknowledged_at: string | null;
          acknowledged_by: string | null;
          resolved_at: string | null;
          resolved_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          agency_id?: string | null;
          log_id?: string | null;
          severity: string;
          title: string;
          description?: string | null;
          acknowledged_at?: string | null;
          acknowledged_by?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          agency_id?: string | null;
          log_id?: string | null;
          severity?: string;
          title?: string;
          description?: string | null;
          acknowledged_at?: string | null;
          acknowledged_by?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "agent_alerts_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "agent_alerts_log_id_fkey";
            columns: ["log_id"];
            isOneToOne: false;
            referencedRelation: "agent_logs";
            referencedColumns: ["id"];
          },
        ];
      };
      customers: {
        Row: {
          agency_id: string;
          billing_email: string | null;
          created_at: string | null;
          email: string | null;
          id: string;
          is_active: boolean | null;
          kinsta_environment: string | null;
          kinsta_site_id: string | null;
          name: string;
          notes: string | null;
          org_number: string | null;
          parent_customer_id: string | null;
          phone: string | null;
          tags: string[] | null;
          updated_at: string | null;
          wordpress_admin_user: string | null;
          wordpress_url: string | null;
        };
        Insert: {
          agency_id: string;
          billing_email?: string | null;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          is_active?: boolean | null;
          kinsta_environment?: string | null;
          kinsta_site_id?: string | null;
          name: string;
          notes?: string | null;
          org_number?: string | null;
          parent_customer_id?: string | null;
          phone?: string | null;
          tags?: string[] | null;
          updated_at?: string | null;
          wordpress_admin_user?: string | null;
          wordpress_url?: string | null;
        };
        Update: {
          agency_id?: string;
          billing_email?: string | null;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          is_active?: boolean | null;
          kinsta_environment?: string | null;
          kinsta_site_id?: string | null;
          name?: string;
          notes?: string | null;
          org_number?: string | null;
          parent_customer_id?: string | null;
          phone?: string | null;
          tags?: string[] | null;
          updated_at?: string | null;
          wordpress_admin_user?: string | null;
          wordpress_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "customers_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "customers_parent_customer_id_fkey";
            columns: ["parent_customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      emails: {
        Row: {
          agency_id: string;
          body_html: string | null;
          body_text: string | null;
          classification_json: Json | null;
          created_at: string | null;
          customer_id: string | null;
          from_email: string;
          from_name: string | null;
          gmail_message_id: string;
          gmail_thread_id: string | null;
          id: string;
          is_processed: boolean | null;
          processed_at: string | null;
          processing_error: string | null;
          received_at: string | null;
          subject: string | null;
          task_id: string | null;
          to_email: string | null;
        };
        Insert: {
          agency_id: string;
          body_html?: string | null;
          body_text?: string | null;
          classification_json?: Json | null;
          created_at?: string | null;
          customer_id?: string | null;
          from_email: string;
          from_name?: string | null;
          gmail_message_id: string;
          gmail_thread_id?: string | null;
          id?: string;
          is_processed?: boolean | null;
          processed_at?: string | null;
          processing_error?: string | null;
          received_at?: string | null;
          subject?: string | null;
          task_id?: string | null;
          to_email?: string | null;
        };
        Update: {
          agency_id?: string;
          body_html?: string | null;
          body_text?: string | null;
          classification_json?: Json | null;
          created_at?: string | null;
          customer_id?: string | null;
          from_email?: string;
          from_name?: string | null;
          gmail_message_id?: string;
          gmail_thread_id?: string | null;
          id?: string;
          is_processed?: boolean | null;
          processed_at?: string | null;
          processing_error?: string | null;
          received_at?: string | null;
          subject?: string | null;
          task_id?: string | null;
          to_email?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "emails_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "emails_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "emails_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      invoice_drafts: {
        Row: {
          agency_id: string;
          billing_system: string | null;
          created_at: string | null;
          currency: string | null;
          customer_id: string;
          due_date: string | null;
          external_id: string | null;
          id: string;
          invoice_date: string | null;
          invoice_number: string | null;
          line_items: Json;
          notes: string | null;
          status: string | null;
          subtotal: number | null;
          synced_at: string | null;
          task_ids: string[] | null;
          total_amount: number | null;
          updated_at: string | null;
          vat_amount: number | null;
          vat_rate: number | null;
        };
        Insert: {
          agency_id: string;
          billing_system?: string | null;
          created_at?: string | null;
          currency?: string | null;
          customer_id: string;
          due_date?: string | null;
          external_id?: string | null;
          id?: string;
          invoice_date?: string | null;
          invoice_number?: string | null;
          line_items?: Json;
          notes?: string | null;
          status?: string | null;
          subtotal?: number | null;
          synced_at?: string | null;
          task_ids?: string[] | null;
          total_amount?: number | null;
          updated_at?: string | null;
          vat_amount?: number | null;
          vat_rate?: number | null;
        };
        Update: {
          agency_id?: string;
          billing_system?: string | null;
          created_at?: string | null;
          currency?: string | null;
          customer_id?: string;
          due_date?: string | null;
          external_id?: string | null;
          id?: string;
          invoice_date?: string | null;
          invoice_number?: string | null;
          line_items?: Json;
          notes?: string | null;
          status?: string | null;
          subtotal?: number | null;
          synced_at?: string | null;
          task_ids?: string[] | null;
          total_amount?: number | null;
          updated_at?: string | null;
          vat_amount?: number | null;
          vat_rate?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "invoice_drafts_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoice_drafts_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks: {
        Row: {
          actual_hours: number | null;
          agency_id: string;
          assigned_to: string | null;
          category: string | null;
          client_response_email_id: string | null;
          client_response_sent_at: string | null;
          created_at: string | null;
          customer_id: string | null;
          deadline: string | null;
          description: string | null;
          estimated_hours: number | null;
          execution_completed_at: string | null;
          execution_log: Json | null;
          execution_started_at: string | null;
          hourly_rate: number | null;
          id: string;
          invoice_draft_id: string | null;
          plan_approved_at: string | null;
          plan_approved_by: string | null;
          plan_created_at: string | null;
          plan_json: Json | null;
          plan_rejection_reason: string | null;
          priority: string | null;
          source: string | null;
          source_email_id: string | null;
          source_email_thread_id: string | null;
          status: string | null;
          tags: string[] | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          actual_hours?: number | null;
          agency_id: string;
          assigned_to?: string | null;
          category?: string | null;
          client_response_email_id?: string | null;
          client_response_sent_at?: string | null;
          created_at?: string | null;
          customer_id?: string | null;
          deadline?: string | null;
          description?: string | null;
          estimated_hours?: number | null;
          execution_completed_at?: string | null;
          execution_log?: Json | null;
          execution_started_at?: string | null;
          hourly_rate?: number | null;
          id?: string;
          invoice_draft_id?: string | null;
          plan_approved_at?: string | null;
          plan_approved_by?: string | null;
          plan_created_at?: string | null;
          plan_json?: Json | null;
          plan_rejection_reason?: string | null;
          priority?: string | null;
          source?: string | null;
          source_email_id?: string | null;
          source_email_thread_id?: string | null;
          status?: string | null;
          tags?: string[] | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          actual_hours?: number | null;
          agency_id?: string;
          assigned_to?: string | null;
          category?: string | null;
          client_response_email_id?: string | null;
          client_response_sent_at?: string | null;
          created_at?: string | null;
          customer_id?: string | null;
          deadline?: string | null;
          description?: string | null;
          estimated_hours?: number | null;
          execution_completed_at?: string | null;
          execution_log?: Json | null;
          execution_started_at?: string | null;
          hourly_rate?: number | null;
          id?: string;
          invoice_draft_id?: string | null;
          plan_approved_at?: string | null;
          plan_approved_by?: string | null;
          plan_created_at?: string | null;
          plan_json?: Json | null;
          plan_rejection_reason?: string | null;
          priority?: string | null;
          source?: string | null;
          source_email_id?: string | null;
          source_email_thread_id?: string | null;
          status?: string | null;
          tags?: string[] | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "team_members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_plan_approved_by_fkey";
            columns: ["plan_approved_by"];
            isOneToOne: false;
            referencedRelation: "team_members";
            referencedColumns: ["id"];
          },
        ];
      };
      team_members: {
        Row: {
          agency_id: string;
          avatar_url: string | null;
          created_at: string | null;
          email: string;
          full_name: string | null;
          id: string;
          is_active: boolean | null;
          role: string | null;
          ssh_public_key: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          agency_id: string;
          avatar_url?: string | null;
          created_at?: string | null;
          email: string;
          full_name?: string | null;
          id?: string;
          is_active?: boolean | null;
          role?: string | null;
          ssh_public_key?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          agency_id?: string;
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string;
          full_name?: string | null;
          id?: string;
          is_active?: boolean | null;
          role?: string | null;
          ssh_public_key?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "team_members_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
        ];
      };
      time_entries: {
        Row: {
          agency_id: string;
          created_at: string | null;
          date: string;
          description: string | null;
          hours: number;
          id: string;
          synced_to_tripletex: boolean | null;
          task_id: string;
          team_member_id: string | null;
          tripletex_entry_id: string | null;
        };
        Insert: {
          agency_id: string;
          created_at?: string | null;
          date?: string;
          description?: string | null;
          hours: number;
          id?: string;
          synced_to_tripletex?: boolean | null;
          task_id: string;
          team_member_id?: string | null;
          tripletex_entry_id?: string | null;
        };
        Update: {
          agency_id?: string;
          created_at?: string | null;
          date?: string;
          description?: string | null;
          hours?: number;
          id?: string;
          synced_to_tripletex?: boolean | null;
          task_id?: string;
          team_member_id?: string | null;
          tripletex_entry_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "time_entries_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "time_entries_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "time_entries_team_member_id_fkey";
            columns: ["team_member_id"];
            isOneToOne: false;
            referencedRelation: "team_members";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_agency_id: { Args: never; Returns: string };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
