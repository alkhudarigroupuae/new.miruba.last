import { Link } from "wouter";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useStore } from "@/context/StoreContext";
import { formatPrice, getProductImage, getProductCategory, type WcProduct } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: WcProduct;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { currency } = useCurrency();
  const store = useStore();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to bag",
      description: `${product.name} has been added to your shopping bag.`,
    });
  };

  return (
    <div
      className="group opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
      data-testid={`card-product-${product.id}`}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-lg bg-muted aspect-square mb-2 sm:mb-4 transition-shadow duration-500 group-hover:shadow-[0_0_35px_rgba(231,188,103,0.3)]">
          <img
            src={getProductImage(product)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-gold hover:text-white shadow-md"
            data-testid={`button-add-cart-${product.id}`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            {getProductCategory(product)}
          </p>
          <h3 className="font-serif text-sm sm:text-lg group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <p className="text-gold font-medium">{formatPrice(product.price, currency, store.usdRate)}</p>
        </div>
      </Link>
    </div>
  );
}
