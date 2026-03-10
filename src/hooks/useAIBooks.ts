import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AIBook {
  id: string;
  product_id: string | null;
  model_id: string | null;
  photo_count: number;
  locations: string[];
  status: string;
  result_photos: any;
  created_at: string;
}

export function useAIBooks() {
  return useQuery({
    queryKey: ["ai-books"],
    queryFn: async (): Promise<AIBook[]> => {
      const { data, error } = await supabase
        .from("ai_books")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as AIBook[];
    },
  });
}

export function useInsertAIBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (book: Omit<AIBook, "id" | "created_at">) => {
      const { data, error } = await supabase.from("ai_books").insert(book).select().single();
      if (error) throw error;
      return data as AIBook;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ai-books"] }),
  });
}

export function useUpdateAIBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AIBook> & { id: string }) => {
      const { error } = await supabase.from("ai_books").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ai-books"] }),
  });
}
