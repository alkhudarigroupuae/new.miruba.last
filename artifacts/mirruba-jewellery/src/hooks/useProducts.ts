import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchCategories, type WcProduct, type WcCategory } from "@/data/products";

export function useProducts(params: Record<string, string> = {}) {
  const key = ["products", params];
  return useQuery<WcProduct[]>({
    queryKey: key,
    queryFn: () => fetchProducts(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery<WcCategory[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
