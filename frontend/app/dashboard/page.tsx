"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { Users, BookOpen, Clock, LogOut, Trash2, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion"

export default function Dashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
  });

  const fetchBookings = async () => {
    try {
      const response = await api.get("/api/bookings");
      setBookings(response.data);

      const total = response.data.length;
      const pending = response.data.filter(
        (booking: any) => booking.status === "pending",
      ).length;
      const completed = response.data.filter(
        (booking: any) => booking.status === "completed",
      ).length;

      setStats({
        totalBookings: total,
        pendingBookings: pending,
        completedBookings: completed,
      });
    } catch (error) {
      console.error("failed to fetch bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const handleMarkAsDone = async (bookingId: string) => {
    try {
      await api.put(`/api/bookings/${bookingId}`, { status: "completed" });
      await api.post(`/api/bookings/${bookingId}/notify`, {
        type: "completion",
      });
      fetchBookings();
    } catch (error) {
      console.error("failed to update booking:", error);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await api.delete(`/api/bookings/${bookingId}`);
        fetchBookings();
      } catch (error) {
        console.error("failed to delete booking:", error);
      }
    }
  };

  const handleNotifyCustomer = async (bookingId: string) => {
    try {
      await api.post(`/api/bookings/${bookingId}/notify`, {
        type: "update",
      });
      alert("Customer has been notified");
    } catch (error) {
      console.error("failed to notify customer:", error);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
    }
  };

  const pendingBookings = bookings.filter(
    (booking: any) => booking.status === "pending",
  );
  const completedBookings = bookings.filter(
    (booking: any) => booking.status === "completed",
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<BookOpen className="h-6 w-6" />}
        />
        <StatCard
          title="Pending Bookings"
          value={stats.pendingBookings}
          icon={<Clock className="h-6 w-6" />}
        />
        <StatCard
          title="Completed Bookings"
          value={stats.completedBookings}
          icon={<Users className="h-6 w-6" />}
        />
      </div>

      {/* Pending Bookings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingBookings.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No pending bookings
              </p>
            ) : (
              pendingBookings.map((booking: any) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                    className="p-4 border rounded-lg flex items-center justify-between bg-card"
                  >
                  {/*<div
                  key={booking._id}
                  className="p-4 border rounded-lg flex items-center justify-between bg-card"
                >*/}
                  <div className="space-y-1">
                    <h3 className="font-semibold">{booking.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {booking.email}
                    </p>
                    {booking.schoolName && (
                      <p className="text-sm text-muted-foreground">
                        School: {booking.schoolName}
                      </p>
                    )}
                    <Badge
                      variant="secondary"
                      className={getStatusBadgeColor(booking.status)}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleNotifyCustomer(booking._id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Mail className="h-4 w-4" />
                      Notify
                    </Button>
                    <Button
                      onClick={() => handleMarkAsDone(booking._id)}
                      variant="outline"
                      size="sm"
                      className="bg-green-500 text-white hover:bg-green-600"
                    >
                      Mark as Done
                    </Button>
                    <Button
                      onClick={() => handleDeleteBooking(booking._id)}
                      variant="outline"
                      size="sm"
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {/*</div>*/}
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Previous Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Previous Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedBookings.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No completed bookings
              </p>
            ) : (
              completedBookings.map((booking: any) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                    className="p-4 border rounded-lg flex items-center justify-between bg-card"
                  >
                  {/*<div
                  key={booking._id}
                  className="p-4 border rounded-lg flex items-center justify-between bg-card"
                >*/}
                  <div className="space-y-1">
                    <h3 className="font-semibold">{booking.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {booking.email}
                    </p>
                    {booking.schoolName && (
                      <p className="text-sm text-muted-foreground">
                        School: {booking.schoolName}
                      </p>
                    )}
                    <Badge
                      variant="secondary"
                      className={getStatusBadgeColor(booking.status)}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleNotifyCustomer(booking._id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Mail className="h-4 w-4" />
                      Notify
                    </Button>

                    <Button
                      onClick={() => handleDeleteBooking(booking._id)}
                      variant="outline"
                      size="sm"
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className="p-2 bg-primary/10 rounded-lg mr-4">{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
