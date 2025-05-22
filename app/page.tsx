/* kindling/app/page.tsx */
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Kindling – Micro-sponsorships that ignite startup growth',
  description:
    'The community marketplace where indie founders sponsor each others sites and level up together.',
};

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Hero ─────────────────────────────────────── */}
      <header className="bg-amber-50/60 py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700">
            <span className="material-symbols-outlined text-[18px]">
              local_fire_department
            </span>
            Beta live now –
            <Link href="/login" className="underline">
              join early
            </Link>
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl/tight font-bold sm:text-5xl">
            Micro-sponsorships that&nbsp;
            <span className="text-amber-500">ignite&nbsp;startup&nbsp;growth</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-700">
            Kindling links indie founders together: buy tiny ad spots on fellow
            startups, earn passive revenue on your own site, and grow together.
          </p>

          <p className="mx-auto mt-4 max-w-xl text-base text-amber-700 font-medium">
            <span className="material-symbols-outlined text-[16px] align-text-bottom mr-1">
              check_circle
            </span>
            100% free to implement – no subscription, no setup fees
          </p>
          <p className="mx-auto mt-2 max-w-xl text-base text-amber-700 font-medium">
            <span className="material-symbols-outlined text-[16px] align-text-bottom mr-1">
              check_circle
            </span>
            Only real sponsors or nothing at all – never placeholder ads
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-6 py-3 text-white transition hover:bg-amber-600"
            >
              <span className="material-symbols-outlined text-[20px]">
                rocket_launch
              </span>
              Get&nbsp;started
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-6 py-3 text-gray-700 transition hover:bg-gray-100"
            >
              Learn&nbsp;more
              <span className="material-symbols-outlined text-[18px]">
                expand_more
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Feature grid ─────────────────────────────── */}
      <section
        id="features"
        className="mx-auto max-w-6xl grid gap-12 px-6 py-24 sm:grid-cols-2 lg:grid-cols-3"
      >
        {[
          {
            icon: 'groups',
            title: 'Founder-to-founder',
            copy: 'Keep money in the community. Every ad dollar goes directly to another indie founder, not a giant ad network.',
          },
          {
            icon: 'bolt',
            title: '2-minute install',
            copy: 'Paste one <script> tag. Kindling picks the right sponsor, tracks clicks, and pays out automatically.',
          },
          {
            icon: 'paid',
            title: 'Fair 1 % fee',
            copy: 'We only take 1 % to cover Stripe fees — the rest is yours. No setup cost, no hidden fees, cancel any time.',
          },
          {
            icon: 'visibility',
            title: 'Transparent stats',
            copy: 'Real-time views, clicks, and revenue. No hidden metrics or black-box algorithms.',
          },
          {
            icon: 'block',
            title: 'No placeholder ads',
            copy: 'Only real sponsored ads or nothing at all. We never show default or network ads on your site.',
          },
          {
            icon: 'shield',
            title: 'You stay in control',
            copy: 'Approve every ad slot manually, or set automatic rules. Your brand, your rules.',
          },
        ].map((f) => (
          <article key={f.title} className="flex gap-4">
            <span className="material-symbols-outlined shrink-0 rounded-lg bg-amber-100 p-3 text-amber-600">
              {f.icon}
            </span>
            <div>
              <h3 className="mb-1 font-semibold">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.copy}</p>
            </div>
          </article>
        ))}
      </section>

      {/* ── How it works ─────────────────────────────── */}
      <section className="bg-rose-50 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold">How Kindling works</h2>
          <ol className="grid gap-12 sm:grid-cols-3">
            {[
              {
                step: '1',
                icon: 'download',
                title: 'Install (Free)',
                text: 'Paste the Kindling script or install the Wix / Webflow plugin. No cost to implement.',
              },
              {
                step: '2',
                icon: 'add_chart',
                title: 'Set price',
                text: 'Pick banner size & price. Your slot instantly appears in the marketplace.',
              },
              {
                step: '3',
                icon: 'coffee',
                title: 'Get paid',
                text: 'Sponsors buy with Stripe. Funds flow to your bank; you sip coffee.',
              },
            ].map((s) => (
              <li key={s.step} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-white">
                  <span className="material-symbols-outlined text-[28px]">
                    {s.icon}
                  </span>
                </div>
                <h4 className="mb-1 font-medium">{`${s.step}. ${s.title}`}</h4>
                <p className="text-sm text-gray-600">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Pricing section ─────────────────────────────── */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Using Kindling Costs You <span className="text-amber-600 font-semibold">Absolutely Nothing</span>
            </p>
            <p className="text-gray-600 max-w-3xl mx-auto mt-2">
              We only charge sponsors a tiny 1% fee. As a site owner, you never pay anything—not for setup, not for usage, not ever.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Sponsors */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">For Sponsors</h3>
                <p className="text-5xl font-bold text-amber-500 mb-6">+1%</p>
                <p className="text-gray-600 mb-6">
                  When you sponsor sites, we add a modest 1% fee to help keep the service running and provide customer support.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'We secure the payments',
                    'We block spam messages',
                    'We match you with relevant sites',
                    'We handle the business-side',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="material-symbols-outlined text-amber-500 mr-2">
                        check_circle
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-6 py-2.5 text-white transition hover:bg-amber-600 w-full justify-center"
                >
                  Sponsor a site
                </Link>
              </div>
            </div>
            
            {/* For Site Owners */}
            <div className="bg-gradient-to-br from-amber-50 to-rose-50 rounded-xl shadow-md overflow-hidden border border-amber-200 hover:shadow-lg transition-shadow">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">For Site Owners</h3>
                <p className="text-5xl font-bold text-amber-600 mb-6">$0</p>
                <p className="text-gray-600 mb-6">
                  Implementing and using Kindling on your site costs absolutely nothing. Keep 100% of what sponsors pay you.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'No setup cost',
                    'No subscription fees',
                    'No hidden charges',
                    'No revenue share',
                    'Use on unlimited websites',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="material-symbols-outlined text-amber-600 mr-2">
                        check_circle
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col items-center gap-3">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-md bg-amber-600 px-6 py-2.5 text-white transition hover:bg-amber-700 w-full justify-center"
                  >
                    Add to your site
                  </Link>
                  <p className="text-sm text-gray-500">No credit card required</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ section ───────────────────────────────── */}
      <section id="faq" className="py-24 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                question: "How are messages moderated?",
                answer: "All sponsor messages go through our automated content filtering system to block inappropriate content. Our team also performs periodic manual reviews to ensure all content meets our community guidelines."
              },
              {
                question: "What payment methods are accepted?",
                answer: "We accept all major credit and debit cards (Visa, Mastercard, American Express, and Discover) through our secure payment processor, Stripe. This ensures your payment information is always protected."
              },
              {
                question: "Do you accept PayPal?",
                answer: "Currently, we only support payments via Stripe. We're exploring adding PayPal as a payment option in the future based on user feedback and demand."
              },
              {
                question: "Is there a free trial available?",
                answer: "Yes! Implementing Kindling on your site is completely free. Your sponsors contribute the 1% fee and cover Stripe transaction costs. As a site owner, you pay absolutely nothing—not for setup, not for usage, not ever."
              },
              {
                question: "How do I contact support if I encounter an issue?",
                answer: "You can reach our support team at support@kindling.com or through the Help Center in your dashboard. We typically respond to all inquiries within 24 hours on business days."
              },
              {
                question: "Can I cancel my account?",
                answer: "Yes, you can cancel your account at any time from your dashboard settings. There are no cancellation fees or long-term commitments."
              },
              {
                question: "How much does it cost to get started?",
                answer: "It costs absolutely nothing to get started. Kindling is free to implement on your website. We only take a 1% commission from successful sponsor transactions."
              },
              {
                question: "How do payouts work?",
                answer: "Payouts are automatically processed through Stripe Connect. Once you reach the minimum threshold of $50, funds are transferred directly to your connected bank account on a monthly basis."
              },
              {
                question: "What types of ads can I run?",
                answer: "Kindling supports various ad formats including text links, small banners, and inline sponsorship messages. You have full control over the size, placement, and styling to match your site's design."
              },
              {
                question: "Can I control which sponsors appear on my site?",
                answer: "Absolutely! You have complete control over which sponsors can appear on your site. You can manually approve each sponsor or set automatic rules based on categories, keywords, and other criteria."
              }
            ].map((faq, i) => (
              <div key={i} className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Still have questions? We're here to help.</p>
            <Link 
              href="/login" 
              className="inline-flex items-center text-amber-600 font-medium hover:text-amber-700"
            >
              Contact our support team
              <span className="material-symbols-outlined ml-1 text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Call-to-action banner ─────────────────────── */}
      <section className="bg-gradient-to-r from-amber-500 to-rose-500 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to ignite your&nbsp;growth?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-amber-100">
            Create your free account and publish your first ad slot in under two minutes. No cost to get started.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 font-medium text-amber-600 shadow-md transition hover:bg-amber-50"
          >
            <span className="material-symbols-outlined text-[20px]">
              rocket_launch
            </span>
            Get&nbsp;started
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="bg-gray-900 py-12 text-gray-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 sm:flex-row sm:justify-between">
          <p className="flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-amber-400">
              local_fire_department
            </span>
            © {new Date().getFullYear()} Kindling
          </p>
          <nav className="flex gap-6 text-sm">
            <Link href="/login" className="hover:text-white">
              Log&nbsp;in
            </Link>
            <Link href="/settings" className="hover:text-white">
              Settings
            </Link>
            <a
              href="https://github.com/your-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
