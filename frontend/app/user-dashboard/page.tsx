'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import api from '@/lib/axios';
import { Clock, LogOut, CheckCircle2, XCircle } from 'lucide-react';

export default function UserDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/api/users/bookings');
      setBookings(response.data.bookings);
      console.log(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        className: "bg-red-500"
      });
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
      className: "bg-blue-500"
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background p-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <motion.h1
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="text-3xl font-bold"
          >
            My Bookings
          </motion.h1>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Booking History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AnimatePresence>
                {bookings.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-muted-foreground"
                  >
                    No bookings found
                  </motion.p>
                ) : (
                  bookings.map((booking: any) => (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-4 border rounded-lg flex items-center justify-between bg-card"
                    >
                      <div className="space-y-1">
                        <h3 className="font-semibold">{booking.plan}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.createdAt).toLocaleDateString()}
                       </p>  
                        <p className="text-sm text-foreground">
                        {booking.school}
                       </p>  
                        <Badge
                          variant="secondary"
                          className={getStatusBadgeColor(booking.status)}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {booking.status === 'completed' && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                        {booking.status === 'cancelled' && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        {booking.status === 'pending' && (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
