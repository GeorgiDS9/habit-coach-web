"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { extractErrorMessage } from "@/lib/api-error";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(300, "Description is too long").optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateHabitFormProps {
  onCreate: (values: FormValues) => Promise<void>;
  isLoading: boolean;
  error?: unknown;
}

export function CreateHabitForm({ onCreate, isLoading, error }: CreateHabitFormProps) {
  const [expanded, setExpanded] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await onCreate(values);
    reset();
    setExpanded(false);
  };

  if (!expanded) {
    return (
      <Button variant="primary" onClick={() => setExpanded(true)}>
        + New habit
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Create habit form"
      className="rounded-xl border border-indigo-100 bg-indigo-50 p-4"
    >
      <h2 className="mb-3 text-sm font-semibold text-indigo-800">New habit</h2>

      {Boolean(error) && (
        <p role="alert" className="mb-3 rounded bg-red-50 px-3 py-2 text-xs text-red-700">
          {extractErrorMessage(error)}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <Input
          id="habit-title"
          label="Title"
          placeholder="e.g. Morning run"
          error={errors.title?.message}
          {...register("title")}
        />
        <Input
          id="habit-description"
          label="Description (optional)"
          placeholder="e.g. Run at least 20 minutes"
          error={errors.description?.message}
          {...register("description")}
        />
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => { reset(); setExpanded(false); }}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isLoading}>
            Create
          </Button>
        </div>
      </div>
    </form>
  );
}
