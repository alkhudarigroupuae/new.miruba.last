import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ArrowRight, MapPin, Phone, Mail, Send } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import logoImg from "@assets/LogoAlaaEdited.df4b9638e3b8557a4379_(1)_1776081454867.png";

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

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="section-hero">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://www.mirruba-jewellery.com/static/media/jewellery-girl-welcome-row-1(2).f8dd553f2bb225f4ee47.png')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

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

function AboutSection() {
  const { ref, isVisible } = useInView(0.2);

  return (
    <section id="about" className="py-24 bg-background" data-testid="section-about">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            <p className="text-gold tracking-[0.3em] text-xs uppercase mb-4">Our Story</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-6 leading-tight">
              An Icon Of<br />Absolute Femininity
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              It reflects the life of a solid, independent woman of rare beauty.
              An uncontrollable force awakens in you, enchants you, and takes you
              to a world of irresistible femininity and attractiveness. Succumb to her
              call; you have no resemblance but your mirror.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Through our website, you will be able to find the perfect jewelry pieces
              that suit your style and preferences, whether you are searching for a
              special gift or looking to add a touch of luxury to your jewelry collection.
            </p>
          </div>
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&h=800&fit=crop"
                alt="Luxury jewelry"
                className="w-full rounded-lg shadow-xl object-cover aspect-[3/4]"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-gold/30 rounded-lg" />
              <div className="absolute -top-6 -right-6 w-32 h-32 border-2 border-gold/30 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedSection() {
  const featured = getFeaturedProducts();
  const { ref, isVisible } = useInView(0.1);

  return (
    <section className="py-24 bg-muted/30" data-testid="section-featured">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-gold tracking-[0.3em] text-xs uppercase mb-4">Our Collections</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-4">
            Trending Products
          </h2>
        </div>
        {isVisible && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
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
    <section className="py-12 bg-foreground overflow-hidden" data-testid="section-marquee">
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

function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const { ref, isVisible } = useInView(0.1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent",
      description: "Thank you for contacting us. We will get back to you soon.",
    });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <section id="contact" className="py-24 bg-background" data-testid="section-contact">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-gold tracking-[0.3em] text-xs uppercase mb-4">Get In Touch</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-4">
            Contact Us
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ready to turn your ideas into reality? Let's talk! We're here to
            listen, guide, and help you bring your vision to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className={`space-y-8 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="font-serif text-lg mb-1">Visit Us</h4>
                <p className="text-muted-foreground text-sm">Sharjah, Emirates, Central Market</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="font-serif text-lg mb-1">Call Us</h4>
                <a href="tel:+971501045496" className="text-muted-foreground text-sm hover:text-gold transition-colors">
                  +971 501 045 496
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="font-serif text-lg mb-1">Email Us</h4>
                <a href="mailto:contact@mirruba-jewellery.com" className="text-muted-foreground text-sm hover:text-gold transition-colors">
                  contact@mirruba-jewellery.com
                </a>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`space-y-6 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
          >
            <div>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-transparent border-b border-border py-3 px-0 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-muted-foreground/50"
                data-testid="input-name"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-border py-3 px-0 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-muted-foreground/50"
                data-testid="input-email"
              />
            </div>
            <div>
              <textarea
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full bg-transparent border-b border-border py-3 px-0 text-sm focus:outline-none focus:border-gold transition-colors resize-none placeholder:text-muted-foreground/50"
                data-testid="input-message"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-gold text-white px-8 py-3 tracking-[0.15em] uppercase text-sm font-medium hover:bg-gold-dark transition-all duration-300 rounded"
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <FeaturedSection />
      <MarqueeSection />
      <ContactSection />
    </main>
  );
}
