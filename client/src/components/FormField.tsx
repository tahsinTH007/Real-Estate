"use client";

import { Check } from "lucide-react";
import { registerPlugin } from "filepond";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { ControllerRenderProps, FieldValues, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export interface CustomFormFieldProps {
  name: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "tel"
    | "textarea"
    | "number"
    | "select"
    | "switch"
    | "password"
    | "file"
    | "multi-select";
  placeholder?: string;
  description?: string;
  options?: { value: string; label: string; icon?: React.ElementType }[];
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  prefix?: string;
  step?: number | string;
  min?: number;
  max?: number;
}

export const CustomFormField = ({
  name,
  label,
  type = "text",
  placeholder,
  description,
  options,
  className,
  inputClassName,
  disabled = false,
  prefix,
  step,
  min,
  max,
}: CustomFormFieldProps) => {
  const { control } = useFormContext();

  const renderControl = (field: ControllerRenderProps<FieldValues, string>) => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            placeholder={placeholder}
            rows={4}
            disabled={disabled}
            className={inputClassName}
            {...field}
          />
        );

      case "select":
        return (
          <Select
            value={field.value ?? ""}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger className={inputClassName}>
              <SelectValue placeholder={placeholder ?? "Select…"} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="flex items-center gap-2">
                    {option.icon && <option.icon className="h-4 w-4 text-ink-soft" />}
                    {option.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "multi-select": {
        const selected: string[] = Array.isArray(field.value) ? field.value : [];
        const toggle = (value: string) =>
          field.onChange(
            selected.includes(value)
              ? selected.filter((v) => v !== value)
              : [...selected, value],
          );
        return (
          <div className="flex flex-wrap gap-2">
            {options?.map((option) => {
              const active = selected.includes(option.value);
              return (
                <button
                  type="button"
                  key={option.value}
                  disabled={disabled}
                  onClick={() => toggle(option.value)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                    active
                      ? "border-brand-600 bg-brand-50 text-brand-800"
                      : "border-sand-200 bg-white text-ink-muted hover:border-sand-300 hover:bg-sand-50",
                  )}
                >
                  {active ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  ) : (
                    option.icon && <option.icon className="h-3.5 w-3.5" />
                  )}
                  {option.label}
                </button>
              );
            })}
          </div>
        );
      }

      case "switch":
        return (
          <div className="flex items-center justify-between rounded-xl border border-sand-200 bg-white px-4 py-3">
            <FormLabel htmlFor={name} className="cursor-pointer font-medium">
              {label}
            </FormLabel>
            <Switch
              id={name}
              checked={!!field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </div>
        );

      case "file":
        return (
          <FilePond
            className={inputClassName}
            onupdatefiles={(fileItems) =>
              field.onChange(fileItems.map((item) => item.file as File))
            }
            allowMultiple
            maxFiles={8}
            acceptedFileTypes={["image/*"]}
            labelIdle='Drag & drop photos or <span class="filepond--label-action">browse</span>'
            credits={false}
          />
        );

      case "number":
        return (
          <div className="relative">
            {prefix && (
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-faint">
                {prefix}
              </span>
            )}
            <Input
              type="number"
              inputMode="decimal"
              placeholder={placeholder}
              disabled={disabled}
              step={step}
              min={min}
              max={max}
              className={cn(prefix && "pl-8", inputClassName)}
              {...field}
              value={field.value ?? ""}
            />
          </div>
        );

      default:
        return (
          <Input
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClassName}
            {...field}
            value={field.value ?? ""}
          />
        );
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {type !== "switch" && <FormLabel>{label}</FormLabel>}
          <FormControl>{renderControl(field)}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
