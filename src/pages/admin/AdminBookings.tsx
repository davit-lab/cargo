import React, { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Search, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const AdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      setBookings(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), { status: newStatus });
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      toast.success(`ჯავშნის სტატუსი შეიცვალა: ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("სტატუსის განახლება ვერ მოხერხდა");
    }
  };

  const filteredBookings = bookings.filter(booking => 
    booking.equipmentTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.renterEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.ownerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-600"><CheckCircle className="h-3 w-3" /> დადასტურებული</span>;
      case "cancelled":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-600"><XCircle className="h-3 w-3" /> გაუქმებული</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-600"><Clock className="h-3 w-3" /> მოლოდინში</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ჯავშნები</h1>
        <p className="text-muted-foreground">მართეთ ყველა ჯავშანი სისტემაში</p>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="ძებნა ტექნიკით, გამქირავებლით ან დამქირავებლით..." 
          className="border-none focus-visible:ring-0 bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="px-6 py-4">ტექნიკა</TableHead>
              <TableHead className="px-6 py-4">მხარეები</TableHead>
              <TableHead className="px-6 py-4">თარიღი</TableHead>
              <TableHead className="px-6 py-4">ფასი</TableHead>
              <TableHead className="px-6 py-4">სტატუსი</TableHead>
              <TableHead className="px-6 py-4 text-right">მოქმედება</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id} className="group hover:bg-muted/30 transition-colors">
                <TableCell className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{booking.equipmentTitle}</span>
                    <span className="text-xs text-muted-foreground">ID: {booking.id.slice(0, 8)}</span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-muted-foreground">დამქ:</span>
                      <span className="font-medium">{booking.renterEmail}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-muted-foreground">გამქ:</span>
                      <span className="font-medium">{booking.ownerEmail}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {booking.bookingDate ? format(new Date(booking.bookingDate), "dd/MM/yyyy") : "N/A"}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="font-bold text-sm">₾{booking.totalPrice || booking.price}</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  {getStatusBadge(booking.status)}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, "pending")}>სტატუსი: მოლოდინში</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, "confirmed")}>სტატუსი: დადასტურებული</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, "cancelled")}>სტატუსი: გაუქმებული</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredBookings.length === 0 && !loading && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">ჯავშნები არ მოიძებნა</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
