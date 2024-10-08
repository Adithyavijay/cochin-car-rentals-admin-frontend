'use client '
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { gql, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';

type FormData = {
  email: string;
  password: string;
};

const ADMIN_LOGIN = gql`
  mutation AdminLogin($email: String!, $password: String!) {
    adminLogin(email: $email, password: $password)
  }
`;

const AdminLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [adminLogin] = useMutation(ADMIN_LOGIN);

  const onSubmit = async (data: FormData) => {
    try {
      const result = await adminLogin({
        variables: { email: data.email, password: data.password },
      });
      console.log('Login successful:', result.data.adminLogin);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -1 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: 0.2
      }
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { type: 'spring', stiffness: 300 } }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { type: 'spring', stiffness: 400 } },
    tap: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-700">
      <motion.div 
        className="max-w-md w-full space-y-8 bg-black bg-opacity-50 p-10 rounded-xl backdrop-filter backdrop-blur-lg shadow-2xl border border-gray-800"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <motion.h2 
            className="mt-6 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600"
            animate={{ opacity: [0, 1], y: [-20, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Admin Dashboard
          </motion.h2>
          <motion.p 
            className="mt-2 text-lg font-semibold text-gray-300"
            animate={{ opacity: [0, 1], y: [-20, 0] }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Access your dashboard
          </motion.p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <motion.input
                id="email-address"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm transition duration-300 ease-in-out"
                placeholder="Email address"
                variants={inputVariants}
                whileFocus="focus"
                {...register("email", { 
                  required: "Email is required", 
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
            </div>
            <div className="relative">
              <motion.input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm transition duration-300 ease-in-out pr-10"
                placeholder="Password"
                variants={inputVariants}
                whileFocus="focus"
                {...register("password", { 
                  required: "Password is required", 
                  minLength: {
                    value: 5,
                    message: "Password must be at least 5 characters long"
                  }
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-800"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-purple-400 hover:text-purple-300">
                Forgot your password?
              </a>
            </div>
          </div>

          <motion.button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <LogIn className="h-5 w-5 text-purple-500 group-hover:text-purple-400" />
            </span>
            Sign in
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;