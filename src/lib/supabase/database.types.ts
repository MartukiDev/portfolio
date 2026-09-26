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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          user_id: string
        }
        Insert: {
          user_id: string
        }
        Update: {
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          email: string
          id: string
          leido: boolean
          mensaje: string
          nombre: string
          tipo: Database["public"]["Enums"]["tipo_consulta"]
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          leido?: boolean
          mensaje: string
          nombre: string
          tipo: Database["public"]["Enums"]["tipo_consulta"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          leido?: boolean
          mensaje?: string
          nombre?: string
          tipo?: Database["public"]["Enums"]["tipo_consulta"]
        }
        Relationships: []
      }
      projects: {
        Row: {
          categoria: Database["public"]["Enums"]["categoria_proyecto"]
          cliente: string | null
          contenido: Json | null
          created_at: string
          demo_url: string | null
          destacado: boolean
          galeria_paths: string[]
          id: string
          orden: number
          portada_path: string | null
          problema: string | null
          publicado: boolean
          repo_url: string | null
          resultado: string | null
          resumen: string
          rol: string | null
          slug: string
          stack: string[]
          titulo: string
          updated_at: string
        }
        Insert: {
          categoria: Database["public"]["Enums"]["categoria_proyecto"]
          cliente?: string | null
          contenido?: Json | null
          created_at?: string
          demo_url?: string | null
          destacado?: boolean
          galeria_paths?: string[]
          id?: string
          orden?: number
          portada_path?: string | null
          problema?: string | null
          publicado?: boolean
          repo_url?: string | null
          resultado?: string | null
          resumen: string
          rol?: string | null
          slug: string
          stack?: string[]
          titulo: string
          updated_at?: string
        }
        Update: {
          categoria?: Database["public"]["Enums"]["categoria_proyecto"]
          cliente?: string | null
          contenido?: Json | null
          created_at?: string
          demo_url?: string | null
          destacado?: boolean
          galeria_paths?: string[]
          id?: string
          orden?: number
          portada_path?: string | null
          problema?: string | null
          publicado?: boolean
          repo_url?: string | null
          resultado?: string | null
          resumen?: string
          rol?: string | null
          slug?: string
          stack?: string[]
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          descripcion: string
          icono: string | null
          id: string
          orden: number
          publicado: boolean
          titulo: string
        }
        Insert: {
          descripcion: string
          icono?: string | null
          id?: string
          orden?: number
          publicado?: boolean
          titulo: string
        }
        Update: {
          descripcion?: string
          icono?: string | null
          id?: string
          orden?: number
          publicado?: boolean
          titulo?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          bio: Json | null
          cv_pdf_path: string | null
          disponible_freelance: boolean
          disponible_practica: boolean
          email: string | null
          github_url: string | null
          hero_descripcion: string | null
          id: number
          linkedin_url: string | null
          nombre: string
          practica_desde: string | null
          practica_duracion: string | null
          tagline: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          bio?: Json | null
          cv_pdf_path?: string | null
          disponible_freelance?: boolean
          disponible_practica?: boolean
          email?: string | null
          github_url?: string | null
          hero_descripcion?: string | null
          id?: number
          linkedin_url?: string | null
          nombre: string
          practica_desde?: string | null
          practica_duracion?: string | null
          tagline?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          bio?: Json | null
          cv_pdf_path?: string | null
          disponible_freelance?: boolean
          disponible_practica?: boolean
          email?: string | null
          github_url?: string | null
          hero_descripcion?: string | null
          id?: number
          linkedin_url?: string | null
          nombre?: string
          practica_desde?: string | null
          practica_duracion?: string | null
          tagline?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          area: Database["public"]["Enums"]["area_habilidad"]
          id: string
          nombre: string
          orden: number
        }
        Insert: {
          area: Database["public"]["Enums"]["area_habilidad"]
          id?: string
          nombre: string
          orden?: number
        }
        Update: {
          area?: Database["public"]["Enums"]["area_habilidad"]
          id?: string
          nombre?: string
          orden?: number
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          autor: string
          cargo: string | null
          id: string
          orden: number
          project_id: string | null
          publicado: boolean
          texto: string
        }
        Insert: {
          autor: string
          cargo?: string | null
          id?: string
          orden?: number
          project_id?: string | null
          publicado?: boolean
          texto: string
        }
        Update: {
          autor?: string
          cargo?: string | null
          id?: string
          orden?: number
          project_id?: string | null
          publicado?: boolean
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_items: {
        Row: {
          descripcion: string | null
          fin: string | null
          id: string
          inicio: string | null
          orden: number
          organizacion: string | null
          tipo: Database["public"]["Enums"]["tipo_trayectoria"]
          titulo: string
        }
        Insert: {
          descripcion?: string | null
          fin?: string | null
          id?: string
          inicio?: string | null
          orden?: number
          organizacion?: string | null
          tipo: Database["public"]["Enums"]["tipo_trayectoria"]
          titulo: string
        }
        Update: {
          descripcion?: string | null
          fin?: string | null
          id?: string
          inicio?: string | null
          orden?: number
          organizacion?: string | null
          tipo?: Database["public"]["Enums"]["tipo_trayectoria"]
          titulo?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      area_habilidad:
        | "frontend"
        | "backend"
        | "hardware"
        | "ia"
        | "infra"
        | "otras"
      categoria_proyecto: "cliente" | "propio" | "academico"
      tipo_consulta: "freelance" | "practica" | "otro"
      tipo_trayectoria: "formacion" | "experiencia" | "freelance" | "ayudantia"
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
      area_habilidad: [
        "frontend",
        "backend",
        "hardware",
        "ia",
        "infra",
        "otras",
      ],
      categoria_proyecto: ["cliente", "propio", "academico"],
      tipo_consulta: ["freelance", "practica", "otro"],
      tipo_trayectoria: ["formacion", "experiencia", "freelance", "ayudantia"],
    },
  },
} as const
