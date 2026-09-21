"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Check, Home, Loader2 } from "lucide-react";
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
import { signUpSchema, type SignUpFormData } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { api } from "@/state/api";
import { useAppDispatch } from "@/state/redux";

const roles = [
  {
    value: "tenant" as const,
    icon: Home,
    title: "I'm looking for a home",
    description: "Search, save favorites and apply to listings.",
  },
  {
    value: "manager" as const,
    icon: Building2,
    title: "I manage properties",
    description: "List homes, review applications and track leases.",
  },
];

const SignUpForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [confirmStep, setConfirmStep] = useState<null | { email: string }>(null);
  const [code, setCode] = useState("");

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: searchParams.get("role") === "manager" ? "manager" : "tenant",
    },
  });

  const finish = (role: SignUpFormData["role"]) => {
    dispatch(api.util.resetApiState());
    router.replace(role === "manager" ? "/managers/properties" : "/tenants/favorites");
  };

  const onSubmit = async (values: SignUpFormData) => {
    setSubmitting(true);
    try {
      const result = await auth.signUp({
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
      });
      if (result.nextStep === "confirm") {
        setConfirmStep({ email: values.email });
        setSubmitting(false);
        return;
      }
      toast.success("Account created — welcome to Rentiful!");
      finish(values.role);
    } catch (err) {
      const message =
        err instanceof AuthError ? err.message : "Something went wrong. Try again.";
      form.setError("email", { message });
      setSubmitting(false);
    }
  };

  const onConfirm = async () => {
    if (!confirmStep) return;
    setSubmitting(true);
    try {
      await auth.confirmSignUp(form.getValues("username"), code);
      await auth.signIn(confirmStep.email, form.getValues("password"));
      toast.success("Email confirmed — welcome!");
      finish(form.getValues("role"));
    } catch (err) {
      toast.error(err instanceof AuthError ? err.message : "Confirmation failed.");
      setSubmitting(false);
    }
  };

  if (confirmStep) {
    return (
      <div className="animate-fade-in-up">
        <h1 className="font-display text-4xl font-medium tracking-tight text-ink">
          Check your inbox
        </h1>
        <p className="mt-2 text-ink-muted">
          We sent a confirmation code to <strong>{confirmStep.email}</strong>.
        </p>
        <div className="mt-8 space-y-4">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            inputMode="numeric"
            className="h-11 text-center text-lg tracking-[0.4em]"
          />
          <Button size="lg" className="w-full" onClick={onConfirm} disabled={submitting}>
            {submitting && <Loader2 className="animate-spin" />}
            Confirm and continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-medium tracking-tight text-ink">
          Create your account
        </h1>
        <p className="mt-2 text-ink-muted">
          It takes less than a minute. No credit card required.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I am…</FormLabel>
                <FormControl>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {roles.map((r) => {
                      const active = field.value === r.value;
                      return (
                        <button
                          type="button"
                          key={r.value}
                          onClick={() => field.onChange(r.value)}
                          className={cn(
                            "relative rounded-xl border p-4 text-left transition-all",
                            active
                              ? "border-brand-600 bg-brand-50 shadow-sm ring-1 ring-brand-600"
                              : "border-sand-200 bg-white hover:border-sand-300 hover:bg-sand-50",
                          )}
                        >
                          {active && (
                            <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-700 text-white">
                              <Check className="h-3 w-3" strokeWidth={3} />
                            </span>
                          )}
                          <r.icon
                            className={cn(
                              "mb-3 h-5 w-5",
                              active ? "text-brand-700" : "text-ink-soft",
                            )}
                          />
                          <div className="text-sm font-semibold text-ink">{r.title}</div>
                          <div className="mt-1 text-xs leading-relaxed text-ink-soft">
                            {r.description}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" autoComplete="name" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      placeholder="8+ characters"
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      placeholder="Repeat password"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="animate-spin" />}
            Create account
          </Button>
          <p className="text-center text-xs text-ink-faint">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </Form>

      <p className="mt-8 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link href="/signin" className="font-semibold text-brand-700 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

const SignUpPage = () => (
  <Suspense fallback={null}>
    <SignUpForm />
  </Suspense>
);

export default SignUpPage;
