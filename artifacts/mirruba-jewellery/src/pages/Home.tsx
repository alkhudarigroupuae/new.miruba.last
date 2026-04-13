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
        <p className="text-white text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
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

function CategoryShowcase() {
  const { ref, isVisible } = useInView(0.1);

  const categories = [
    { name: "Rings", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&h=600&fit=crop", slug: "rings" },
    { name: "Necklaces", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=600&fit=crop", slug: "necklaces" },
    { name: "Earrings", image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=500&h=600&fit=crop", slug: "earrings" },
    { name: "Bracelets", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=600&fit=crop", slug: "bracelets" },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background" data-testid="section-categories">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-10 sm:mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-gold tracking-[0.3em] text-xs uppercase mb-4">Explore</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-4">Shop By Category</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              href="/shop"
              className={`group relative overflow-hidden rounded-lg aspect-[3/4] transition-all duration-700 hover:shadow-[0_0_35px_rgba(231,188,103,0.3)] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <h3 className="font-serif text-lg sm:text-xl text-white mb-1">{cat.name}</h3>
                <span className="text-gold-light text-xs tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-1">
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function LuxuryBanner() {
  const { ref, isVisible } = useInView(0.2);

  return (
    <section className="relative py-20 sm:py-32 overflow-hidden" data-testid="section-luxury-banner">
      <img
        src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1600&h=800&fit=crop"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div ref={ref} className="relative z-10 max-w-3xl mx-auto text-center px-4">
        <p className={`text-gold-light tracking-[0.4em] text-xs sm:text-sm uppercase mb-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          Timeless Elegance
        </p>
        <h2 className={`font-serif text-3xl sm:text-4xl lg:text-5xl mb-6 text-white transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          Crafted With Passion,<br />Worn With Pride
        </h2>
        <p className={`text-white/70 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          Each Mirruba piece is meticulously handcrafted by master artisans, blending traditional techniques with contemporary design to create jewelry that tells your unique story.
        </p>
        <Link
          href="/shop"
          className={`inline-flex items-center gap-3 border border-gold text-gold px-8 py-3.5 tracking-[0.2em] uppercase text-sm font-medium hover:bg-gold hover:text-white transition-all duration-300 rounded ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "400ms" }}
        >
          Discover Collection
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

function AboutPreview() {
  const { ref, isVisible } = useInView(0.2);

  return (
    <section className="py-16 sm:py-24 bg-background" data-testid="section-about-preview">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            <p className="text-gold tracking-[0.3em] text-xs uppercase mb-4">Who We Are</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl mb-5 leading-tight">
              An Icon Of<br />Absolute Femininity
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base">
              It reflects the life of a solid, independent woman of rare beauty.
              An uncontrollable force awakens in you, enchants you, and takes you
              to a world of irresistible femininity and attractiveness.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors tracking-[0.15em] uppercase text-sm font-medium"
            >
              Read More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&h=800&fit=crop"
                alt="Luxury jewelry"
                className="w-full max-h-[280px] sm:max-h-[320px] rounded-lg shadow-xl object-cover"
                loading="lazy"
              />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-gold/30 rounded-lg hidden sm:block" />
              <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-gold/30 rounded-lg hidden sm:block" />
            </div>
          </div>
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
      <CategoryShowcase />
      <LuxuryBanner />
      <AboutPreview />
      <MarqueeSection />
    </main>
  );
}
