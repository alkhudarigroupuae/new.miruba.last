import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { fetchProducts, type WcProduct } from "@/data/products";
import logoImg from "@assets/LogoAlaaEdited.df4b9638e3b8557a4379_(1)_1776081454867.png";
import mobileBannerImg from "@assets/Untitled_design_(3)_1776088697980.jpg";

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

const HERO_IMAGE = "https://www.mirruba-jewellery.com/static/media/jewellery-girl-welcome-row-1(2).f8dd553f2bb225f4ee47.png";

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="section-hero">
      <img
        src={mobileBannerImg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center md:hidden"
      />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <p className="text-gold-light tracking-[0.4em] text-xs sm:text-sm uppercase mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
          An Icon Of Absolute Femininity
        </p>
        <img src={logoImg} alt="Mirruba" className="h-16 sm:h-24 md:h-28 w-auto mx-auto mb-6 opacity-0 animate-fade-in-up brightness-150" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }} />
        <p className="text-white/70 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
          We are committed to providing a unique shopping experience with the perfect jewelry pieces that suit your style and preferences.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-3 bg-gold text-white px-8 py-3.5 tracking-[0.2em] uppercase text-sm font-medium hover:bg-gold-dark transition-all duration-300 rounded opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}
          data-testid="link-shop-now"
        >
          Shop Now
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-px h-16 bg-gradient-to-b from-transparent to-gold-light/50 animate-pulse" />
      </div>
    </section>
  );
}

function FeaturedSection() {
  const [products, setProducts] = useState<WcProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, isVisible } = useInView(0.1);

  useEffect(() => {
    fetchProducts()
      .then((prods) => {
        const jewelryCats = ["rings", "earrings", "necklaces", "bracelets", "trending", "accessories"];
        const filtered = prods.filter((p) =>
          p.categories.some((c) => jewelryCats.includes(c.slug.toLowerCase()))
        );
        setProducts(filtered.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-12 sm:py-24 bg-muted/30" data-testid="section-featured">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-8 sm:mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-gold tracking-[0.3em] text-xs uppercase mb-4">Our Collections</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-4">
            Trending Products
          </h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted aspect-square rounded-lg mb-4" />
                <div className="h-3 bg-muted rounded w-1/3 mb-2" />
                <div className="h-5 bg-muted rounded w-2/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : isVisible ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : null}
        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors tracking-[0.15em] uppercase text-sm font-medium"
            data-testid="link-see-more"
          >
            See More
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function MarqueeSection() {
  return (
    <section className="py-12 bg-black/10 overflow-hidden" data-testid="section-marquee">
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {Array.from({ length: 12 }).map((_, i) => (
          <img
            key={i}
            src={logoImg}
            alt="Mirruba"
            className="h-8 w-auto mx-12 opacity-30 brightness-150"
          />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedSection />
      <MarqueeSection />
    </main>
  );
}
