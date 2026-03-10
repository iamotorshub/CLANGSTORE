import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { products as localProducts, Product as LocalProduct } from "@/data/products";

export interface DBProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  category: string;
  description: string | null;
  image_url: string | null;
  sizes: string[];
  colors: string[];
  is_featured: boolean;
  is_new: boolean;
  free_shipping: boolean;
  created_at: string;
}

function dbToLocal(p: DBProduct): LocalProduct {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    originalPrice: p.original_price ?? undefined,
    category: p.category,
    description: p.description ?? undefined,
    image: p.image_url || "/placeholder.svg",
    sizes: p.sizes?.length ? p.sizes : undefined,
    colors: p.colors?.length ? p.colors : undefined,
    isFeatured: p.is_featured,
    isNew: p.is_new,
    freeShipping: p.free_shipping,
  };
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<LocalProduct[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });
      if (error || !data?.length) return localProducts;
      return (data as DBProduct[]).map(dbToLocal);
    },
  });
}

export function useDBProducts() {
  return useQuery({
    queryKey: ["db-products"],
    queryFn: async (): Promise<DBProduct[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []) as DBProduct[];
    },
  });
}

export function useInsertProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: Omit<DBProduct, "id" | "created_at">) => {
      const { data, error } = await supabase.from("products").insert(p).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); qc.invalidateQueries({ queryKey: ["db-products"] }); },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DBProduct> & { id: string }) => {
      const { error } = await supabase.from("products").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); qc.invalidateQueries({ queryKey: ["db-products"] }); },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); qc.invalidateQueries({ queryKey: ["db-products"] }); },
  });
}
