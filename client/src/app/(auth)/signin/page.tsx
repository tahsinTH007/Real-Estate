"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound, Loader2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { auth, AuthError } from "@/lib/auth";
import { IS_MOCK } from "@/lib/config";
import { DEMO_ACCOUNTS } from "@/lib/constants";
import { signInSchema, type SignInFormData } from "@/lib/schemas";
import { DEMO_PASSWORD } from "@/mock/seed";
import { api } from "@/state/api";
import { useAppDispatch } from "@/state/redux";

const SignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signIn = async (values: SignInFormData) => {
    setSubmitting(true);
    try {
      const session = await auth.signIn(values.email, values.password);
      dispatch(api.util.resetApiState());
      toast.success(`Welcome back, ${session.username.split(" ")[0]}!`);
      const next = searchParams.get("next");
      router.replace(
        next && next.startsWith("/")
          ? next
          : session.role === "manager"
            ? "/managers/properties"
            : "/tenants/favorites",
      );
    } catch (err) {
      const message =
        err instanceof AuthError ? err.message : "Something went wrong. Try again.";
      form.setError("password", { message });
      setSubmitting(false);
    }
  };

  const fillDemo = (email: string) => {
    form.setValue("email", email);
    form.setValue("password", DEMO_PASSWORD);
    form.handleSubmit(signIn)();
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-medium tracking-tight text-ink">
          Welcome back
        </h1>
        <p className="mt-2 text-ink-muted">
          Sign in to pick up where you left off.
        </p>
      </div>

      {IS_MOCK && (
        <div className="mb-7">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Try a demo account
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {DEMO_ACCOUNTS.map((acct) => (
              <button
                key={acct.email}
                type="button"
                disabled={submitting}
                onClick={() => fillDemo(acct.email)}
                className="group rounded-xl border border-sand-200 bg-sand-50 p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:bg-white hover:shadow-card disabled:opacity-60"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 text-brand-800">
                    {acct.role === "manager" ? (
                      <KeyRound className="h-3.5 w-3.5" />
                    ) : (
                      <UserRound className="h-3.5 w-3.5" />
                    )}
                  </span>
                  <span className="text-sm font-semibold text-ink">
                    {acct.label} · {acct.name.split(" ")[0]}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-ink-soft">
                  {acct.description}
                </p>
              </button>
            ))}
          </div>
          <div className="my-6 flex items-center gap-3 text-xs text-ink-faint">
            <span className="h-px flex-1 bg-sand-200" />
            or sign in with email
            <span className="h-px flex-1 bg-sand-200" />
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(signIn)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="h-11 pr-11"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="animate-spin" />}
            Sign in
          </Button>
        </form>
      </Form>

      <p className="mt-8 text-center text-sm text-ink-muted">
        New to Rentiful?{" "}
        <Link href="/signup" className="font-semibold text-brand-700 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
};

const SignInPage = () => (
  <Suspense fallback={null}>
    <SignInForm />
  </Suspense>
);

export default SignInPage;
