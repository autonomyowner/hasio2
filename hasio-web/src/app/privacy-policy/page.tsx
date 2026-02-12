import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Hasio",
  description: "Privacy Policy for Hasio AI travel guide app for Al-Ahsa Oasis",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-heading font-bold text-on-surface mb-8">
        Privacy Policy
      </h1>

      <div className="prose prose-sm max-w-none space-y-6 text-on-surface-variant">
        <p><strong>Last updated:</strong> February 2026</p>

        <section>
          <h2 className="text-xl font-heading font-bold text-on-surface mt-8 mb-3">1. Introduction</h2>
          <p>
            Hasio (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is an AI-powered travel guide application for Al-Ahsa
            Oasis, Saudi Arabia. This Privacy Policy explains how we collect, use, and protect
            your personal information when you use our website and mobile app.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold text-on-surface mt-8 mb-3">2. Information We Collect</h2>
          <p><strong>Account Information:</strong> When you create an account, we collect your email address, name, and account type (visitor, business owner, or service provider).</p>
          <p><strong>Content You Submit:</strong> Photos (moments), reviews, business listings, and service listings you choose to submit.</p>
          <p><strong>AI Interactions:</strong> Messages you send to our AI travel planner to provide personalized recommendations.</p>
          <p><strong>Usage Data:</strong> Basic usage analytics to improve our service.</p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold text-on-surface mt-8 mb-3">3. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Better-Auth:</strong> Authentication and account management</li>
            <li><strong>Convex:</strong> Real-time database and backend</li>
            <li><strong>Groq / OpenAI:</strong> AI language models for the travel planner</li>
            <li><strong>ElevenLabs:</strong> Text-to-speech for voice assistant (mobile app)</li>
            <li><strong>Cloudflare R2:</strong> Image storage</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold text-on-surface mt-8 mb-3">4. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To provide and maintain our service</li>
            <li>To personalize AI travel recommendations</li>
            <li>To manage business and service provider listings</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold text-on-surface mt-8 mb-3">5. AI-Generated Content</h2>
          <p>
            Our AI travel planner generates responses based on your questions. We implement
            content safety measures to prevent harmful content. Users can report inappropriate
            AI responses, which are reviewed by our team.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold text-on-surface mt-8 mb-3">6. Data Retention &amp; Deletion</h2>
          <p>
            You can delete your account at any time through the Settings page. When you delete
            your account, all your personal data, moments, favorites, chat history, and
            submitted content will be permanently removed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold text-on-surface mt-8 mb-3">7. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, contact us at: privacy@hasio.xyz
          </p>
        </section>
      </div>
    </div>
  );
}
