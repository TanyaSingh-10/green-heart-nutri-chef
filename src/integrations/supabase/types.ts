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
      nutrition_experts: {
        Row: {
          bio: string
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          specialization: string
          title: string
        }
        Insert: {
          bio: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          specialization: string
          title: string
        }
        Update: {
          bio?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          specialization?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          dietary_preferences: string | null
          first_name: string | null
          health_goals: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dietary_preferences?: string | null
          first_name?: string | null
          health_goals?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dietary_preferences?: string | null
          first_name?: string | null
          health_goals?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_recipes: {
        Row: {
          cook_time: number | null
          created_at: string | null
          cuisine_type: string | null
          description: string
          expert_id: string | null
          id: string
          image_url: string | null
          ingredients: Json
          instructions: Json
          nutrition_info: Json | null
          prep_time: number | null
          title: string
          user_id: string
          youtube_link: string | null
        }
        Insert: {
          cook_time?: number | null
          created_at?: string | null
          cuisine_type?: string | null
          description: string
          expert_id?: string | null
          id?: string
          image_url?: string | null
          ingredients: Json
          instructions: Json
          nutrition_info?: Json | null
          prep_time?: number | null
          title: string
          user_id: string
          youtube_link?: string | null
        }
        Update: {
          cook_time?: number | null
          created_at?: string | null
          cuisine_type?: string | null
          description?: string
          expert_id?: string | null
          id?: string
          image_url?: string | null
          ingredients?: Json
          instructions?: Json
          nutrition_info?: Json | null
          prep_time?: number | null
          title?: string
          user_id?: string
          youtube_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_recipes_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "nutrition_experts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          allergies: string[] | null
          created_at: string | null
          cuisine_preferences: string[] | null
          dietary_restrictions: string[] | null
          favorite_foods: string[] | null
          health_conditions: string[] | null
          id: string
          nutritional_goals: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allergies?: string[] | null
          created_at?: string | null
          cuisine_preferences?: string[] | null
          dietary_restrictions?: string[] | null
          favorite_foods?: string[] | null
          health_conditions?: string[] | null
          id?: string
          nutritional_goals?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allergies?: string[] | null
          created_at?: string | null
          cuisine_preferences?: string[] | null
          dietary_restrictions?: string[] | null
          favorite_foods?: string[] | null
          health_conditions?: string[] | null
          id?: string
          nutritional_goals?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
