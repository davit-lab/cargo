import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { 
  Package, 
  CalendarCheck, 
  TrendingUp, 
  Users,
  Loader2,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface Stats {
  totalServices: number;
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
}

interface Booking {
  id: string;
  equipmentTitle: string;
  userEmail: string;
  bookingDate: string;
  status: string;
  price: number;
}

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        // Fetch services stats
        const servicesQuery = query(collection(db, "equipment"), where("ownerId", "==", user.uid));
        const servicesSnapshot = await getDocs(servicesQuery);
        
        // Fetch bookings stats
        const bookingsQuery = query(collection(db, "bookings"), where("ownerId", "==", user.uid));
        const bookingsSnapshot = await getDocs(bookingsQuery);
        
        let totalRevenue = 0;
        let pendingCount = 0;
        const bookingsData = bookingsSnapshot.docs.map(doc => {
          const data = doc.data();
          if (data.status === "confirmed") totalRevenue += data.price || 0;
          if (data.status === "pending") pendingCount++;
          return { id: doc.id, ...data } as Booking;
        });

        setStats({
          totalServices: servicesSnapshot.size,
          totalBookings: bookingsSnapshot.size,
          pendingBookings: pendingCount,
          totalRevenue: totalRevenue,
        });

        // Get recent bookings
        const recentQuery = query(
          collection(db, "bookings"), 
          where("ownerId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const recentSnapshot = await getDocs(recentQuery);
        setRecentBookings(recentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    {
      title: "სულ სერვისები",
      value: stats.totalServices,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-100",
      trend: "+2 ამ თვეში",
      trendUp: true
    },
    {
      title: "სულ ჯავშნები",
      value: stats.totalBookings,
      icon: CalendarCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      trend: "+12% ზრდა",
      trendUp: true
    },
    {
      title: "მომლოდინე",
      value: stats.pendingBookings,
      icon: Users,
      color: "text-amber-600",
      bg: "bg-amber-100",
      trend: "საჭიროებს ყურადღებას",
      trendUp: false
    },
    {
      title: "შემოსავალი",
      value: `${stats.totalRevenue} ₾`,
      icon: TrendingUp,
      color: "text-violet-600",
      bg: "bg-violet-100",
      trend: "+5% წინა თვესთან",
      trendUp: true
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">მოგესალმებით, {user?.email?.split('@')[0]}</h1>
        <p className="text-muted-foreground">აი რა ხდება თქვენს RentHub ანგარიშზე დღეს</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                {stat.trendUp ? (
                  <div className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {stat.trend}
                  </div>
                ) : (
                  <div className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                    {stat.trend}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-xl font-bold">ბოლო ჯავშნები</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {recentBookings.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                ჯავშნები ჯერ არ არის.
              </div>
            ) : (
              <div className="space-y-6">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {booking.userEmail[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{booking.equipmentTitle}</p>
                        <p className="text-xs text-muted-foreground">{booking.userEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{booking.price} ₾</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(booking.bookingDate), "MMM d, yyyy")}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                      booking.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {booking.status === 'confirmed' ? 'დადასტურებული' : 
                       booking.status === 'pending' ? 'მომლოდინე' : 'გაუქმებული'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-xl font-bold">სწრაფი ქმედებები</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <button className="w-full p-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-between group">
              ახალი სერვისის დამატება
              <Package className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
            <button className="w-full p-4 bg-muted hover:bg-muted/80 rounded-2xl font-bold flex items-center justify-between group">
              ჯავშნების ნახვა
              <CalendarCheck className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
            <button className="w-full p-4 bg-muted hover:bg-muted/80 rounded-2xl font-bold flex items-center justify-between group">
              ანგარიშის პარამეტრები
              <TrendingUp className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnerDashboard;
