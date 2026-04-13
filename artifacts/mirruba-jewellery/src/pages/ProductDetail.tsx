import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, ShoppingBag, Heart } from "lucide-react";
import { fetchProductBySlug, formatPrice, getProductImage, getProductCategory, stripHtml, type WcProduct } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const [product, setProduct] = useState<WcProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (!params?.slug) return;
    setLoading(true);
    fetchProductBySlug(params.slug)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [params?.slug]);

  if (loading) {
    return (
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12">
            <div className="animate-pulse bg-muted aspect-square rounded-lg shimmer-gold" />
            <div className="space-y-4">
              <div className="animate-pulse h-4 bg-muted rounded w-1/4 shimmer-gold" />
              <div className="animate-pulse h-8 bg-muted rounded w-2/3 shimmer-gold" />
              <div className="animate-pulse h-6 bg-muted rounded w-1/3 shimmer-gold" />
              <div className="animate-pulse h-20 bg-muted rounded w-full mt-8 shimmer-gold" />
              <div className="animate-pulse h-12 bg-muted rounded w-full mt-8 shimmer-gold" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl mb-4">Product not found</h1>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors"
            data-testid="link-back-shop"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to bag",
      description: `${product.name} has been added to your shopping bag.`,
    });
  };

  const description = stripHtml(product.description || product.short_description || "");
  const currentImage = product.images[selectedImage]?.src || getProductImage(product);

  return (
    <main className="pt-24 pb-16 min-h-screen" data-testid="page-product-detail">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/shop"
          className="opacity-0 animate-fade-in inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-8 text-sm"
          style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
          data-testid="link-back-to-shop"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="opacity-0 animate-slide-in-left" style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}>
            <div className="relative overflow-hidden rounded-lg bg-muted aspect-square group">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover opacity-0 animate-luxury-reveal transition-transform duration-700 group-hover:scale-105"
                style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {product.on_sale && (
                <span className="absolute top-4 left-4 bg-destructive text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider opacity-0 animate-stagger-up" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
                  Sale
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {product.images.slice(0, 4).map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(idx)}
                    className={`opacity-0 animate-stagger-up w-full aspect-square overflow-hidden rounded border-2 transition-all duration-300 ${
                      selectedImage === idx
                        ? "border-gold shadow-[0_0_12px_rgba(231,188,103,0.3)]"
                        : "border-border hover:border-gold/50"
                    }`}
                    style={{ animationDelay: `${0.5 + idx * 0.1}s`, animationFillMode: "forwards" }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt || product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p
              className="opacity-0 animate-stagger-up text-gold tracking-[0.3em] text-xs uppercase mb-3"
              style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
            >
              {getProductCategory(product)}
            </p>

            <div
              className="opacity-0 animate-gold-line h-[1px] bg-gold/60 mb-5"
              style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
            />

            <h1
              className="opacity-0 animate-stagger-up font-serif text-3xl sm:text-4xl mb-4"
              style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}
              data-testid="text-product-name"
            >
              {product.name}
            </h1>

            <div
              className="opacity-0 animate-stagger-up flex items-center gap-3 mb-8"
              style={{ animationDelay: "0.65s", animationFillMode: "forwards" }}
            >
              {product.on_sale && product.regular_price ? (
                <>
                  <span className="text-muted-foreground line-through text-lg">{formatPrice(product.regular_price)}</span>
                  <span className="text-gold text-2xl font-medium" data-testid="text-product-price">{formatPrice(product.price)}</span>
                </>
              ) : (
                <span className="text-gold text-2xl font-medium" data-testid="text-product-price">{formatPrice(product.price)}</span>
              )}
            </div>

            {description && (
              <p
                className="opacity-0 animate-stagger-up text-muted-foreground leading-relaxed mb-10"
                style={{ animationDelay: "0.75s", animationFillMode: "forwards" }}
                data-testid="text-product-description"
              >
                {description}
              </p>
            )}

            <div
              className="opacity-0 animate-stagger-up flex gap-4 mb-8"
              style={{ animationDelay: "0.85s", animationFillMode: "forwards" }}
            >
              <button
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-3 bg-gold text-white py-3.5 tracking-[0.15em] uppercase text-sm font-medium hover:bg-gold-dark transition-all duration-300 rounded hover:shadow-[0_4px_20px_rgba(231,188,103,0.4)] active:scale-[0.98]"
                data-testid="button-add-to-cart"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Bag
              </button>
              <button
                className="p-3.5 border border-border rounded hover:border-gold hover:text-gold transition-all duration-300 hover:shadow-[0_4px_20px_rgba(231,188,103,0.2)] active:scale-95"
                data-testid="button-wishlist"
                onClick={() => toast({ title: "Saved", description: "Added to your wishlist." })}
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>

            <div
              className="opacity-0 animate-stagger-up border-t border-border pt-8 space-y-4"
              style={{ animationDelay: "0.95s", animationFillMode: "forwards" }}
            >
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category</span>
                <span>{getProductCategory(product)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SKU</span>
                <span>{(product as any).sku || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Availability</span>
                <span className={product.stock_status === "instock" ? "text-green-600" : "text-destructive"}>
                  {product.stock_status === "instock" ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free within UAE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
