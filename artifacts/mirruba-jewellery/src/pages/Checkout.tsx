import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Trash2, ShoppingBag, Minus, Plus, Send, Loader2, CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, getProductImage, getProductCategory } from "@/data/products";

export default function Checkout() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<"cart" | "details" | "success">("cart");
  const [sending, setSending] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  function handleProceed() {
    if (items.length === 0) return;
    setStep("details");
    window.scrollTo(0, 0);
  }

  function handlePlaceOrder() {
    if (!name || !phone) return;
    setSending(true);

    const orderLines = items.map(
      (item) =>
        `• ${item.product.name} x${item.quantity} — ${formatPrice(parseFloat(item.product.price || "0") * item.quantity)}`
    );

    const message = [
      `🛍 *New Order — Mirruba Jewellery*`,
      ``,
      `*Customer:* ${name}`,
      `*Phone:* ${phone}`,
      email ? `*Email:* ${email}` : "",
      address ? `*Address:* ${address}` : "",
      ``,
      `*Order Items:*`,
      ...orderLines,
      ``,
      `*Total: ${formatPrice(totalPrice)}*`,
      notes ? `\n*Notes:* ${notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const whatsappUrl = `https://wa.me/971501045496?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setSending(false);
      setStep("success");
      clearCart();
    }, 800);
  }

  if (step === "success") {
    return (
      <main className="pt-24 pb-16 min-h-screen" data-testid="page-checkout">
        <div className="max-w-lg mx-auto px-4 text-center py-20">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="font-serif text-3xl mb-3">Order Sent!</h2>
          <p className="text-muted-foreground mb-2">
            Your order has been sent via WhatsApp.
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            Our team will confirm your order and contact you shortly.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-gold text-white px-8 py-3 rounded-lg tracking-[0.1em] uppercase text-sm font-medium hover:bg-gold/90 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 min-h-screen" data-testid="page-checkout">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <h1 className="font-serif text-3xl sm:text-4xl mb-4">
          {step === "cart" ? "Your Bag" : "Delivery Details"}
        </h1>

        {step === "details" && (
          <button
            onClick={() => setStep("cart")}
            className="text-sm text-gold hover:text-gold-light transition-colors mb-8 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to bag
          </button>
        )}

        {items.length === 0 && step === "cart" ? (
          <div className="text-center py-20 opacity-0 animate-fade-in" style={{ animationFillMode: "forwards" }}>
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
            <p className="font-serif text-xl text-muted-foreground mb-4">
              Your shopping bag is empty
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors tracking-[0.15em] uppercase text-sm font-medium"
            >
              Browse Products
            </Link>
          </div>
        ) : step === "cart" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 sm:gap-6 p-4 sm:p-5 bg-[#1a1816] rounded-xl border border-border/30"
                >
                  <img
                    src={getProductImage(item.product)}
                    alt={item.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base sm:text-lg truncate">{item.product.name}</h3>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mt-0.5">
                      {getProductCategory(item.product)}
                    </p>
                    <p className="text-gold font-medium mt-1.5 text-sm">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-0 border border-border/40 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-gold/10 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-gold/10 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-muted-foreground/50 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#1a1816] rounded-xl border border-border/30 p-5 sm:p-6 sticky top-28">
                <h3 className="font-serif text-lg mb-5">Order Summary</h3>
                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate mr-2">
                        {item.product.name} ×{item.quantity}
                      </span>
                      <span className="shrink-0">{formatPrice(parseFloat(item.product.price || "0") * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border/30 pt-4 mb-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-gold text-sm">Free</span>
                  </div>
                  <div className="flex justify-between font-serif text-lg">
                    <span>Total</span>
                    <span className="text-gold">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
                <button
                  onClick={handleProceed}
                  className="w-full bg-gold text-white py-3.5 tracking-[0.1em] uppercase text-sm font-medium hover:bg-gold/90 transition-all rounded-lg flex items-center justify-center gap-2"
                >
                  Proceed to Order
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mt-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-[#1a1816] rounded-xl border border-border/30 p-5 sm:p-6">
                <h3 className="font-serif text-lg mb-5">Your Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        required
                        className="w-full px-4 py-3 bg-[#0f0d0c] border border-border/40 rounded-lg text-white placeholder:text-muted-foreground/30 focus:outline-none focus:border-gold transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Phone *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+971 5XX XXX XXXX"
                        required
                        className="w-full px-4 py-3 bg-[#0f0d0c] border border-border/40 rounded-lg text-white placeholder:text-muted-foreground/30 focus:outline-none focus:border-gold transition-colors text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-[#0f0d0c] border border-border/40 rounded-lg text-white placeholder:text-muted-foreground/30 focus:outline-none focus:border-gold transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Delivery Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Sharjah, UAE"
                      className="w-full px-4 py-3 bg-[#0f0d0c] border border-border/40 rounded-lg text-white placeholder:text-muted-foreground/30 focus:outline-none focus:border-gold transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Order Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requests..."
                      rows={3}
                      className="w-full px-4 py-3 bg-[#0f0d0c] border border-border/40 rounded-lg text-white placeholder:text-muted-foreground/30 focus:outline-none focus:border-gold transition-colors text-sm resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#1a1816] rounded-xl border border-border/30 p-5 sm:p-6 sticky top-28">
                <h3 className="font-serif text-lg mb-5">Order Summary</h3>
                <div className="space-y-2 mb-5">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate mr-2">
                        {item.product.name} ×{item.quantity}
                      </span>
                      <span className="shrink-0">{formatPrice(parseFloat(item.product.price || "0") * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border/30 pt-4 mb-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-gold text-sm">Free</span>
                  </div>
                  <div className="flex justify-between font-serif text-lg">
                    <span>Total</span>
                    <span className="text-gold">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={sending || !name || !phone}
                  className="w-full bg-[#25D366] text-white py-3.5 tracking-[0.1em] uppercase text-sm font-medium hover:bg-[#25D366]/90 transition-all rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Order via WhatsApp
                </button>
                <p className="text-xs text-muted-foreground/50 text-center mt-3">
                  Your order will be sent to our WhatsApp for confirmation
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
