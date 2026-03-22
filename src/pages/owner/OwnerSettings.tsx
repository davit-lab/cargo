import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Mail, Shield } from "lucide-react";
import { toast } from "sonner";

const OwnerSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName: formData.displayName,
      });
      toast.success("პროფილი განახლდა");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("განახლება ვერ მოხერხდა");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">პარამეტრები</h1>
        <p className="text-muted-foreground">მართეთ თქვენი ანგარიში</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                პროფილის ინფორმაცია
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName">სახელი და გვარი</Label>
                  <Input 
                    id="displayName" 
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="rounded-xl"
                    placeholder="თქვენი სახელი"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">ელ-ფოსტა</Label>
                  <Input 
                    id="email" 
                    value={formData.email}
                    disabled
                    className="rounded-xl bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">ელ-ფოსტის შეცვლა შეუძლებელია</p>
                </div>
                <Button 
                  type="submit" 
                  className="rounded-xl px-8"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "შენახვა"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                უსაფრთხოება
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                  <div>
                    <p className="font-bold text-sm">პაროლის შეცვლა</p>
                    <p className="text-xs text-muted-foreground">განაახლეთ თქვენი პაროლი</p>
                  </div>
                  <Button variant="outline" className="rounded-xl">შეცვლა</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                  <div>
                    <p className="font-bold text-sm">ორფაქტორიანი ავტორიზაცია</p>
                    <p className="text-xs text-muted-foreground">დამატებითი დაცვა</p>
                  </div>
                  <Button variant="outline" className="rounded-xl" disabled>ჩართვა</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                {user?.email?.[0].toUpperCase()}
              </div>
              <h3 className="text-xl font-bold mb-1">{formData.displayName || user?.email?.split('@')[0]}</h3>
              <p className="text-sm opacity-80 mb-6">{user?.email}</p>
              <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
                მფლობელი
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OwnerSettings;
