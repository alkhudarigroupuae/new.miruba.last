import { useState } from "react";
import { Link } from "wouter";
import { MapPin, Phone, Mail, Send, CheckCircle, Loader2 } from "lucide-react";
import logoImg from "@assets/LogoAlaaEdited.df4b9638e3b8557a4379_(1)_1776081454867.png";
import { useStore } from "@/context/StoreContext";

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <section className="bg-[#1a1714] py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-5">
          <Mail className="w-5 h-5 text-gold" />
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl text-white mb-3">Stay Connected</h3>
        <p className="text-sm text-foreground/60 mb-8 max-w-md mx-auto">
          Subscribe to receive updates on new collections, exclusive offers, and jewellery inspiration.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full pl-11 pr-4 py-3.5 bg-[#231f20] border border-gold/20 rounded-xl text-white placeholder:text-foreground/30 focus:outline-none focus:border-gold transition-colors text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className={`px-6 py-3.5 rounded-xl font-medium tracking-wide text-sm transition-all flex items-center justify-center gap-2 ${
              status === "success"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-gold text-white hover:bg-gold/90"
            } disabled:opacity-70`}
          >
            {status === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : status === "success" ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Subscribed
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Subscribe
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

export default function Footer() {
  const store = useStore();

  return (
    <>
    <NewsletterSection />
    <footer className="bg-[#231f20] text-foreground/90 pt-8 sm:pt-16 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-12 mb-6 sm:mb-12 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <img src={logoImg} alt={store.storeName} className="h-10 w-auto mb-4 brightness-150" />
            <p className="text-sm leading-relaxed text-foreground/90">
              {store.tagline}. We are committed to providing a unique shopping experience with the perfect jewelry pieces that suit your style.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg tracking-wider mb-4 text-gold-light">Quick Links</h4>
            <nav className="flex gap-4 justify-center md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-3 md:justify-items-start">
              <Link href="/" className="text-sm text-foreground/80 hover:text-gold-light transition-colors" data-testid="link-footer-home">
                Home
              </Link>
              <Link href="/shop" className="text-sm text-foreground/80 hover:text-gold-light transition-colors" data-testid="link-footer-shop">
                Shop
              </Link>
              <Link href="/about" className="text-sm text-foreground/80 hover:text-gold-light transition-colors" data-testid="link-footer-about">
                About
              </Link>
              <Link href="/contact" className="text-sm text-foreground/80 hover:text-gold-light transition-colors" data-testid="link-footer-contact">
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-serif text-lg tracking-wider mb-4 text-gold-light hidden md:block">Contact</h4>
            <div className="flex gap-6 md:hidden">
              <a href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center text-gold-light hover:bg-gold/20 transition-colors">
                <MapPin className="w-5 h-5" />
              </a>
              <a href={`tel:${store.contactPhone.replace(/\s/g, "")}`} className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center text-gold-light hover:bg-gold/20 transition-colors">
                <Phone className="w-5 h-5" />
              </a>
              <a href={`mailto:${store.contactEmail}`} className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center text-gold-light hover:bg-gold/20 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <div className="hidden md:block space-y-3">
              <div className="flex items-start gap-3 text-sm text-foreground/80">
                <MapPin className="w-4 h-4 mt-0.5 text-gold-light shrink-0" />
                <span>{store.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/80">
                <Phone className="w-4 h-4 text-gold-light shrink-0" />
                <a href={`tel:${store.contactPhone.replace(/\s/g, "")}`} className="hover:text-gold-light transition-colors">
                  {store.contactPhone}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/80">
                <Mail className="w-4 h-4 text-gold-light shrink-0" />
                <a href={`mailto:${store.contactEmail}`} className="hover:text-gold-light transition-colors">
                  {store.contactEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#231f20] mt-0 py-4 sm:py-5 border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs text-gold/90">
            &copy; {new Date().getFullYear()} {store.storeName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-gold/70 hover:text-gold transition-colors text-sm"
              data-testid="link-terms"
            >
              Terms of Service
            </Link>
            {store.facebookUrl && (
              <a
                href={store.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/70 hover:text-gold transition-colors text-sm"
                data-testid="link-facebook"
              >
                Facebook
              </a>
            )}
            {store.instagramUrl && (
              <a
                href={store.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/70 hover:text-gold transition-colors text-sm"
                data-testid="link-instagram"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
        <div className="text-center mt-6 pb-2">
          <p className="text-xs text-white">
            Developed by <a href={store.developerUrl} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors">{store.developerName}</a>
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}
