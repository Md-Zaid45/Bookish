'use client'
import AuthForm from "@/components/authForm";
import { signUpSchema } from "@/lib/validations";

const Page = () => {
  return (
    <AuthForm
      type="SIGN_UP"
      schema={signUpSchema}
      defaultValues={{
        email: "",
        password: "",
        fullname: "",
        universityId:0,
        universityCard: "",
      }}
      onSubmit={async () => { return { success: true } }}
    />
  );
};

export default Page;
