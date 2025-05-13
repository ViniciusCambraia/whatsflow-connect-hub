
import React from "react";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
