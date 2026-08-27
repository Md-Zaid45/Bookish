"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  useForm,
  UseFormReturn,
  SubmitHandler,
  Controller,
} from "react-hook-form";

import { ZodType } from "zod";
import { Button } from "./ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import Link from "next/link";
import ImageUpload from "./imageUpload";
import { toast } from "./ui/toast";
import { useRouter } from "next/navigation";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const form: UseFormReturn<T> = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const router = useRouter()
  const isSignIn = type === "SIGN_IN";

  const handleSubmit: SubmitHandler<T> = async (data: T) => {
    const result = await onSubmit(data);
    if(result?.success){
      toast.add({title:'Success', description: isSignIn?'You have succcessfully signed in':'You have succcessfully signed up'})
          router.push('/')

    }
    else{
      toast.add({
        title:`Error ${isSignIn? "signing in": "signing up"}`,
        description:`${result.error}`,
      })
    }
  };


  return (
    <div className=" flex flex-col gap-4 max-w-90 ">
      <h1 className="font-semibold text-white text-2xl">
        {isSignIn ? "Welcome Back to Bookish" : "Create an account"}
      </h1>
      <h3 className="font-semibold">
        {isSignIn
          ? "Sign In to avail the various services by Bookish"
          : "Enter following details allong with Id card to register in Bookish"}
      </h3>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 w-full"
      >
        <FieldGroup>
          {(Object.keys(defaultValues) as Array<Path<T>>).map((val) => (
            <Controller
              key={val}
              name={val}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={val} className="font-light">
                    {FIELD_NAMES[val as keyof typeof FIELD_NAMES]}
                  </FieldLabel>

                  {val != "universityCard" ? (
                    <Input
                      className="form-input"
                      required
                      type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                      {...field}
                      id={val}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                  ) : (
                    <>{!isSignIn && <ImageUpload onFileUplload={field.onChange} type="file" variant="dark" accept="image/*"  />}</>
                  )}
                  {fieldState.invalid && (
                    <FieldError
                      className="font-semibold text-xs "
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />
          ))}
        </FieldGroup>

        <Button
          type="submit"
          className="auth-button mt-6 w-27"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? "Please wait..."
            : isSignIn
              ? "Sign In"
              : "Sign Up"}
        </Button>
        <div className="flex justify-center gap-2">
          {isSignIn ? (
            <>
              <p>Don't have an Account ?</p>
              <Link className="text-blue-100" href="/sign-up">
                {" "}
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {" "}
              <p>Already have an Account ?</p>
              <Link className="text-blue-100" href="/sign-in">
                {" "}
                Sign In
              </Link>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
