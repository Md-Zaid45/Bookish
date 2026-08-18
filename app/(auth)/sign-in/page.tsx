'use client'
import AuthForm from "@/components/authForm";
import { signInSchema } from "@/lib/validations";

const Page = () => {
  return (
    <AuthForm
      type="SIGN_IN"
      schema={signInSchema}
      defaultValues={{ email: "", password: "" }}
      onSubmit={async () => { return { success: true } }}
    />
  );
};
export default Page