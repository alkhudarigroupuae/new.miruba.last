import { useRoute, Link } from "wouter";
import { ArrowLeft, ShoppingBag, Heart } from "lucide-react";
import { getProductById, formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const product = params?.id ? getProductById(params.id) : null;
  const { addToCart } = useCart();
  const { toast } = useToast();

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

  return (
    <main className="pt-24 pb-16 min-h-screen" data-testid="page-product-detail">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-8 text-sm"
          data-testid="link-back-to-shop"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
            <div className="relative overflow-hidden rounded-lg bg-muted aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
            <p className="text-gold tracking-[0.3em] text-xs uppercase mb-3">
              {product.category}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl mb-4" data-testid="text-product-name">
              {product.name}
            </h1>
            <p className="text-gold text-2xl font-medium mb-8" data-testid="text-product-price">
              {formatPrice(product.price)}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-10" data-testid="text-product-description">
              {product.description}
            </p>

            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-3 bg-gold text-white py-3.5 tracking-[0.15em] uppercase text-sm font-medium hover:bg-gold-dark transition-all duration-300 rounded"
                data-testid="button-add-to-cart"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Bag
              </button>
              <button
                className="p-3.5 border border-border rounded hover:border-gold hover:text-gold transition-all duration-300"
                data-testid="button-wishlist"
                onClick={() => toast({ title: "Saved", description: "Added to your wishlist." })}
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>

            <div className="border-t border-border pt-8 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category</span>
                <span>{product.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Material</span>
                <span>18K Gold</span>
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
