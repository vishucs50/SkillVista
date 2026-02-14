"use client";

import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const LoginForm = () => {
  const router = useRouter();
  const { status } = useSession(); // kept only for loading state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /* ---------- CREDENTIALS LOGIN ---------- */
  const onSubmit = async ({ email, password }) => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Invalid email or password");
      return;
    }

    toast.success("Welcome to SkillVista!");
    router.push("/dashboard");
  };

  if (status === "loading") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="w-90 bg-zinc-900/80 border-zinc-800 backdrop-blur-xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Login to continue your SkillVista journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* ---------- GOOGLE LOGIN ---------- */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              className="w-full bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 flex items-center justify-center gap-3"
              onClick={() =>
                signIn("google", {
                  callbackUrl: "/auth/redirect",
                })
              }
            >
              <FcGoogle className="h-5 w-5" />
              <span>Continue with Google</span>
            </Button>
          </motion.div>

          <Separator className="bg-zinc-700" />

          {/* ---------- FORM ---------- */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label className="text-zinc-300 mb-2">Email</Label>
              <Input
                className="bg-zinc-800 border-zinc-700 text-white focus:border-cyan-400"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label className="text-zinc-300 mb-2">Password</Label>
              <Input
                type="password"
                className="bg-zinc-800 border-zinc-700 text-white focus:border-cyan-400"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button className="w-full bg-linear-to-r from-cyan-400 to-teal-400 text-black font-semibold">
                Login
              </Button>
            </motion.div>
          </form>

          <p className="text-sm text-center text-zinc-400">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-cyan-400 hover:underline">
              Sign up
            </a>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LoginForm;
