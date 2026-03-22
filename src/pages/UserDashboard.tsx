import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase";
import { collection, query, where, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ChevronRight,
  Package
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const bookingsData = await Promise.all(querySnapshot.docs.map(async (bookingDoc) => {
          const booking = { id: bookingDoc.id, ...bookingDoc.data() } as any;
          // Fetch equipment details for each booking
          const equipDoc = await getDoc(doc(db, "equipment", booking.equipmentId));
          return {
            ...booking,
            equipment: equipDoc.exists() ? equipDoc.data() : null
          };
        }));
        setBookings(bookingsData);
      } catch (error) {
        console.error("Error fetching user bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider">
            <CheckCircle2 className="h-3 w-3" />
            დადასტურებული
          </div>
        );
      case "cancelled":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase tracking-wider">
            <XCircle className="h-3 w-3" />
            გაუქმებული
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-wider">
            <AlertCircle className="h-3 w-3" />
            მოდერაციაშია
          </div>
        );
    }
  };

  return (
    <div className="py-24 bg-background min-h-screen relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[140px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] -z-10" />

      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10 shadow-sm"
            >
              <Calendar className="h-3.5 w-3.5" />
              მართვის პანელი
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] font-display">
              გამარჯობა, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">{user?.displayName?.split(' ')[0] || "მომხმარებელო"}</span>
            </h1>
            <p className="text-muted-foreground text-xl md:text-2xl font-medium leading-relaxed max-w-md">
              თქვენი ჯავშნების ისტორია და სტატუსი ერთ სივრცეში.
            </p>
          </div>
          <Button asChild size="lg" className="rounded-full px-10 h-16 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
            <Link to="/heavy-equipment">
              <Package className="mr-3 h-5 w-5" /> ახალი ჯავშანი
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {[
            { label: 'სულ ჯავშნები', value: bookings.length, icon: Calendar, color: 'primary' },
            { label: 'დადასტურებული', value: bookings.filter(b => b.status === "confirmed").length, icon: CheckCircle2, color: 'emerald' },
            { label: 'მოლოდინში', value: bookings.filter(b => b.status === "pending").length, icon: Clock, color: 'orange' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[3rem] overflow-hidden bg-card/50 backdrop-blur-sm group">
                <CardContent className="p-10 flex items-center gap-8">
                  <div className={cn(
                    "h-20 w-20 rounded-[2rem] flex items-center justify-center transition-all group-hover:scale-110",
                    stat.color === 'primary' ? "bg-primary/10 text-primary" : 
                    stat.color === 'emerald' ? "bg-emerald-500/10 text-emerald-500" : 
                    "bg-orange-500/10 text-orange-500"
                  )}>
                    <stat.icon className="h-10 w-10" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                    <h3 className="text-5xl font-black tracking-tighter">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black tracking-tighter">ბოლო ჯავშნები</h2>
            <div className="h-px flex-1 mx-8 bg-border/50 hidden md:block" />
          </div>

          <div className="grid grid-cols-1 gap-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-48 bg-card/50 rounded-[3rem] animate-pulse border border-border/50" />
              ))
            ) : bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-none shadow-sm rounded-[3rem] overflow-hidden group hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-700 bg-card/50 backdrop-blur-sm border border-border/50">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-72 h-64 md:h-auto relative overflow-hidden">
                          <img 
                            src={booking.equipment?.imageUrl || `https://picsum.photos/seed/${booking.equipmentId}/800/600`} 
                            alt={booking.equipment?.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <div className="flex-1 p-10 flex flex-col justify-between">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                {getStatusBadge(booking.status)}
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">
                                  ID: {booking.id.slice(0, 8)}
                                </span>
                              </div>
                              <h3 className="text-3xl font-black tracking-tighter group-hover:text-primary transition-colors leading-tight">
                                {booking.equipment?.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-medium">
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                                    <Calendar className="h-4 w-4 text-primary" />
                                  </div>
                                  {new Date(booking.bookingDate).toLocaleDateString('ka-GE', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                                    <MapPin className="h-4 w-4 text-primary" />
                                  </div>
                                  {booking.equipment?.location}
                                </div>
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">ჯამური ფასი</p>
                              <p className="text-5xl font-black text-primary tracking-tighter">₾{booking.price}</p>
                            </div>
                          </div>
                          <div className="mt-10 flex items-center justify-end">
                            <Button variant="ghost" className="rounded-2xl h-14 px-8 gap-3 group/btn font-black uppercase tracking-widest text-[10px] bg-secondary/50 hover:bg-primary/10 hover:text-primary transition-all" asChild>
                              <Link to={`/equipment/${booking.equipmentId}`}>
                                დეტალები
                                <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-2 transition-transform" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-40 bg-card/30 backdrop-blur-sm rounded-[4rem] border-4 border-dashed border-border/50 flex flex-col items-center justify-center space-y-8"
              >
                <div className="h-32 w-32 rounded-[2.5rem] bg-secondary flex items-center justify-center shadow-inner">
                  <Package className="h-16 w-16 text-muted-foreground opacity-40" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black tracking-tighter">ჯავშნები არ მოიძებნა</h3>
                  <p className="text-muted-foreground text-lg font-medium">თქვენ ჯერ არ გაგიკეთებიათ ჯავშანი</p>
                </div>
                <Button asChild size="lg" className="rounded-full px-12 h-16 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20">
                  <Link to="/heavy-equipment">დაიწყეთ ძებნა</Link>
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
