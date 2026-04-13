import { Link } from "wouter";
import { MapPin, Phone, Mail } from "lucide-react";
import logoImg from "@assets/LogoAlaaEdited.df4b9638e3b8557a4379_(1)_1776081454867.png";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/90 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <img src={logoImg} alt="Mirruba Jewellery" className="h-10 w-auto mb-4 brightness-150" />
            <p className="text-sm leading-relaxed text-background/60">
              An Icon Of Absolute Femininity. We are committed to providing a unique shopping experience with the perfect jewelry pieces that suit your style.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg tracking-wider mb-4 text-gold-light">Quick Links</h4>
            <nav className="space-y-3">
              <Link href="/" className="block text-sm text-background/60 hover:text-gold-light transition-colors" data-testid="link-footer-home">
                Home
              </Link>
              <Link href="/shop" className="block text-sm text-background/60 hover:text-gold-light transition-colors" data-testid="link-footer-shop">
                Shop
              </Link>
              <Link href="/#about" className="block text-sm text-background/60 hover:text-gold-light transition-colors" data-testid="link-footer-about">
                About
              </Link>
              <Link href="/#contact" className="block text-sm text-background/60 hover:text-gold-light transition-colors" data-testid="link-footer-contact">
                Contact
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-serif text-lg tracking-wider mb-4 text-gold-light">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-background/60">
                <MapPin className="w-4 h-4 mt-0.5 text-gold-light shrink-0" />
                <span>Sharjah, Emirates, Central Market</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-background/60">
                <Phone className="w-4 h-4 text-gold-light shrink-0" />
                <a href="tel:+971501045496" className="hover:text-gold-light transition-colors">
                  +971 501 045 496
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-background/60">
                <Mail className="w-4 h-4 text-gold-light shrink-0" />
                <a href="mailto:contact@mirruba-jewellery.com" className="hover:text-gold-light transition-colors">
                  contact@mirruba-jewellery.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">
            &copy; {new Date().getFullYear()} Mirruba Jewellery. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-background/40 hover:text-gold-light transition-colors text-sm"
              data-testid="link-terms"
            >
              Terms of Service
            </Link>
            <a
              href="#"
              className="text-background/40 hover:text-gold-light transition-colors text-sm"
              data-testid="link-facebook"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-background/40 hover:text-gold-light transition-colors text-sm"
              data-testid="link-instagram"
            >
              Instagram
            </a>
          </div>
        </div>
        <div className="text-center mt-6">
          <p className="text-xs text-background/30">
            Developed by <a href="https://mr-appss.com/" target="_blank" rel="noopener noreferrer" className="text-gold-light/50 hover:text-gold transition-colors">Mr Apps</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
