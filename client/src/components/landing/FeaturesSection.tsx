"use client";

import { motion } from "framer-motion";
import { BadgeCheck, MapPinned, Receipt, Zap } from "lucide-react";

const features = [
  {
    icon: BadgeCheck,
    title: "Verified listings only",
    description:
      "Every home is checked by our team before it goes live, so what you see is what you'll get on move-in day.",
  },
  {
    icon: MapPinned,
    title: "Map-first search",
    description:
      "Explore neighborhoods on an interactive map and filter by price, size, amenities and availability.",
  },
  {
    icon: Receipt,
    title: "No surprise fees",
    description:
      "Application fees, deposits and pet policies are shown up front on every listing — before you apply.",
  },
  {
    icon: Zap,
    title: "Apply in minutes",
    description:
      "Submit one application online and track its status. Most managers respond within two days.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="section-eyebrow justify-center">Why Rentiful</p>
          <h2 className="section-title">
            Renting, minus the runaround
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            We built Rentiful around the parts of renting that usually waste your
            time — chasing listings, hidden fees and endless back-and-forth.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-2xl border border-sand-200 bg-sand-50/60 p-6 transition-all hover:-translate-y-1 hover:border-brand-200 hover:bg-white hover:shadow-card-hover"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm transition-transform group-hover:-rotate-6">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
