"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
import Link from "next/link";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState("request");
  const [resetOTP, setResetOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { toast } = useToast();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/reset-password-request", { email });
      setMessage("Password reset OTP have been sent to your email");
      setStep("reset");
    } catch (error) {
      setMessage("Failed to send reset OTP");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/reset-password", {
        email: email,
        OTP: resetOTP,
        newPassword,
      });
      setMessage("Password has been reset successfully");
      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset",
        className: "bg-green-500",
      });

      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
    } catch (error) {
      setMessage("Expired or incorrect OTP. Try again.");
      toast({
        title: "Password Reset Failed",
        description: "Expired or incorrect OTP.",
        className: "bg-red-500",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        </CardHeader>
        <CardContent>
          {step === "request" ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Send OTP
              </Button>
              <p className="text-center text-sm">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline"
                >
                  Login
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter reset OTP from email"
                  value={resetOTP}
                  onChange={(e) => setResetOTP(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            </form>
          )}
          {message && (
            <p className="mt-4 text-center text-sm text-primary">{message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
