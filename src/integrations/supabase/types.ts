export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          address: string | null
          birth_date: string | null
          created_at: string | null
          document: string
          email: string | null
          id: string
          internal_notes: string | null
          name: string
          phone: string | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          created_at?: string | null
          document: string
          email?: string | null
          id?: string
          internal_notes?: string | null
          name: string
          phone?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          created_at?: string | null
          document?: string
          email?: string | null
          id?: string
          internal_notes?: string | null
          name?: string
          phone?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          description: string
          due_date: string
          id: string
          sale_id: string | null
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          description: string
          due_date: string
          id?: string
          sale_id?: string | null
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          description?: string
          due_date?: string
          id?: string
          sale_id?: string | null
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      financing_requests: {
        Row: {
          birthdate: string
          cpf: string
          created_at: string
          entry_value: number
          has_cnh: boolean
          id: string
          installments: number
          monthly_payment: number
          total_payment: number
          vehicle_price: number
          whatsapp: string
        }
        Insert: {
          birthdate: string
          cpf: string
          created_at?: string
          entry_value: number
          has_cnh?: boolean
          id?: string
          installments: number
          monthly_payment: number
          total_payment: number
          vehicle_price: number
          whatsapp: string
        }
        Update: {
          birthdate?: string
          cpf?: string
          created_at?: string
          entry_value?: number
          has_cnh?: boolean
          id?: string
          installments?: number
          monthly_payment?: number
          total_payment?: number
          vehicle_price?: number
          whatsapp?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          created_at: string | null
          enabled: boolean
          id: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean
          id?: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean
          id?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sales: {
        Row: {
          commission_amount: number
          created_at: string | null
          customer_id: string
          final_price: number
          id: string
          payment_method: string
          sale_date: string | null
          seller_id: string
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          commission_amount: number
          created_at?: string | null
          customer_id: string
          final_price: number
          id?: string
          payment_method: string
          sale_date?: string | null
          seller_id: string
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          commission_amount?: number
          created_at?: string | null
          customer_id?: string
          final_price?: number
          id?: string
          payment_method?: string
          sale_date?: string | null
          seller_id?: string
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_reports: {
        Row: {
          created_at: string | null
          enabled: boolean
          frequency: string
          id: string
          last_sent_at: string | null
          report_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean
          frequency: string
          id?: string
          last_sent_at?: string | null
          report_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean
          frequency?: string
          id?: string
          last_sent_at?: string | null
          report_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_preferences: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      vehicle_investor_access: {
        Row: {
          created_at: string
          id: string
          user_id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_investor_access_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          brand: string
          chassis: string | null
          color: string
          created_at: string | null
          entry_date: string | null
          fuel: string
          id: string
          internal_notes: string | null
          mileage: number
          model: string
          photos: string[] | null
          plate: string | null
          purchase_price: number
          renavam: string | null
          sale_price: number
          status: string
          transmission: string
          updated_at: string | null
          version: string | null
          year: number
        }
        Insert: {
          brand: string
          chassis?: string | null
          color: string
          created_at?: string | null
          entry_date?: string | null
          fuel: string
          id?: string
          internal_notes?: string | null
          mileage: number
          model: string
          photos?: string[] | null
          plate?: string | null
          purchase_price: number
          renavam?: string | null
          sale_price: number
          status?: string
          transmission: string
          updated_at?: string | null
          version?: string | null
          year: number
        }
        Update: {
          brand?: string
          chassis?: string | null
          color?: string
          created_at?: string | null
          entry_date?: string | null
          fuel?: string
          id?: string
          internal_notes?: string | null
          mileage?: number
          model?: string
          photos?: string[] | null
          plate?: string | null
          purchase_price?: number
          renavam?: string | null
          sale_price?: number
          status?: string
          transmission?: string
          updated_at?: string | null
          version?: string | null
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_dummy_customer: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_dummy_sale: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_dummy_transaction: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_dummy_vehicle: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      investor_has_vehicle_access: {
        Args: { user_id: string; vehicle_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "administrator"
        | "seller"
        | "financial"
        | "dispatcher"
        | "investor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "administrator",
        "seller",
        "financial",
        "dispatcher",
        "investor",
      ],
    },
  },
} as const
