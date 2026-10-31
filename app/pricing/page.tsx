import Navbar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { PricingTable } from "@clerk/nextjs";
import { CheckCircle2, HelpCircle, ShieldCheck, Zap } from "lucide-react";

export default function PricingPage() {
  const faqs = [
    {
      q: "What does the Free plan include?",
      a: "The Free plan gives you 1 active project board with unlimited columns and tasks. It is perfect for personal projects, side hustles, or trying out Kando.",
    },
    {
      q: "Can I upgrade or downgrade at any time?",
      a: "Yes! You can upgrade to Pro or Enterprise at any time. When you upgrade, your new limits take effect instantly. If you downgrade, your existing boards remain accessible.",
    },
    {
      q: "How does billing work?",
      a: "Billing is handled securely through our Clerk customer portal. You can pay via credit card, Apple Pay, or Google Pay, and manage invoices with one click.",
    },
    {
      q: "Do you offer refunds?",
      a: "Yes, we offer a no-questions-asked 30-day refund policy if Kando does not fit your workflow.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafb] text-zinc-900 selection:bg-indigo-500/20">
      <Navbar />

      <main className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge
            variant="outline"
            className="mb-3 text-indigo-700 bg-indigo-50 border-indigo-200 text-xs font-semibold"
          >
            Flexible Plans
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-4">
            Simple, honest pricing.
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">
            Start free with zero credit card required. Upgrade when you need
            unlimited boards, priority features, and team scale.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Free forever tier
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-indigo-500" /> 30-day money-back guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" /> Cancel anytime with 1 click
            </span>
          </div>
        </div>

        {/* Clerk Pricing Table Container */}
        <div className="rounded-3xl border border-zinc-200/90 bg-white p-4 sm:p-8 shadow-xl shadow-zinc-200/40 mb-20">
          <PricingTable newSubscriptionRedirectUrl="/dashboard" />
        </div>

        {/* Frequently Asked Questions */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-2">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs"
              >
                <h3 className="text-sm font-bold text-zinc-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
