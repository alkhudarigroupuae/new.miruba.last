export default function Terms() {
  return (
    <main className="pt-24 pb-16 min-h-screen" data-testid="page-terms">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-gold tracking-[0.3em] text-xs uppercase mb-4">Legal</p>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-10">Terms of Service</h1>

        <div className="space-y-8 text-muted-foreground leading-relaxed text-sm">
          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">1. Introduction</h2>
            <p>
              Welcome to Mirruba Jewellery. By accessing and using our website, you accept and agree to be bound by the terms and conditions outlined below. If you do not agree to these terms, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">2. Products and Pricing</h2>
            <p>
              All products displayed on our website are subject to availability. Prices are listed in AED (UAE Dirham) and are inclusive of applicable taxes unless stated otherwise. Mirruba Jewellery reserves the right to modify prices without prior notice.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">3. Orders and Payment</h2>
            <p>
              By placing an order, you confirm that the information provided is accurate and complete. We reserve the right to cancel any order due to pricing errors, product unavailability, or suspected fraudulent activity. Payment is processed securely through our approved payment providers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">4. Shipping and Delivery</h2>
            <p>
              We offer free shipping within the UAE. Delivery times may vary depending on your location. Mirruba Jewellery is not responsible for delays caused by shipping carriers or customs procedures. International shipping rates and timelines will be provided at checkout where applicable.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">5. Returns and Exchanges</h2>
            <p>
              We accept returns and exchanges within 14 days of delivery, provided the item is in its original condition with all packaging and tags intact. Custom or personalized items are non-refundable. To initiate a return, please contact us at contact@mirruba-jewellery.com.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">6. Intellectual Property</h2>
            <p>
              All content on this website, including images, logos, text, and designs, is the property of Mirruba Jewellery and is protected by copyright and trademark laws. Unauthorized use, reproduction, or distribution of any content is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">7. Privacy</h2>
            <p>
              We are committed to protecting your personal information. Any data collected through our website is used solely for order processing, customer service, and improving your shopping experience. We do not share your personal information with third parties without your consent.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">8. Limitation of Liability</h2>
            <p>
              Mirruba Jewellery shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability shall not exceed the amount paid for the product in question.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">9. Contact</h2>
            <p>
              For questions regarding these terms, please contact us at:
            </p>
            <p className="mt-2">
              Mirruba Jewellery<br />
              Sharjah, Emirates, Central Market<br />
              Email: contact@mirruba-jewellery.com<br />
              Phone: +971 501 045 496
            </p>
          </section>

          <p className="text-xs text-muted-foreground/60 pt-4 border-t border-border">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>
    </main>
  );
}
