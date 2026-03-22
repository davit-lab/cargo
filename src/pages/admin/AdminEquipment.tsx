import React, { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
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
import { MoreVertical, Search, Package, Trash2, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const AdminEquipment = () => {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "equipment"));
      setEquipment(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ნამდვილად გსურთ წაშლა?")) return;
    try {
      await deleteDoc(doc(db, "equipment", id));
      setEquipment(equipment.filter(e => e.id !== id));
      toast.success("წაიშალა წარმატებით");
    } catch (error) {
      console.error("Error deleting equipment:", error);
      toast.error("წაშლა ვერ მოხერხდა");
    }
  };

  const filteredEquipment = equipment.filter(item => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ownerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ტექნიკა</h1>
        <p className="text-muted-foreground">ყველა განცხადების მართვა</p>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="ძებნა დასახელებით ან მფლობელით..." 
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
              <TableHead className="px-6 py-4">მფლობელი</TableHead>
              <TableHead className="px-6 py-4">ფასი</TableHead>
              <TableHead className="px-6 py-4">სტატუსი</TableHead>
              <TableHead className="px-6 py-4 text-right">მოქმედება</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEquipment.map((item) => (
              <TableRow key={item.id} className="group hover:bg-muted/30 transition-colors">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="h-10 w-10 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.category}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-sm">{item.ownerEmail}</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="font-bold text-sm">₾{item.price}</span>
                  <span className="text-[10px] text-muted-foreground ml-1">/დღე</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                    <CheckCircle className="h-3.5 w-3.5" />
                    აქტიური
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem asChild>
                        <Link to={`/equipment/${item.id}`} target="_blank">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          ნახვა
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        წაშლა
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredEquipment.length === 0 && !loading && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">ტექნიკა არ მოიძებნა</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEquipment;
