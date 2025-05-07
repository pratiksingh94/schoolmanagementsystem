"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import api from "@/lib/axios";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("/api/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
        className: "bg-green-500",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials",
        className: "bg-red-500",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[400px]">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center">Login</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-between items-center text-sm">
                <Link
                  href="/auth/reset-password"
                  className="text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size={20} /> : "Login"}
              </Button>
              <p className="text-center text-sm">
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary hover:underline"
                >
                  Register
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
