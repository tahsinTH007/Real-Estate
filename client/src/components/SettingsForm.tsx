"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, ShieldCheck } from "lucide-react";
import { CustomFormField } from "@/components/FormField";
import Header from "@/components/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { IS_MOCK } from "@/lib/config";
import { settingsSchema, type SettingsFormData } from "@/lib/schemas";
import { initials } from "@/lib/utils";

interface SettingsFormProps {
  initialData: SettingsFormData;
  onSubmit: (data: SettingsFormData) => Promise<void>;
  userType: "manager" | "tenant";
}

const SettingsForm = ({ initialData, onSubmit, userType }: SettingsFormProps) => {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  const cancel = () => {
    form.reset(initialData);
    setEditMode(false);
  };

  const handleSubmit = async (data: SettingsFormData) => {
    setSaving(true);
    try {
      await onSubmit(data);
      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Header
        title="Settings"
        subtitle="Manage your profile and how people can reach you."
      />

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Profile summary */}
        <aside className="surface h-fit p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">{initials(initialData.name)}</AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-lg font-semibold text-ink">{initialData.name}</h2>
            <p className="text-sm text-ink-soft">{initialData.email}</p>
            <Badge variant="secondary" className="mt-3 capitalize">
              {userType}
            </Badge>
          </div>
          <div className="mt-6 rounded-xl bg-brand-50 p-4 text-xs leading-relaxed text-brand-900">
            <ShieldCheck className="mb-1.5 h-4 w-4 text-brand-700" />
            {IS_MOCK
              ? "You're using the demo. Changes are saved in this browser only."
              : "Your contact details are only shared with people you apply to or rent from."}
          </div>
        </aside>

        {/* Form */}
        <section className="surface p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-ink">Personal information</h2>
              <p className="text-sm text-ink-soft">
                Keep your name and contact details up to date.
              </p>
            </div>
            {!editMode && (
              <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                <Pencil /> Edit
              </Button>
            )}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              <CustomFormField name="name" label="Full name" disabled={!editMode} />
              <div className="grid gap-5 sm:grid-cols-2">
                <CustomFormField name="email" label="Email" type="email" disabled={!editMode} />
                <CustomFormField
                  name="phoneNumber"
                  label="Phone number"
                  type="tel"
                  placeholder="(555) 555-0100"
                  disabled={!editMode}
                />
              </div>

              {editMode && (
                <div className="flex justify-end gap-2 border-t border-sand-200 pt-5">
                  <Button type="button" variant="ghost" onClick={cancel} disabled={saving}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="animate-spin" />}
                    Save changes
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </section>
      </div>
    </div>
  );
};

export default SettingsForm;
