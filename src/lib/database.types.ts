export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      laptops: {
        Row: {
          id: string;
          name: string;
          brand: string;
          price: number;
          ram: number;
          processor_score: number;
          storage: number;
          screen_size: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          brand: string;
          price: number;
          ram: number;
          processor_score: number;
          storage: number;
          screen_size: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          brand?: string;
          price?: number;
          ram?: number;
          processor_score?: number;
          storage?: number;
          screen_size?: number;
          created_at?: string;
        };
      };
      criteria: {
        Row: {
          id: string;
          name: string;
          weight: number;
          type: 'benefit' | 'cost';
          attribute: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          weight: number;
          type: 'benefit' | 'cost';
          attribute: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          weight?: number;
          type?: 'benefit' | 'cost';
          attribute?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Laptop = Database['public']['Tables']['laptops']['Row'];
export type Criteria = Database['public']['Tables']['criteria']['Row'];
