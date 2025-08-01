import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import {
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
  useForm,
} from 'react-hook-form';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface SmartFormProps<T extends FieldValues = FieldValues> {
  schema: z.ZodSchema<T>;
  mutationFn: (data: T) => Promise<any>;
  queryKey?: string[];
  mode?: 'create' | 'edit';
  defaultValues?: Partial<T>;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  submitText?: string;
  className?: string;
  children: (form: UseFormReturn<T>) => React.ReactNode;
}

export interface SmartFormFieldProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'color';
  label?: string;
  placeholder?: string;
  description?: string;
  options?: FormFieldOption[];
  disabled?: boolean;
  className?: string;
}

export interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SmartForm<T extends FieldValues>({
  schema,
  mutationFn,
  queryKey = [],
  mode = 'create',
  defaultValues,
  onSuccess,
  onError,
  submitText,
  className,
  children,
}: SmartFormProps<T>) {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as any,
  });

  const mutation = useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (queryKey.length > 0) {
        queryClient.invalidateQueries({ queryKey });
      }
      form.reset();
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error instanceof Error ? error : new Error('Unknown error'));
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit((data) => {
      mutation.mutate(data as T);
    })();
  };

  return (
    <Card className={cn('w-full', className)}>
      <Form {...(form as any)}>
        <form onSubmit={onSubmit}>
          <CardContent className="p-6">
            <div className="space-y-6">{children(form)}</div>

            <div className="mt-6 flex items-center justify-end border-t pt-6">
              <Button
                className="min-w-32"
                disabled={mutation.isPending}
                type="submit"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    {mutation.isSuccess ? (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    ) : mutation.isError ? (
                      <AlertCircle className="mr-2 h-4 w-4" />
                    ) : null}
                    {submitText || (mode === 'create' ? 'Create' : 'Update')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}

export function SmartFormField<T extends FieldValues>({
  form,
  name,
  type,
  label,
  placeholder,
  description,
  options = [],
  disabled,
  className,
}: SmartFormFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const renderField = (field: any) => {
    switch (type) {
      case 'text':
      case 'email':
        return (
          <Input
            disabled={disabled}
            placeholder={placeholder}
            type={type}
            {...field}
            value={field.value || ''}
          />
        );
      case 'password':
        return (
          <div className="relative">
            <Input
              className="pr-10"
              disabled={disabled}
              placeholder={placeholder}
              type={showPassword ? 'text' : 'password'}
              {...field}
              value={field.value || ''}
            />
            <button
              className="-translate-y-1/2 absolute top-1/2 right-2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              type="button" // Prevent button from being focused when tabbing through form
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? 'Hide password' : 'Show password'}
              </span>
            </button>
          </div>
        );

      case 'number':
        return (
          <Input
            disabled={disabled}
            placeholder={placeholder}
            type="number"
            {...field}
            onChange={(e) => {
              const value = e.target.value;
              field.onChange(value === '' ? undefined : Number(value));
            }}
            value={field.value || ''}
          />
        );

      case 'textarea':
        return (
          <Textarea
            disabled={disabled}
            placeholder={placeholder}
            rows={3}
            {...field}
            value={field.value || ''}
          />
        );

      case 'select':
        return (
          <Select
            defaultValue={field.value}
            disabled={disabled}
            onValueChange={field.onChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={placeholder || `Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={field.value}
              disabled={disabled}
              onCheckedChange={field.onChange}
            />
            <label className="font-normal text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
            </label>
          </div>
        );

      case 'radio':
        return (
          <RadioGroup
            defaultValue={field.value}
            disabled={disabled}
            onValueChange={field.onChange}
          >
            {options.map((option) => (
              <div className="flex items-center space-x-2" key={option.value}>
                <RadioGroupItem
                  id={`${name}-${option.value}`}
                  value={option.value}
                />
                <label
                  className="cursor-pointer font-normal text-sm"
                  htmlFor={`${name}-${option.value}`}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'color':
        return (
          <div className="flex items-center space-x-2">
            <Input
              className="h-10 w-12 rounded border p-1"
              disabled={disabled}
              onChange={(e) => field.onChange(e.target.value)}
              type="color"
              value={field.value || '#000000'}
            />
            <Input
              className="flex-1"
              disabled={disabled}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder="#000000"
              type="text"
              value={field.value || ''}
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (type === 'checkbox') {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className={cn('space-y-2', className)}>
            <FormControl>{renderField(field)}</FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>{renderField(field)}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-1">
        <h3 className="font-medium text-lg">{title}</h3>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function ConditionalField<T extends FieldValues>({
  form,
  when,
  equals,
  children,
}: {
  form: UseFormReturn<T>;
  when: FieldPath<T>;
  equals: any;
  children: React.ReactNode;
}) {
  const watchedValue = form.watch(when);

  if (watchedValue === equals) {
    return <>{children}</>;
  }

  return null;
}
