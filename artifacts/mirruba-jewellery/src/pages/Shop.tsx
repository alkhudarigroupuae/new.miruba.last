import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory, categories } from "@/data/products";

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const filteredProducts = getProductsByCategory(activeCategory);

  return (
    <main className="pt-24 pb-16 min-h-screen" data-testid="page-shop">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gold tracking-[0.3em] text-xs uppercase mb-4">Browse</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-6">All Products</h1>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-serif text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </main>
  );
}
