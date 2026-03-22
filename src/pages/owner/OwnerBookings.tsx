import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase";
import { collection, query, where, getDocs, updateDoc, doc, orderBy } from "firebase/firestore";
import { 
  CalendarCheck, 
  Check, 
  X, 
  Loader2,
  Mail,
  Calendar as CalendarIcon,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";

interface Booking {
  id: string;
  equipmentId: string;
  equipmentTitle: string;
  userId: string;
  userEmail: string;
  bookingDate: string;
  status: "pending" | "confirmed" | "cancelled";
  price: number;
  createdAt: any;
}

const OwnerBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "bookings"), 
        where("ownerId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleStatusChange = async (id: string, newStatus: "confirmed" | "cancelled" | "pending") => {
    try {
      await updateDoc(doc(db, "bookings", id), { status: newStatus });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
      toast.success(
        newStatus === "confirmed" 
          ? "ჯავშანი დადასტურდა" 
          : newStatus === "cancelled" 
            ? "ჯავშანი გაუქმდა" 
            : "სტატუსი განახლდა"
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("სტატუსის შეცვლა ვერ მოხერხდა");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">ჯავშნები</h1>
        <p className="text-muted-foreground">მართეთ თქვენი სერვისების ჯავშნები</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-card border border-dashed rounded-3xl">
          <CalendarCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">ჯავშნები ჯერ არ არის.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-card border border-border rounded-3xl p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                      booking.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {booking.status === 'confirmed' ? 'დადასტურებული' : 
                       booking.status === 'pending' ? 'მომლოდინე' : 'გაუქმებული'}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ID: {booking.id.slice(0, 8)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold">{booking.equipmentTitle}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{booking.userEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{format(new Date(booking.bookingDate), "PPP")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>შექმნილია: {booking.createdAt?.toDate ? format(booking.createdAt.toDate(), "PPp") : "ახლახანს"}</span>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {booking.price} ₾
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col justify-end gap-2">
                  {booking.status === "pending" && (
                    <>
                      <Button 
                        variant="default" 
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 gap-2"
                        onClick={() => handleStatusChange(booking.id, "confirmed")}
                      >
                        <Check className="h-4 w-4" />
                        დადასტურება
                      </Button>
                      <Button 
                        variant="outline" 
                        className="rounded-xl text-destructive hover:bg-destructive hover:text-destructive-foreground gap-2"
                        onClick={() => handleStatusChange(booking.id, "cancelled")}
                      >
                        <X className="h-4 w-4" />
                        გაუქმება
                      </Button>
                    </>
                  )}
                  {booking.status !== "pending" && (
                    <Button 
                      variant="outline" 
                      className="rounded-xl gap-2"
                      onClick={() => handleStatusChange(booking.id, "pending")}
                    >
                      სტატუსის დაბრუნება
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerBookings;
