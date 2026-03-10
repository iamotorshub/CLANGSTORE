import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AIModel {
  id: string;
  name: string;
  photo_url: string | null;
  prompt_description: string | null;
  tags: string[];
  created_at: string;
}

export function useAIModels() {
  return useQuery({
    queryKey: ["ai-models"],
    queryFn: async (): Promise<AIModel[]> => {
      const { data, error } = await supabase
        .from("ai_models")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as AIModel[];
    },
  });
}

export function useInsertAIModel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (model: Omit<AIModel, "id" | "created_at">) => {
      const { data, error } = await supabase.from("ai_models").insert(model).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ai-models"] }),
  });
}

export function useDeleteAIModel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ai_models").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ai-models"] }),
  });
}
