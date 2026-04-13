import { Link } from "wouter";
import { ArrowLeft, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, getProductImage, getProductCategory } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { toast } = useToast();

  const handlePlaceOrder = () => {
    toast({
      title: "Order placed successfully",
      description: "Thank you for your purchase! You will receive a confirmation email shortly.",
    });
    clearCart();
  };

  return (
    <main className="pt-24 pb-16 min-h-screen" data-testid="page-checkout">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-8 text-sm"
          data-testid="link-continue-shopping"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <h1 className="font-serif text-3xl sm:text-4xl mb-10" data-testid="text-checkout-title">
          Checkout
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 opacity-0 animate-fade-in" style={{ animationFillMode: "forwards" }}>
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
            <p className="font-serif text-xl text-muted-foreground mb-4">
              Your shopping bag is empty
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors tracking-[0.15em] uppercase text-sm font-medium"
              data-testid="link-browse-products"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-6 p-6 bg-card rounded-lg border border-border"
                  data-testid={`checkout-item-${item.product.id}`}
                >
                  <img
                    src={getProductImage(item.product)}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg">{item.product.name}</h3>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                      {getProductCategory(item.product)}
                    </p>
                    <p className="text-gold font-medium mt-2">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <label className="text-sm text-muted-foreground">Qty:</label>
                        <select
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product.id, Number(e.target.value))}
                          className="bg-background border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-gold"
                          data-testid={`select-qty-${item.product.id}`}
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        data-testid={`button-checkout-remove-${item.product.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-28">
                <h3 className="font-serif text-lg mb-6">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-gold">Free</span>
                  </div>
                </div>
                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between font-serif text-lg">
                    <span>Total</span>
                    <span className="text-gold" data-testid="text-order-total">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-gold text-white py-3.5 tracking-[0.15em] uppercase text-sm font-medium hover:bg-gold-dark transition-all duration-300 rounded"
                  data-testid="button-place-order"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
