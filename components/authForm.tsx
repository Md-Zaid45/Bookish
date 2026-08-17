'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import {
  DefaultValues,
  FieldValues,
  Path,
  useForm,
  UseFormReturn,
  SubmitHandler,
} from "react-hook-form";
import { ZodType } from 'zod'
import { Button } from "./ui/button";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({ type, schema, defaultValues, onSubmit }: Props<T>) => {
  const form: UseFormReturn<T> = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  })

  const handleSubmit: SubmitHandler<T> = async (data: T) => {
    await onSubmit(data);
  }

  const isSignIn = type === "SIGN_IN";

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="auth-form">
      <div className="flex flex-col gap-4">
        {!isSignIn && (
          <>
            <label htmlFor="fullname" className="text-sm font-medium text-dark-300">
              Full Name
            </label>
            <input
              id="fullname"
              type="text"
              placeholder="Enter your full name"
              {...form.register("fullname" as Path<T>)}
              className="auth-input"
            />
          </>
        )}

        <label htmlFor="email" className="text-sm font-medium text-dark-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...form.register("email" as Path<T>)}
          className="auth-input"
        />

        <label htmlFor="password" className="text-sm font-medium text-dark-300">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...form.register("password" as Path<T>)}
          className="auth-input"
        />

        {!isSignIn && (
          <>
            <label htmlFor="universityId" className="text-sm font-medium text-dark-300">
              University ID
            </label>
            <input
              id="universityId"
              type="number"
              placeholder="Enter your university ID"
              {...form.register("universityId" as Path<T>)}
              className="auth-input"
            />

            <label htmlFor="universityCard" className="text-sm font-medium text-dark-300">
              University Card
            </label>
            <input
              id="universityCard"
              type="text"
              placeholder="Enter your university card"
              {...form.register("universityCard" as Path<T>)}
              className="auth-input"
            />
          </>
        )}
      </div>

      <Button
        type="submit"
        className="auth-button mt-6"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting
          ? "Please wait..."
          : isSignIn
            ? "Sign In"
            : "Sign Up"}
      </Button>
    </form>
  )
}

export default AuthForm
