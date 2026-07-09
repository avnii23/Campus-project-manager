import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).catch("signin"),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — CampusPM" },
      { name: "description", content: "Sign in or create your CampusPM workspace." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

function AuthPage() {
  const { mode, redirect: redirectTo } = Route.useSearch();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">(mode);

  const goNext = () => {
    // Redirect to the intended destination or the dashboard.
    if (redirectTo && redirectTo.startsWith("/")) {
      window.location.href = redirectTo;
    } else {
      navigate({ to: "/app" });
    }
  };

  return (
    <AuthShell
      title={tab === "signup" ? "Create your account" : "Welcome back"}
      subtitle={
        tab === "signup"
          ? "Start shipping better academic projects with your team."
          : "Sign in to your CampusPM workspace."
      }
    >
      <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign in</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin" className="mt-6">
          <SignInForm onSuccess={goNext} />
        </TabsContent>
        <TabsContent value="signup" className="mt-6">
          <SignUpForm onSuccess={() => setTab("signin")} />
        </TabsContent>
      </Tabs>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        or continue with
        <div className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton onSuccess={goNext} />

      <p className="mt-6 text-center text-xs text-muted-foreground">
        By continuing, you agree to CampusPM's{" "}
        <Link to="/" className="text-foreground underline-offset-4 hover:underline">
          Terms
        </Link>{" "}
        &{" "}
        <Link to="/" className="text-foreground underline-offset-4 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthShell>
  );
}

function SignInForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: SignInValues) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(values);
    setLoading(false);
    if (error) {
      toast.error("Sign in failed", { description: error.message });
      return;
    }
    toast.success("Welcome back");
    onSuccess();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <FormField
        label="Email"
        icon={<Mail className="h-4 w-4" />}
        error={form.formState.errors.email?.message}
      >
        <Input
          type="email"
          placeholder="you@university.edu"
          autoComplete="email"
          {...form.register("email")}
        />
      </FormField>
      <FormField
        label="Password"
        icon={<Lock className="h-4 w-4" />}
        error={form.formState.errors.password?.message}
        right={
          <Link
            to="/forgot-password"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Forgot password?
          </Link>
        }
      >
        <Input
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          {...form.register("password")}
        />
      </FormField>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Sign in
        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </motion.form>
  );
}

function SignUpForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const onSubmit = async (values: SignUpValues) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/verify-email`,
        data: { full_name: values.fullName },
      },
    });
    setLoading(false);
    if (error) {
      toast.error("Sign up failed", { description: error.message });
      return;
    }
    setSent(true);
    toast.success("Check your email", {
      description: "We sent you a verification link.",
    });
    setTimeout(onSuccess, 1500);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-border bg-surface/60 p-6 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full gradient-primary shadow-glow">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <p className="mt-4 font-semibold">Check your inbox</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Click the verification link we just sent to activate your workspace.
        </p>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <FormField
        label="Full name"
        icon={<User className="h-4 w-4" />}
        error={form.formState.errors.fullName?.message}
      >
        <Input placeholder="Ada Lovelace" autoComplete="name" {...form.register("fullName")} />
      </FormField>
      <FormField
        label="Email"
        icon={<Mail className="h-4 w-4" />}
        error={form.formState.errors.email?.message}
      >
        <Input
          type="email"
          placeholder="you@university.edu"
          autoComplete="email"
          {...form.register("email")}
        />
      </FormField>
      <FormField
        label="Password"
        icon={<Lock className="h-4 w-4" />}
        error={form.formState.errors.password?.message}
      >
        <Input
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          {...form.register("password")}
        />
      </FormField>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Create account
        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </motion.form>
  );
}

function FormField({
  label,
  icon,
  right,
  error,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5 text-xs font-medium">
          {icon}
          {label}
        </Label>
        {right}
      </div>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
