"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { Users, BookOpen, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function Dashboard() {
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
        (booking: any) => booking.status === "pending"
      ).length;
      const completed = response.data.filter(
        (booking: any) => booking.status === "completed"
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

  const handleMarkAsDone = async (bookingId: string) => {
    try {
      await api.put(`/api/bookings/${bookingId}`, { status: "completed" });
      fetchBookings(); // refresh data
    } catch (error) {
      console.error("failed to update booking:", error);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const pendingBookings = bookings.filter(
    (booking: any) => booking.status === "pending"
  );
  const previousBookings = bookings.filter(
    (booking: any) => booking.status !== "pending"
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

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

      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingBookings.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Pending Bookings</h3>
              <div className="space-y-4">
                {pendingBookings.map((booking: any) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                    className="p-4 border rounded-lg flex items-center justify-between bg-card"
                  >
                    <div className="space-y-1">
                      <h3 className="font-semibold">{booking.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking?.phone}
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
                      {booking.status === "pending" && (
                        <Button
                          onClick={() => handleMarkAsDone(booking._id)}
                          variant="outline"
                          className="bg-green-500 text-white hover:bg-green-600"
                        >
                          Mark as Done
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {previousBookings.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">
                Previous Bookings
              </h3>
              <div className="space-y-4">
                {previousBookings.map((booking: any) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                    className="p-4 border rounded-lg flex items-center justify-between bg-card"
                  >
                    <div className="space-y-1">
                      <h3 className="font-semibold">{booking.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking?.phone}
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
                      {booking.status === "pending" && (
                        <Button
                          onClick={() => handleMarkAsDone(booking._id)}
                          variant="outline"
                          className="bg-green-500 text-white hover:bg-green-600"
                        >
                          Mark as Done
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
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
