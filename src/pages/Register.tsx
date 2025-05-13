
import React from "react";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
