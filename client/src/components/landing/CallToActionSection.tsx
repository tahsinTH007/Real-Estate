"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const CallToActionSection = () => {
  return (
    <section className="container pb-20 sm:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-brand-900 px-8 py-14 text-white sm:px-14 sm:py-20"
      >
        {/* decorative rings */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-brand-700/40 blur-3xl" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
              Ready when you are
            </p>
            <h2 className="font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
              Your next home is a search away.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/75">
              Create a free account to save favorites, get notified about new
              listings and apply in one click.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button asChild variant="inverse" size="lg" className="rounded-full">
              <Link href="/search">
                <Search /> Explore homes
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-accent-500 text-ink hover:bg-accent-400"
            >
              <Link href="/signup">
                Create account <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CallToActionSection;
