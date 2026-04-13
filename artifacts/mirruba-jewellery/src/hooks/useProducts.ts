import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchCategories, type WcProduct, type WcCategory } from "@/data/products";

export function useProducts(params: Record<string, string> = {}) {
  const key = ["products", params];
  return useQuery<WcProduct[]>({
    queryKey: key,
    queryFn: () => fetchProducts(params),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 60 * 1000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
}

export function useCategories() {
  return useQuery<WcCategory[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 60 * 1000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
}
