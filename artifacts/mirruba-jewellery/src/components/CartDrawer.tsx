import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useStore } from "@/context/StoreContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice, getProductImage } from "@/data/products";

export default function CartDrawer() {
  const { t } = useLanguage();
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { currency } = useCurrency();
  const store = useStore();

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={() => setIsCartOpen(false)}
        data-testid="cart-overlay"
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-serif text-xl tracking-wide">{t("shoppingCart")}</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 hover:text-gold transition-colors"
            data-testid="button-close-cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <p className="font-serif text-lg mb-2">{t("yourCartIsEmpty")}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4"
                  data-testid={`cart-item-${item.product.id}`}
                >
                  <img
                    src={getProductImage(item.product)}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-sm truncate">{item.product.name}</h3>
                    <p className="text-gold text-sm mt-1">{formatPrice(item.product.price, currency, store.usdRate)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 border border-border rounded hover:bg-accent transition-colors"
                        data-testid={`button-decrease-${item.product.id}`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 border border-border rounded hover:bg-accent transition-colors"
                        data-testid={`button-increase-${item.product.id}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-auto p-1 text-muted-foreground hover:text-destructive transition-colors"
                        data-testid={`button-remove-${item.product.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-border space-y-4">
            <div className="flex items-center justify-between font-serif text-lg">
              <span>{t("total")}</span>
              <span className="text-gold">{formatPrice(totalPrice, currency, store.usdRate)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="block w-full bg-gold text-white text-center py-3 tracking-[0.15em] uppercase text-sm font-medium hover:bg-gold-dark transition-colors rounded"
              data-testid="link-checkout"
            >
              {t("checkout")}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
