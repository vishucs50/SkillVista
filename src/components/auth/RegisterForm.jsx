"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

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

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Registration failed");
      }

      // ✅ Auto login after register
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      router.push("/assessment");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="w-90 bg-zinc-900/80 border-zinc-800 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Join SkillVista and start learning
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NAME */}
            <div className="space-y-1">
              <Label className="text-zinc-300">Name</Label>
              <Input
                placeholder="Your name"
                className="bg-zinc-800 border-zinc-700 text-white focus:border-cyan-400"
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-1">
              <Label className="text-zinc-300">Email</Label>
              <Input
                type="email"
                placeholder="you@skillvista.com"
                className="bg-zinc-800 border-zinc-700 text-white focus:border-cyan-400"
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-1">
              <Label className="text-zinc-300">Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-zinc-800 border-zinc-700 text-white focus:border-cyan-400"
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {/* ERROR */}
            {error && <p className="text-sm text-red-400">{error}</p>}

            {/* SUBMIT */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-cyan-400 to-teal-400 text-black font-semibold"
              >
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </motion.div>
          </form>

          <p className="text-sm text-center text-zinc-400">
            Already have an account?{" "}
            <a href="/login" className="text-cyan-400 hover:underline">
              Login
            </a>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
