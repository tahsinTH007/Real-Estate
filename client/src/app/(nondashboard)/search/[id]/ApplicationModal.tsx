"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { CustomFormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { applicationSchema, type ApplicationFormData } from "@/lib/schemas";
import { formatCurrency } from "@/lib/utils";
import { useCreateApplicationMutation, useGetAuthUserQuery } from "@/state/api";
import type { Property } from "@/types/models";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

const ApplicationModal = ({ isOpen, onClose, property }: ApplicationModalProps) => {
  const [createApplication] = useCreateApplicationMutation();
  const { data: authUser } = useGetAuthUserQuery();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { name: "", email: "", phoneNumber: "", message: "" },
  });

  // Pre-fill from the signed-in profile.
  useEffect(() => {
    if (!authUser) return;
    form.reset({
      name: authUser.userInfo.name ?? "",
      email: authUser.userInfo.email ?? "",
      phoneNumber: authUser.userInfo.phoneNumber ?? "",
      message: "",
    });
  }, [authUser, form]);

  const onSubmit = async (data: ApplicationFormData) => {
    if (!authUser || authUser.userRole !== "tenant") return;
    setSubmitting(true);
    try {
      await createApplication({
        ...data,
        applicationDate: new Date().toISOString(),
        status: "Pending",
        propertyId: property.id,
        tenantCognitoId: authUser.cognitoInfo.userId,
      }).unwrap();
      onClose();
    } catch {
      /* toast handled in api layer */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Apply for {property.name}</DialogTitle>
          <DialogDescription>
            {formatCurrency(property.pricePerMonth)}/month · The manager will review your
            application and get back to you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-4">
            <CustomFormField name="name" label="Full name" placeholder="Your full name" />
            <div className="grid gap-4 sm:grid-cols-2">
              <CustomFormField name="email" label="Email" type="email" placeholder="you@example.com" />
              <CustomFormField
                name="phoneNumber"
                label="Phone number"
                type="tel"
                placeholder="(555) 555-0100"
              />
            </div>
            <CustomFormField
              name="message"
              label="Message to the manager (optional)"
              type="textarea"
              placeholder="Tell them a little about yourself, your move-in date, pets…"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="animate-spin" />}
                Submit application
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
