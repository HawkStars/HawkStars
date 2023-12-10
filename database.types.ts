export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      contributions: {
        Row: {
          contribution_date: string
          created_at: string
          description: string
          donor: string
          id: string
          registered_by: string
          type: Database["public"]["Enums"]["ContributionType"]
          updated_at: string
          value: number
        }
        Insert: {
          contribution_date: string
          created_at?: string
          description?: string
          donor: string
          id?: string
          registered_by: string
          type: Database["public"]["Enums"]["ContributionType"]
          updated_at?: string
          value: number
        }
        Update: {
          contribution_date?: string
          created_at?: string
          description?: string
          donor?: string
          id?: string
          registered_by?: string
          type?: Database["public"]["Enums"]["ContributionType"]
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "registered_by_contributions_fkey"
            columns: ["registered_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      organization_movements: {
        Row: {
          created_at: string
          description: string
          id: string
          movement_date: string
          paid: boolean
          registered_by: string
          type: Database["public"]["Enums"]["MoneyMovementType"]
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          movement_date: string
          paid?: boolean
          registered_by: string
          type: Database["public"]["Enums"]["MoneyMovementType"]
          updated_at?: string
          value: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          movement_date?: string
          paid?: boolean
          registered_by?: string
          type?: Database["public"]["Enums"]["MoneyMovementType"]
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "registered_by_organization_movements_fkey"
            columns: ["registered_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string
          type: Database["public"]["Enums"]["ProfileType"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["ProfileType"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["ProfileType"]
          updated_at?: string
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
      ContributionType:
        | "BANK"
        | "CRYPTO"
        | "WALL_NAME_SINGULAR"
        | "WALL_NAME_COMPANY"
        | "OFFICE_CHAIR"
        | "SIMULATOR_CHAIR"
        | "LOUNGE_CHAIR"
        | "AUDITORIUM_CHAIR"
        | "BUILDING_NAMING"
        | "TRAINING_ROOM_NAMING"
      MoneyMovementType: "CREDIT" | "DEBIT"
      ProfileType: "ADMIN" | "REGULAR"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

