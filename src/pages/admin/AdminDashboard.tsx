import React, { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Package, 
  Calendar, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEquipment: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const equipSnap = await getDocs(collection(db, "equipment"));
        const bookingsSnap = await getDocs(collection(db, "bookings"));

        let revenue = 0;
        bookingsSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.status === "confirmed") {
            revenue += data.totalPrice || 0;
          }
        });

        setStats({
          totalUsers: usersSnap.size,
          totalEquipment: equipSnap.size,
          totalBookings: bookingsSnap.size,
          totalRevenue: revenue,
        });

        // Fetch recent users
        const recentUsersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(5));
        const recentUsersSnap = await getDocs(recentUsersQuery);
        setRecentUsers(recentUsersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = [
    { name: "ორშ", users: 400, bookings: 240 },
    { name: "სამ", users: 300, bookings: 139 },
    { name: "ოთხ", users: 200, bookings: 980 },
    { name: "ხუთ", users: 278, bookings: 390 },
    { name: "პარ", users: 189, bookings: 480 },
    { name: "შაბ", users: 239, bookings: 380 },
    { name: "კვი", users: 349, bookings: 430 },
  ];

  const statCards = [
    { label: "მომხმარებლები", value: stats.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "+12%" },
    { label: "ტექნიკა", value: stats.totalEquipment, icon: Package, color: "text-purple-600", bg: "bg-purple-50", trend: "+5%" },
    { label: "ჯავშნები", value: stats.totalBookings, icon: Calendar, color: "text-orange-600", bg: "bg-orange-50", trend: "+18%" },
    { label: "შემოსავალი", value: `₾${stats.totalRevenue}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+24%" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">ადმინ პანელი</h1>
        <p className="text-muted-foreground">სისტემის მიმოხილვა და სტატისტიკა</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.trend}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              აქტივობა
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="users" fill="#4285F4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="bookings" fill="#FBBC05" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="p-6">
            <CardTitle className="text-xl font-bold">ახალი მომხმარებლები</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-6">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{user.displayName || "მომხმარებელი"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {user.role}
                  </div>
                </div>
              ))}
              {recentUsers.length === 0 && (
                <p className="text-sm text-center text-muted-foreground py-8">მომხმარებლები არ მოიძებნა</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
