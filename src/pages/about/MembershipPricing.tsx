import { Helmet } from 'react-helmet-async';

export function MembershipPricing() {
  return (
    <div>
      <Helmet>
        <title>Membership Pricing | TradeHub24</title>
        <meta
          name="description"
          content="Explore our membership plans for homeowners and professionals to get the most out of TradeHub24."
        />
        <meta
          name="keywords"
          content="membership pricing, tradehub24 plans, subscription, homeowners, professionals"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Membership Pricing | TradeHub24" />
        <meta
          property="og:description"
          content="Explore our membership plans for homeowners and professionals to get the most out of TradeHub24."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.tradehub24.com/about/membership-pricing"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Membership Pricing | TradeHub24" />
        <meta
          name="twitter:description"
          content="Explore our membership plans for homeowners and professionals to get the most out of TradeHub24."
        />

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Membership Pricing | TradeHub24",
            url: "https://www.tradehub24.com/about/membership-pricing",
            description:
              "Explore our membership plans for homeowners and professionals to get the most out of TradeHub24.",
            publisher: {
              "@type": "Organization",
              name: "TradeHub24",
              url: "https://www.tradehub24.com",
            },
          })}
        </script>
      </Helmet>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Membership Pricing</h1>
        
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-semibold">Silver</h2>
          <p className="text-lg font-bold">£30.99 Per Month</p>
          <ul className="list-disc list-inside">
            <li>Profile listing – complete business profile</li>
            <li>3 Business Categories</li>
            <li>Direct contact on display</li>
            <li>Gallery of previous work</li>
            <li>Instant contact with customers</li>
            <li>Daily email update</li>
            <li>Review page (get reviews from your satisfied customers)</li>
          </ul>
          <button className="mt-3 p-2 bg-red-600 text-white rounded">Subscribe Now</button>
        </div>
        
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-semibold">Silver Plus</h2>
          <p className="text-lg font-bold">£45.99 Per Month</p>
          <ul className="list-disc list-inside">
            <li>Profile listing – complete business profile</li>
            <li>5 Business Categories</li>
            <li>Direct contact on display</li>
            <li>Gallery of previous work</li>
            <li>Instant contact with customers</li>
            <li>Daily email update</li>
            <li>Review page (get reviews from your satisfied customers)</li>
          </ul>
          <button className="mt-3 p-2 bg-red-600 text-white rounded">Subscribe Now</button>
        </div>
        
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-semibold">Silver Advance</h2>
          <p className="text-lg font-bold">£30.99 Per Month</p>
          <ul className="list-disc list-inside">
            <li>Profile listing – complete business profile</li>
            <li>10 Business Categories</li>
            <li>Direct contact on display</li>
            <li>Gallery of previous work</li>
            <li>Instant contact with customers</li>
            <li>Daily email update</li>
            <li>Review page (get reviews from your satisfied customers)</li>
          </ul>
          <button className="mt-3 p-2 bg-red-600 text-white rounded">Subscribe Now</button>
        </div>
      </div>
    </div>
  );
}