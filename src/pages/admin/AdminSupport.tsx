import React, { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Search, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MoreVertical,
  User,
  Mail
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const AdminSupport = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      // In a real app, you'd have a 'support_tickets' collection
      const q = query(collection(db, "support_tickets"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      setTickets(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      // Mock data for demo if collection doesn't exist
      setTickets([
        {
          id: "1",
          subject: "პრობლემა რეგისტრაციისას",
          userEmail: "user1@example.com",
          status: "open",
          priority: "high",
          createdAt: new Date().toISOString(),
          message: "ვერ ვახერხებ რეგისტრაციას, მიწერს შეცდომას..."
        },
        {
          id: "2",
          subject: "კითხვა გადახდასთან დაკავშირებით",
          userEmail: "user2@example.com",
          status: "closed",
          priority: "medium",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          message: "როგორ ხდება თანხის დაბრუნება?"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      // await updateDoc(doc(db, "support_tickets", ticketId), { status: newStatus });
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
      toast.success(`ბილეთის სტატუსი შეიცვალა: ${newStatus}`);
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast.error("სტატუსის განახლება ვერ მოხერხდა");
    }
  };

  const filteredTickets = tickets.filter(ticket => 
    ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-amber-100 text-amber-600 border-none rounded-full px-3 py-1 font-bold uppercase text-[10px] tracking-wider">ღია</Badge>;
      case "closed":
        return <Badge className="bg-emerald-100 text-emerald-600 border-none rounded-full px-3 py-1 font-bold uppercase text-[10px] tracking-wider">დახურული</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground border-none rounded-full px-3 py-1 font-bold uppercase text-[10px] tracking-wider">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">მხარდაჭერა</h1>
        <p className="text-muted-foreground">მომხმარებელთა მოთხოვნების მართვა</p>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="ძებნა სათაურით ან იმეილით..." 
          className="border-none focus-visible:ring-0 bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-2xl",
                    ticket.status === "open" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                  )}>
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{ticket.subject}</h3>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {ticket.userEmail}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {format(new Date(ticket.createdAt), "dd MMM, HH:mm")}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {ticket.status === "open" ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl font-bold gap-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                      onClick={() => handleUpdateStatus(ticket.id, "closed")}
                    >
                      <CheckCircle className="h-4 w-4" />
                      დახურვა
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl font-bold gap-2 border-amber-200 text-amber-600 hover:bg-amber-50"
                      onClick={() => handleUpdateStatus(ticket.id, "open")}
                    >
                      <AlertCircle className="h-4 w-4" />
                      გახსნა
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 p-4 bg-muted/30 rounded-2xl text-sm text-muted-foreground italic">
                "{ticket.message}"
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredTickets.length === 0 && !loading && (
          <div className="p-12 text-center bg-white rounded-3xl border shadow-sm">
            <p className="text-muted-foreground">ბილეთები არ მოიძებნა</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupport;
