export interface Product {
  id: string;
  name: string;
  price: number;
  category: "Rings" | "Earrings" | "Necklaces" | "Bracelets";
  description: string;
  image: string;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: "royal-gold-ring",
    name: "Royal Gold Ring",
    price: 1500,
    category: "Rings",
    description: "18K gold ring with intricate filigree design, handcrafted by our master artisans. Each piece is a testament to timeless elegance and unmatched craftsmanship.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop",
    featured: true,
  },
  {
    id: "diamond-cascade-earrings",
    name: "Diamond Cascade Earrings",
    price: 2800,
    category: "Earrings",
    description: "Dangling earrings with cascading diamonds set in 18K white gold. These stunning earrings catch the light beautifully with every movement.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
    featured: true,
  },
  {
    id: "pearl-drop-necklace",
    name: "Pearl Drop Necklace",
    price: 1200,
    category: "Necklaces",
    description: "Elegant pearl pendant on a fine gold chain. A classic piece that adds sophistication to any outfit, perfect for both everyday wear and special occasions.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop",
    featured: true,
  },
  {
    id: "sapphire-twist-bracelet",
    name: "Sapphire Twist Bracelet",
    price: 3500,
    category: "Bracelets",
    description: "White gold bracelet with sapphire accents arranged in a graceful twist design. A bold statement piece that exudes luxury and sophistication.",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop",
    featured: true,
  },
  {
    id: "rose-gold-band",
    name: "Rose Gold Band",
    price: 800,
    category: "Rings",
    description: "Minimalist rose gold wedding band with a smooth, polished finish. Simple yet elegant, this band symbolizes eternal love and commitment.",
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&h=600&fit=crop",
  },
  {
    id: "emerald-stud-earrings",
    name: "Emerald Stud Earrings",
    price: 950,
    category: "Earrings",
    description: "Classic emerald studs in platinum setting. These vibrant green gems are expertly cut to maximize brilliance and color saturation.",
    image: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600&h=600&fit=crop",
  },
  {
    id: "layered-chain-necklace",
    name: "Layered Chain Necklace",
    price: 1800,
    category: "Necklaces",
    description: "Multi-layer gold chain necklace featuring delicate chains of varying lengths. A versatile piece that adds depth and dimension to any look.",
    image: "https://images.unsplash.com/photo-1515562141589-67f0d7ce7f04?w=600&h=600&fit=crop",
  },
  {
    id: "charm-link-bracelet",
    name: "Charm Link Bracelet",
    price: 600,
    category: "Bracelets",
    description: "Delicate gold charm bracelet with gemstone accents. Each charm tells a story, making this piece uniquely personal and meaningful.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop",
  },
  {
    id: "vintage-halo-ring",
    name: "Vintage Halo Ring",
    price: 4200,
    category: "Rings",
    description: "Vintage-inspired halo engagement ring with a central diamond surrounded by a circle of smaller stones. A breathtaking piece that captures the romance of a bygone era.",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&h=600&fit=crop",
  },
  {
    id: "crystal-drop-earrings",
    name: "Crystal Drop Earrings",
    price: 1100,
    category: "Earrings",
    description: "Long crystal drop earrings with gold accents. These eye-catching earrings feature precision-cut crystals that sparkle with every turn.",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&h=600&fit=crop",
  },
  {
    id: "statement-collar-necklace",
    name: "Statement Collar Necklace",
    price: 5000,
    category: "Necklaces",
    description: "Bold gold collar necklace with geometric patterns. A show-stopping piece designed for women who command attention and embrace their power.",
    image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&h=600&fit=crop",
  },
  {
    id: "tennis-bracelet",
    name: "Tennis Bracelet",
    price: 7500,
    category: "Bracelets",
    description: "Classic diamond tennis bracelet in white gold. Featuring a continuous line of individually set diamonds, this is the ultimate expression of refined luxury.",
    image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&h=600&fit=crop",
  },
];

export const categories = ["All", "Rings", "Earrings", "Necklaces", "Bracelets"] as const;

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return products;
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function formatPrice(price: number): string {
  return `AED ${price.toLocaleString()}`;
}
