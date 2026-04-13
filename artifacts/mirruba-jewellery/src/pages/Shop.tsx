import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { type WcProduct, type WcCategory } from "@/data/products";
import { useProducts, useCategories } from "@/hooks/useProducts";

function CategoryIcon({ slug }: { slug: string }) {
  const iconClass = "w-5 h-5";
  switch (slug) {
    case "rings":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="14" r="7" />
          <ellipse cx="12" cy="7" rx="4" ry="2" />
          <path d="M8 7v3.5M16 7v3.5" />
          <circle cx="12" cy="5" r="1.5" fill="currentColor" opacity="0.3" />
        </svg>
      );
    case "earrings":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 3v4" />
          <circle cx="12" cy="10" r="3" />
          <path d="M12 13v2" />
          <path d="M9 17l3 4 3-4" />
          <circle cx="12" cy="10" r="1" fill="currentColor" opacity="0.3" />
        </svg>
      );
    case "necklaces":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 6c0 0 2-2 8-2s8 2 8 2" />
          <path d="M4 6c0 6 3 12 8 15c5-3 8-9 8-15" />
          <path d="M10 16l2 3 2-3" />
          <circle cx="12" cy="14" r="1.5" fill="currentColor" opacity="0.3" />
        </svg>
      );
    case "bracelets":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <ellipse cx="12" cy="12" rx="9" ry="5" />
          <ellipse cx="12" cy="12" rx="7" ry="3.5" />
          <circle cx="6" cy="12" r="1" fill="currentColor" opacity="0.3" />
          <circle cx="18" cy="12" r="1" fill="currentColor" opacity="0.3" />
        </svg>
      );
    case "trending":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13 3l4 8h-3l2 10-9-12h4L8 3h5z" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
        </svg>
      );
  }
}

export default function Shop() {
  const { data: allProducts, isLoading: productsLoading } = useProducts();
  const { data: allCats, isLoading: catsLoading } = useCategories();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const products = allProducts || [];
  const categories = (() => {
    const filtered = (allCats || []).filter((c) => c.slug !== "uncategorized");
    const allMiruba = filtered.filter((c) => c.slug === "all-miruba-jewellery");
    const trending = filtered.filter((c) => c.slug === "trending");
    const rest = filtered.filter((c) => c.slug !== "trending" && c.slug !== "all-miruba-jewellery");
    return [...allMiruba, ...trending, ...rest];
  })();
  const loading = productsLoading || catsLoading;

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) =>
          p.categories.some((c) => c.name === activeCategory)
        );

  const categoryNames = ["All", ...categories.map((c) => c.name)];

  return (
    <main className="min-h-screen" data-testid="page-shop">
      <section className="relative py-32 sm:py-40 flex items-center justify-center overflow-hidden bg-[#231f20]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <p className="text-gold-light tracking-[0.4em] text-xs sm:text-sm uppercase mb-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            Browse
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
            Our Collection
          </h1>
          <div className="w-16 h-[1px] bg-gold/60 mx-auto opacity-0 animate-gold-line" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }} />
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.length > 0 && categories.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(isActive ? "All" : cat.name)}
                  className={`flex flex-col items-center gap-1.5 px-4 py-3 min-w-[72px] rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gold/15 border border-gold text-gold"
                      : "bg-transparent border border-border text-muted-foreground hover:border-gold/50 hover:text-gold"
                  }`}
                  data-testid={`button-filter-${cat.slug}`}
                >
                  <CategoryIcon slug={cat.slug} />
                  <span className="text-[10px] tracking-[0.08em] uppercase font-medium leading-tight text-center">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted aspect-square rounded-lg mb-4 shimmer-gold" />
                  <div className="h-3 bg-muted rounded w-1/3 mb-2 shimmer-gold" />
                  <div className="h-5 bg-muted rounded w-2/3 mb-2 shimmer-gold" />
                  <div className="h-4 bg-muted rounded w-1/4 shimmer-gold" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                <div className="w-3 h-3 rounded-full bg-gold" />
              </div>
              <p className="font-serif text-xl mb-2">No products found</p>
              <p className="text-sm text-muted-foreground/70">Try selecting a different category.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
