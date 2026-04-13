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
    <main className="pt-24 pb-16 min-h-screen" data-testid="page-shop">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gold tracking-[0.3em] text-xs uppercase mb-4">Browse</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-6">All Products</h1>
        </div>

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
                <div className="bg-muted aspect-square rounded-lg mb-4" />
                <div className="h-3 bg-muted rounded w-1/3 mb-2" />
                <div className="h-5 bg-muted rounded w-2/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/4" />
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
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-serif text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </main>
  );
}
