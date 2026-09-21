"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, KeyRound, Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Search,
    title: "Search & save",
    description:
      "Set your budget, must-have amenities and move-in date. Save the homes you like to compare later.",
  },
  {
    icon: Send,
    title: "Apply online",
    description:
      "Send a single application straight to the property manager. No printing, no faxing, no phone tag.",
  },
  {
    icon: KeyRound,
    title: "Sign & move in",
    description:
      "Once approved, your lease, payment schedule and manager contact all live in one dashboard.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="container scroll-mt-20 py-20 sm:py-24">
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="section-eyebrow">How it works</p>
          <h2 className="section-title">From first search to front door</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-muted">
            Three steps. That&apos;s the whole process — and you can track every
            one of them from your dashboard.
          </p>

          <ol className="relative mt-10 space-y-8 border-l border-sand-300 pl-8">
            {steps.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.12 }}
                className="relative"
              >
                <span className="absolute -left-[2.55rem] flex h-9 w-9 items-center justify-center rounded-full border-4 border-background bg-brand-700 text-white shadow-sm">
                  <step.icon className="h-4 w-4" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                  Step {i + 1}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink-muted">
                  {step.description}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card-hover sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80"
              alt="A bright loft apartment interior"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/20 bg-white/10 p-5 text-white backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                  <Building2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Own or manage properties?</p>
                  <p className="text-xs text-white/75">
                    List in minutes, review applicants, track rent.
                  </p>
                </div>
              </div>
              <Button asChild variant="inverse" size="sm" className="mt-4 w-full">
                <Link href="/signup?role=manager">
                  Get started as a manager <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
