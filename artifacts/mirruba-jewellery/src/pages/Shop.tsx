import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { fetchProducts, fetchCategories, type WcProduct, type WcCategory } from "@/data/products";

export default function Shop() {
  const [products, setProducts] = useState<WcProduct[]>([]);
  const [categories, setCategories] = useState<WcCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchProducts(),
      fetchCategories(),
    ])
      .then(([prods, cats]) => {
        const jewelryProductCats = ["rings", "earrings", "necklaces", "bracelets", "trending", "accessories"];
        const filteredProds = prods.filter((p) =>
          p.categories.some((c) => jewelryProductCats.includes(c.slug.toLowerCase()))
        );
        setProducts(filteredProds);
        const jewelryCategories = ["rings", "earrings", "necklaces", "bracelets", "trending", "accessories"];
        const validCats = cats.filter((c) => jewelryCategories.includes(c.slug.toLowerCase()));
        setCategories(validCats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
            {categoryNames.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 text-sm tracking-[0.1em] uppercase rounded-full transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-gold text-white"
                    : "bg-transparent border border-border text-muted-foreground hover:border-gold hover:text-gold"
                }`}
                data-testid={`button-filter-${category.toLowerCase()}`}
              >
                {category}
              </button>
            ))}
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
