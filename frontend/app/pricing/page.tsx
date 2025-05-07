"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import { BookingForm } from "@/components/booking-form";

import { motion } from "framer-motion";

const plans = [
  {
    name: "Basic",
    price: "₹ 2",
    description: "Perfect for small schools",
    features: [
      "Up to 500 students",
      "Up to 500 students",
      "Up to 500 students",
      "Up to 500 students",
    ],
  },
  {
    name: "Professional",
    price: "₹ 1099",
    description: "Ideal for growing institutions",
    features: [
      "Up to 2000 students",
      "Up to 2000 students",
      "Up to 2000 students",
      "Up to 2000 students",
    ],
  },
  {
    name: "Enterprise",
    price: "₹ 99999",
    description: "For large institutions",
    features: [
      "Unlimited students",
      "Unlimited students",
      "Unlimited students",
      "Unlimited students",
    ],
  },
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGetStarted = (planName: string) => {
    setSelectedPlan(planName);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Simple Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose the plan that best fits your instittion's needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="p-4 rounded-lg flex items-center justify-between bg-card"
            >
              <Card key={plan.name} className="relative">
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-primary mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-6"
                    onClick={() => handleGetStarted(plan.name)}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <BookingForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planName={selectedPlan || ""}
      />
    </div>
  );
}
