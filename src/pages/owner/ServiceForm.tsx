import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase";
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Upload, X } from "lucide-react";
import { toast } from "sonner";

const ServiceForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    category: "",
    imageUrl: "",
  });

  const categories = ["მძიმე ტექნიკა", "ხელსაწყოები", "სატრანსპორტო", "სხვა"];

  useEffect(() => {
    if (id) {
      const fetchService = async () => {
        setFetching(true);
        try {
          const docRef = doc(db, "equipment", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
              title: data.title || "",
              description: data.description || "",
              price: data.price?.toString() || "",
              location: data.location || "",
              category: data.category || "",
              imageUrl: data.imageUrl || "",
            });
          }
        } catch (error) {
          console.error("Error fetching service:", error);
        } finally {
          setFetching(false);
        }
      };
      fetchService();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        ownerId: user.uid,
        updatedAt: serverTimestamp(),
      };

      if (id) {
        await updateDoc(doc(db, "equipment", id), data);
        toast.success("წარმატებით განახლდა");
      } else {
        await addDoc(collection(db, "equipment"), {
          ...data,
          createdAt: serverTimestamp(),
          rating: 4.9,
        });
        toast.success("წარმატებით დაემატა");
      }
      navigate("/owner/services");
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("შენახვა ვერ მოხერხდა");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-6 gap-2" 
        onClick={() => navigate("/owner/services")}
      >
        <ArrowLeft className="h-4 w-4" />
        უკან დაბრუნება
      </Button>

      <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-8">
          {id ? "სერვისის რედაქტირება" : "ახალი სერვისის დამატება"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">სათაური</Label>
            <Input 
              id="title" 
              required 
              placeholder="მაგ: ექსკავატორის ქირაობა"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">კატეგორია</Label>
              <Select 
                value={formData.category} 
                onValueChange={(val) => setFormData({ ...formData, category: val })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="აირჩიეთ კატეგორია" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">ფასი (საათში)</Label>
              <Input 
                id="price" 
                type="number" 
                required 
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">მდებარეობა</Label>
            <Input 
              id="location" 
              required 
              placeholder="მაგ: თბილისი, საბურთალო"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">აღწერა</Label>
            <Textarea 
              id="description" 
              required 
              placeholder="დაწვრილებით აღწერეთ სერვისი..."
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="rounded-xl resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">სურათის URL</Label>
            <div className="flex gap-4">
              <Input 
                id="imageUrl" 
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="rounded-xl"
              />
            </div>
            {formData.imageUrl && (
              <div className="mt-4 relative aspect-video rounded-2xl overflow-hidden border">
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/800x450?text=Invalid+Image+URL")}
                />
                <Button 
                  type="button"
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={() => setFormData({ ...formData, imageUrl: "" })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-lg font-bold"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (id ? "განახლება" : "დამატება")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
