"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { extractErrorMessage } from "@/lib/api-error";
import { ROUTES } from "@/constants/routes";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

interface SignupFormProps {
  onSuccess: () => void;
  onSignup: (values: FormValues) => Promise<void>;
  isLoading: boolean;
  error?: unknown;
}

export function SignupForm({ onSuccess, onSignup, isLoading, error }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await onSignup(values);
    onSuccess();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Create account</h1>

        {Boolean(error) && (
          <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {extractErrorMessage(error)}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <Input
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
            Create account
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href={ROUTES.LOGIN} className="font-medium text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
