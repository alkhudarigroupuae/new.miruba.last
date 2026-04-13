export interface WcImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface WcCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WcProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  description: string;
  short_description: string;
  categories: WcCategory[];
  images: WcImage[];
  stock_status: string;
  featured: boolean;
}

function getApiUrl(path: string): string {
  return `/api${path}`;
}

export async function fetchProducts(params: Record<string, string> = {}): Promise<WcProduct[]> {
  const url = new URL(getApiUrl("/wc/products"), window.location.origin);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProductBySlug(slug: string): Promise<WcProduct | null> {
  const url = new URL(getApiUrl("/wc/products"), window.location.origin);
  url.searchParams.set("slug", slug);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch product");
  const products = await res.json();
  return products.length > 0 ? products[0] : null;
}

export async function fetchProductById(id: number): Promise<WcProduct> {
  const res = await fetch(getApiUrl(`/wc/products/${id}`));
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function fetchCategories(): Promise<WcCategory[]> {
  const res = await fetch(getApiUrl("/wc/categories"));
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export function formatPrice(price: string | number): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return "AED 0";
  return `AED ${num.toLocaleString()}`;
}

export function getProductImage(product: WcProduct): string {
  if (product.images && product.images.length > 0) {
    return product.images[0].src;
  }
  return "https://placehold.co/600x600/f5f0eb/9a8470?text=No+Image";
}

export function getProductCategory(product: WcProduct): string {
  if (product.categories && product.categories.length > 0) {
    return product.categories[0].name;
  }
  return "Uncategorized";
}

export function stripHtml(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}
