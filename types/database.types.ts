export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: number
          new_values: Json | null
          old_values: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: never
          new_values?: Json | null
          old_values?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: never
          new_values?: Json | null
          old_values?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          code: string
          description: string | null
          is_active: boolean
          name: string
        }
        Insert: {
          code: string
          description?: string | null
          is_active?: boolean
          name: string
        }
        Update: {
          code?: string
          description?: string | null
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      classification_rules: {
        Row: {
          category_code: string | null
          id: number
          is_active: boolean
          match_on: Database["public"]["Enums"]["match_target"]
          pattern: string
          priority: number
          purpose_code: string | null
        }
        Insert: {
          category_code?: string | null
          id?: never
          is_active?: boolean
          match_on: Database["public"]["Enums"]["match_target"]
          pattern: string
          priority?: number
          purpose_code?: string | null
        }
        Update: {
          category_code?: string | null
          id?: never
          is_active?: boolean
          match_on?: Database["public"]["Enums"]["match_target"]
          pattern?: string
          priority?: number
          purpose_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classification_rules_category_code_fkey"
            columns: ["category_code"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "classification_rules_purpose_code_fkey"
            columns: ["purpose_code"]
            isOneToOne: false
            referencedRelation: "purposes"
            referencedColumns: ["code"]
          },
        ]
      }
      documents: {
        Row: {
          category_code: string | null
          code_status: Database["public"]["Enums"]["code_status"]
          description: string | null
          doc_year: number | null
          document_code: string | null
          document_date: string | null
          drive_file_id: string
          id: string
          missing_fields: string[]
          office_code: string | null
          purpose_code: string | null
          record_status: Database["public"]["Enums"]["record_status"]
          registered_at: string
          registered_by: string | null
          sequence_no: number | null
          title: string | null
          updated_at: string
        }
        Insert: {
          category_code?: string | null
          code_status?: Database["public"]["Enums"]["code_status"]
          description?: string | null
          doc_year?: number | null
          document_code?: string | null
          document_date?: string | null
          drive_file_id: string
          id?: string
          missing_fields?: string[]
          office_code?: string | null
          purpose_code?: string | null
          record_status?: Database["public"]["Enums"]["record_status"]
          registered_at?: string
          registered_by?: string | null
          sequence_no?: number | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          category_code?: string | null
          code_status?: Database["public"]["Enums"]["code_status"]
          description?: string | null
          doc_year?: number | null
          document_code?: string | null
          document_date?: string | null
          drive_file_id?: string
          id?: string
          missing_fields?: string[]
          office_code?: string | null
          purpose_code?: string | null
          record_status?: Database["public"]["Enums"]["record_status"]
          registered_at?: string
          registered_by?: string | null
          sequence_no?: number | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_category_code_fkey"
            columns: ["category_code"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "documents_drive_file_id_fkey"
            columns: ["drive_file_id"]
            isOneToOne: true
            referencedRelation: "drive_files"
            referencedColumns: ["drive_file_id"]
          },
          {
            foreignKeyName: "documents_purpose_code_fkey"
            columns: ["purpose_code"]
            isOneToOne: false
            referencedRelation: "purposes"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "documents_registered_by_fkey"
            columns: ["registered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      drive_config: {
        Row: {
          auth_mode: Database["public"]["Enums"]["auth_mode"] | null
          configured_by: string | null
          id: number
          last_synced_at: string | null
          poll_interval_minutes: number
          shared_drive_id: string | null
          shared_drive_name: string | null
          start_page_token: string | null
          status: string | null
        }
        Insert: {
          auth_mode?: Database["public"]["Enums"]["auth_mode"] | null
          configured_by?: string | null
          id?: number
          last_synced_at?: string | null
          poll_interval_minutes?: number
          shared_drive_id?: string | null
          shared_drive_name?: string | null
          start_page_token?: string | null
          status?: string | null
        }
        Update: {
          auth_mode?: Database["public"]["Enums"]["auth_mode"] | null
          configured_by?: string | null
          id?: number
          last_synced_at?: string | null
          poll_interval_minutes?: number
          shared_drive_id?: string | null
          shared_drive_name?: string | null
          start_page_token?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drive_config_configured_by_fkey"
            columns: ["configured_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      drive_files: {
        Row: {
          drive_file_id: string
          folder_path: string | null
          is_trashed: boolean
          last_sync_id: number | null
          mime_type: string | null
          modified_time: string | null
          name: string
          registration_status: Database["public"]["Enums"]["reg_status"]
          size_bytes: number | null
          web_view_link: string | null
        }
        Insert: {
          drive_file_id: string
          folder_path?: string | null
          is_trashed?: boolean
          last_sync_id?: number | null
          mime_type?: string | null
          modified_time?: string | null
          name: string
          registration_status?: Database["public"]["Enums"]["reg_status"]
          size_bytes?: number | null
          web_view_link?: string | null
        }
        Update: {
          drive_file_id?: string
          folder_path?: string | null
          is_trashed?: boolean
          last_sync_id?: number | null
          mime_type?: string | null
          modified_time?: string | null
          name?: string
          registration_status?: Database["public"]["Enums"]["reg_status"]
          size_bytes?: number | null
          web_view_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drive_files_last_sync_id_fkey"
            columns: ["last_sync_id"]
            isOneToOne: false
            referencedRelation: "sync_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_reports: {
        Row: {
          document_id: string | null
          generated_at: string
          generated_by: string | null
          id: string
          input_values: Json
          output_drive_file_id: string | null
          status: string | null
          template_id: string
        }
        Insert: {
          document_id?: string | null
          generated_at?: string
          generated_by?: string | null
          id?: string
          input_values?: Json
          output_drive_file_id?: string | null
          status?: string | null
          template_id: string
        }
        Update: {
          document_id?: string | null
          generated_at?: string
          generated_by?: string | null
          id?: string
          input_values?: Json
          output_drive_file_id?: string | null
          status?: string | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_reports_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_reports_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_reports_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      ocr_results: {
        Row: {
          created_at: string
          drive_file_id: string
          extracted_text: string | null
          id: string
          language: string | null
          ocr_doc_id: string | null
          requested_by: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          drive_file_id: string
          extracted_text?: string | null
          id?: string
          language?: string | null
          ocr_doc_id?: string | null
          requested_by?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          drive_file_id?: string
          extracted_text?: string | null
          id?: string
          language?: string | null
          ocr_doc_id?: string | null
          requested_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ocr_results_drive_file_id_fkey"
            columns: ["drive_file_id"]
            isOneToOne: false
            referencedRelation: "drive_files"
            referencedColumns: ["drive_file_id"]
          },
          {
            foreignKeyName: "ocr_results_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          last_login_at: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean
          last_login_at?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      purposes: {
        Row: {
          code: string
          description: string | null
          is_active: boolean
          name: string
        }
        Insert: {
          code: string
          description?: string | null
          is_active?: boolean
          name: string
        }
        Update: {
          code?: string
          description?: string | null
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      reference_imports: {
        Row: {
          id: number
          imported_at: string
          imported_by: string | null
          rows_added: number
          rows_updated: number
          sheet_range: string | null
          spreadsheet_id: string | null
          status: string | null
        }
        Insert: {
          id?: never
          imported_at?: string
          imported_by?: string | null
          rows_added?: number
          rows_updated?: number
          sheet_range?: string | null
          spreadsheet_id?: string | null
          status?: string | null
        }
        Update: {
          id?: never
          imported_at?: string
          imported_by?: string | null
          rows_added?: number
          rows_updated?: number
          sheet_range?: string | null
          spreadsheet_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reference_imports_imported_by_fkey"
            columns: ["imported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      report_templates: {
        Row: {
          category_code: string | null
          created_by: string | null
          google_doc_id: string | null
          id: string
          is_active: boolean
          name: string
          output_folder_id: string | null
          purpose_code: string | null
          report_type: string | null
        }
        Insert: {
          category_code?: string | null
          created_by?: string | null
          google_doc_id?: string | null
          id?: string
          is_active?: boolean
          name: string
          output_folder_id?: string | null
          purpose_code?: string | null
          report_type?: string | null
        }
        Update: {
          category_code?: string | null
          created_by?: string | null
          google_doc_id?: string | null
          id?: string
          is_active?: boolean
          name?: string
          output_folder_id?: string | null
          purpose_code?: string | null
          report_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_templates_category_code_fkey"
            columns: ["category_code"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "report_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_templates_purpose_code_fkey"
            columns: ["purpose_code"]
            isOneToOne: false
            referencedRelation: "purposes"
            referencedColumns: ["code"]
          },
        ]
      }
      required_field_rules: {
        Row: {
          category_code: string
          field_name: string
          id: number
          is_required: boolean
        }
        Insert: {
          category_code: string
          field_name: string
          id?: never
          is_required?: boolean
        }
        Update: {
          category_code?: string
          field_name?: string
          id?: never
          is_required?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "required_field_rules_category_code_fkey"
            columns: ["category_code"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["code"]
          },
        ]
      }
      sequence_counters: {
        Row: {
          category_code: string | null
          last_value: number
          purpose_code: string | null
          scope_key: string
        }
        Insert: {
          category_code?: string | null
          last_value?: number
          purpose_code?: string | null
          scope_key: string
        }
        Update: {
          category_code?: string | null
          last_value?: number
          purpose_code?: string | null
          scope_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "sequence_counters_category_code_fkey"
            columns: ["category_code"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "sequence_counters_purpose_code_fkey"
            columns: ["purpose_code"]
            isOneToOne: false
            referencedRelation: "purposes"
            referencedColumns: ["code"]
          },
        ]
      }
      sync_runs: {
        Row: {
          error_message: string | null
          files_added: number
          files_removed: number
          files_updated: number
          finished_at: string | null
          id: number
          started_at: string
          status: string | null
          trigger: Database["public"]["Enums"]["sync_trigger"]
          triggered_by: string | null
        }
        Insert: {
          error_message?: string | null
          files_added?: number
          files_removed?: number
          files_updated?: number
          finished_at?: string | null
          id?: never
          started_at?: string
          status?: string | null
          trigger: Database["public"]["Enums"]["sync_trigger"]
          triggered_by?: string | null
        }
        Update: {
          error_message?: string | null
          files_added?: number
          files_removed?: number
          files_updated?: number
          finished_at?: string | null
          id?: never
          started_at?: string
          status?: string | null
          trigger?: Database["public"]["Enums"]["sync_trigger"]
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sync_runs_triggered_by_fkey"
            columns: ["triggered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      template_fields: {
        Row: {
          data_type: string | null
          id: string
          is_required: boolean
          label: string | null
          placeholder: string
          source: Database["public"]["Enums"]["field_source"]
          template_id: string
        }
        Insert: {
          data_type?: string | null
          id?: string
          is_required?: boolean
          label?: string | null
          placeholder: string
          source?: Database["public"]["Enums"]["field_source"]
          template_id: string
        }
        Update: {
          data_type?: string | null
          id?: string
          is_required?: boolean
          label?: string | null
          placeholder?: string
          source?: Database["public"]["Enums"]["field_source"]
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_fields_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      active_app_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      app_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      generate_document_code: {
        Args: {
          p_category: string
          p_office?: string
          p_purpose: string
          p_year: number
        }
        Returns: {
          code: string
          seq: number
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      is_staff_or_admin: { Args: never; Returns: boolean }
      next_sequence: {
        Args: { p_category: string; p_purpose: string; p_scope_key: string }
        Returns: number
      }
    }
    Enums: {
      auth_mode: "oauth" | "service_account"
      code_status: "provisional" | "confirmed"
      field_source: "user_input" | "document" | "ocr" | "system"
      match_target: "filename" | "folder_path" | "ocr_text"
      record_status: "complete" | "incomplete" | "archived"
      reg_status:
        | "unregistered"
        | "registered"
        | "ignored"
        | "unclassified"
        | "excluded"
        | "removed"
      sync_trigger: "manual" | "scheduled" | "webhook"
      user_role: "admin" | "staff" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      auth_mode: ["oauth", "service_account"],
      code_status: ["provisional", "confirmed"],
      field_source: ["user_input", "document", "ocr", "system"],
      match_target: ["filename", "folder_path", "ocr_text"],
      record_status: ["complete", "incomplete", "archived"],
      reg_status: [
        "unregistered",
        "registered",
        "ignored",
        "unclassified",
        "excluded",
        "removed",
      ],
      sync_trigger: ["manual", "scheduled", "webhook"],
      user_role: ["admin", "staff", "viewer"],
    },
  },
} as const
