import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { 
  Package, 
  Edit, 
  Trash2, 
  Plus,
  Loader2,
  ExternalLink,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Equipment {
  id: string;
  title: string;
  category: string;
  price: number;
  location: string;
  imageUrl: string;
}

const OwnerServices = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchServices = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, "equipment"), where("ownerId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Equipment));
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა?")) return;

    try {
      await deleteDoc(doc(db, "equipment", id));
      setServices(services.filter(s => s.id !== id));
      toast.success("სერვისი წაიშალა");
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("წაშლა ვერ მოხერხდა");
    }
  };

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">ჩემი სერვისები</h1>
          <p className="text-muted-foreground">მართეთ თქვენი განცხადებები</p>
        </div>
        <Link to="/owner/services/new">
          <Button className="rounded-xl gap-2">
            <Plus className="h-4 w-4" />
            ახალი სერვისი
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="ძებნა..." 
          className="pl-10 rounded-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredServices.length === 0 ? (
        <div className="text-center py-20 bg-card border border-dashed rounded-3xl">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">სერვისები ვერ მოიძებნა.</p>
          {services.length === 0 && (
            <Link to="/owner/services/new">
              <Button variant="link" className="mt-2">დაამატეთ თქვენი პირველი სერვისი</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-card border border-border rounded-3xl p-4 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow">
              <div className="w-full md:w-48 aspect-video rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                <img 
                  src={service.imageUrl || `https://picsum.photos/seed/${service.id}/400/300`} 
                  alt={service.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex-1 min-w-0 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold truncate">{service.title}</h3>
                  <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase">
                    {service.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{service.location}</p>
                <div className="text-lg font-bold text-primary">{service.price} ₾ / სთ</div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-center">
                <Link to={`/equipment/${service.id}`} target="_blank">
                  <Button variant="outline" size="icon" className="rounded-xl" title="ნახვა">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to={`/owner/services/edit/${service.id}`}>
                  <Button variant="outline" size="icon" className="rounded-xl" title="რედაქტირება">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-xl text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleDelete(service.id)}
                  title="წაშლა"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerServices;
