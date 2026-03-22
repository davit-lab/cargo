import React, { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, getDocs, doc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit2, Tags, Search } from "lucide-react";
import { toast } from "sonner";

const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", icon: "", slug: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateDoc(doc(db, "categories", editingCategory.id), formData);
        toast.success("კატეგორია განახლდა");
      } else {
        await addDoc(collection(db, "categories"), formData);
        toast.success("კატეგორია დაემატა");
      }
      setIsDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: "", icon: "", slug: "" });
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("შენახვა ვერ მოხერხდა");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ნამდვილად გსურთ წაშლა?")) return;
    try {
      await deleteDoc(doc(db, "categories", id));
      setCategories(categories.filter(c => c.id !== id));
      toast.success("წაიშალა წარმატებით");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("წაშლა ვერ მოხერხდა");
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">კატეგორიები</h1>
          <p className="text-muted-foreground">მართეთ ტექნიკის კატეგორიები</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gap-2" onClick={() => {
              setEditingCategory(null);
              setFormData({ name: "", icon: "", slug: "" });
            }}>
              <Plus className="h-4 w-4" />
              დამატება
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "კატეგორიის რედაქტირება" : "ახალი კატეგორია"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">დასახელება</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (ინგლისურად)</Label>
                <Input 
                  id="slug" 
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="rounded-xl"
                  placeholder="მაგ: tractors"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (Lucide სახელი)</Label>
                <Input 
                  id="icon" 
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="rounded-xl"
                  placeholder="მაგ: Truck"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="rounded-xl w-full">შენახვა</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="ძებნა დასახელებით..." 
          className="border-none focus-visible:ring-0 bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="px-6 py-4">კატეგორია</TableHead>
              <TableHead className="px-6 py-4">Slug</TableHead>
              <TableHead className="px-6 py-4">Icon</TableHead>
              <TableHead className="px-6 py-4 text-right">მოქმედება</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id} className="group hover:bg-muted/30 transition-colors">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Tags className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-sm">{category.name}</span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded-lg">{category.slug}</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">{category.icon}</span>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full"
                      onClick={() => {
                        setEditingCategory(category);
                        setFormData({ name: category.name, icon: category.icon, slug: category.slug });
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredCategories.length === 0 && !loading && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">კატეგორიები არ მოიძებნა</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
