import Link from "next/link";
import { Compass, Search } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <Logo className="mb-10" />
      <p className="section-eyebrow">404</p>
      <h1 className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
        This page has moved out.
      </h1>
      <p className="mt-4 max-w-md text-ink-muted">
        The address you followed doesn&apos;t exist anymore. Let&apos;s get you
        back to somewhere with a roof.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/search">
            <Search /> Browse homes
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <Compass /> Go home
          </Link>
        </Button>
      </div>
    </div>
  );
}
