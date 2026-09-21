"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, MapPin, Search, ShieldCheck, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { geocode, POPULAR_LOCATIONS } from "@/lib/geocode";
import { setFilters } from "@/state";
import { useAppDispatch } from "@/state/redux";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80";

const HeroSection = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const search = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      router.push("/search");
      return;
    }
    setSearching(true);
    const result = await geocode(trimmed);
    setSearching(false);
    if (!result) {
      toast.error(`We couldn't find "${trimmed}". Try a city name.`);
      return;
    }
    dispatch(setFilters({ location: result.label, coordinates: result.coordinates }));
    const params = new URLSearchParams({
      location: result.label,
      coordinates: result.coordinates.join(","),
    });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      <Image
        src={HERO_IMAGE}
        alt="A bright modern home with a green lawn"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/45 to-ink/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-950/40 to-transparent" />

      <div className="container relative pb-24 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5 text-accent-400" />
            Every listing verified by a real person
          </span>
          <h1 className="font-display text-5xl font-medium leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Find a place you&apos;ll{" "}
            <em className="font-normal italic text-accent-300">love</em> to call
            home.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            Search thousands of rental homes and apartments, compare fees up
            front, and apply online in minutes — no phone tag required.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          onSubmit={(e) => {
            e.preventDefault();
            search(query);
          }}
          className="mt-10 flex max-w-2xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-card-hover sm:flex-row sm:items-center sm:rounded-full"
        >
          <label className="flex flex-1 items-center gap-3 px-4 py-2">
            <MapPin className="h-5 w-5 shrink-0 text-brand-700" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Where do you want to live? City or neighborhood"
              className="w-full bg-transparent text-base text-ink outline-none placeholder:text-ink-faint"
              aria-label="Search location"
            />
          </label>
          <Button
            type="submit"
            size="lg"
            disabled={searching}
            className="rounded-xl sm:rounded-full sm:px-7"
          >
            {searching ? <Loader2 className="animate-spin" /> : <Search />}
            Search
          </Button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-5 flex flex-wrap items-center gap-2"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-white/60">
            Popular
          </span>
          {POPULAR_LOCATIONS.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => search(city)}
              className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-white hover:text-ink"
            >
              {city}
            </button>
          ))}
        </motion.div>

        <motion.dl
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/15 pt-8 text-white"
        >
          {[
            { value: "12 cities", label: "and growing every month" },
            { value: "48 hrs", label: "average time to a decision" },
            {
              value: (
                <span className="flex items-center gap-1.5">
                  4.8 <Star className="h-4 w-4 fill-accent-400 text-accent-400" />
                </span>
              ),
              label: "average renter rating",
            },
          ].map((stat, i) => (
            <div key={i}>
              <dt className="font-display text-2xl font-medium sm:text-3xl">{stat.value}</dt>
              <dd className="mt-1 text-xs text-white/65 sm:text-sm">{stat.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
};

export default HeroSection;
