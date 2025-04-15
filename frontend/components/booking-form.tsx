"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import api from "@/lib/axios";

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
}

export function BookingForm({ isOpen, onClose, planName }: BookingFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    schoolName: "",
    address: "",
  });

  const [bookingID, setBookingID] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //setIsLoading(true)
    try {
      const res = await api.post("/api/bookings", {
        ...formData,
        plan: planName,
        status: "pending",
      });
      setBookingID(res.data._id);
      // console.log(res.data._id)

      // alert('Booking submitted successfully!');
      handlePayment(res.data._id);
      onClose();

      setFormData({
        name: "",
        email: "",
        phone: "",
        schoolName: "",
        address: "",
      });
    } catch (error) {
      console.error("failed to submit booking:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error submitting your booking",
        variant: "destructive",
      });
    } finally {
      //setIsLoading(false)
    }
  };

  // todo, not loading
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const handlePayment = async (id) => {
    const res = await loadRazorpayScript();

    if (!res) {
      toast({
        title: "Payment Error",
        description: "Payment gateway failed to load, Check your connection.",
        variant: "destructive",
      });
      return;
    }

    const orderData = await fetch(
      "http://localhost:5000/payments/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 2,
          currency: "INR",
          receipt: "receipt#1",
          notes: {
            bookingId: id,
          },
        }),
      },
    ).then((res) => res.json());

    const options = {
      key: process.env.RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "School",
      description: "test Transaction",
      order_id: orderData.id,
      handler: async (response: any) => {
        setIsLoading(true);

        const verifyRes = await fetch(
          "http://localhost:5000/payments/verify-payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(response),
          },
        ).then((res) => res.json());

        if (verifyRes.status === "success") {
          toast({
            title: "Payment Successful",
            description: "Your booking has been created successfully",
            className: "bg-green-500"
          });

          setFormData({
            name: "",
            email: "",
            phone: "",
            schoolName: "",
            address: "",
          });
          onClose();
        } else {
          console.log(453454864534845448785485453)
          toast({
            title: "Verification Failed",
            description: "Payment could not be verified. Booking canceled.",
            variant: "destructive",
          });
          await api.delete(`/api/bookings/${bookingID}`);
        }
        setIsLoading(false);
      },
      modal: {
      ondismiss: async () => {
        toast({
          title: "Payment Cancelled",
          description: "Payment was cancelled. Booking will be removedd.",
          variant: "destructive",
        });

        await api.delete(`/api/bookings/${id}`);
    },
  },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        address: formData.address,
      },
      theme: {
        color: "#008584",
      },
    };

    // console.log(process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET)

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book a Demo - {planName} Plan</DialogTitle>
          <DialogDescription>
            Fill out the form below and our team will get in touch with you
            shortly.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="School Name"
              value={formData.schoolName}
              onChange={(e) =>
                setFormData({ ...formData, schoolName: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Address (Optional)"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Processing...
                </>
              ) : (
                "Pay now"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
