import React, { useState, useRef } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { db, auth } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { signOut, updateProfile } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CreditCard, 
  LogOut, 
  Save,
  Truck,
  Package,
  Camera,
  Loader2,
  Settings,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { user, profile } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [role, setRole] = useState(profile?.role || 'renter');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Check file size (max 1MB for Firestore base64 storage)
    if (file.size > 1024 * 1024) {
      toast.error('სურათის ზომა არ უნდა აღემატებოდეს 1MB-ს');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        // Update Firestore
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          photoURL: base64String
        });

        // Update Auth Profile (optional but good for consistency)
        await updateProfile(user, {
          photoURL: base64String
        });

        toast.success('პროფილის სურათი განახლდა');
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName,
        role
      });
      toast.success('პროფილი განახლდა');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32">
      {/* Profile Header */}
      <div className="relative pt-24 pb-20 overflow-hidden rounded-[4rem] bg-card shadow-2xl shadow-black/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-br from-primary/5 to-emerald-500/5 blur-[120px] -z-10" />
        
        <div className="flex flex-col items-center text-center space-y-10 px-8">
          <div className="relative group">
            <Avatar className="h-44 w-44 border-4 border-background shadow-2xl transition-transform duration-700 group-hover:scale-105">
              <AvatarImage src={profile?.photoURL || user?.photoURL || ''} />
              <AvatarFallback className="bg-primary/5 text-primary text-5xl font-black">
                {profile?.displayName?.charAt(0) || user?.displayName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50 backdrop-blur-sm"
            >
              {uploading ? (
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              ) : (
                <Camera className="h-8 w-8 text-white" />
              )}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">{profile?.displayName || user?.displayName || 'მომხმარებელი'}</h1>
            <p className="text-muted-foreground font-medium text-xl opacity-70">{user?.email}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <div className="px-8 py-4 rounded-3xl bg-secondary/50 border border-border/50 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Package className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">როლი</p>
                <p className="text-lg font-black leading-none uppercase tracking-tight">
                  {profile?.role === 'owner' ? 'მომწოდებელი' : 'მომხმარებელი'}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="h-20 px-8 rounded-3xl font-black text-xs uppercase tracking-widest border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all active:scale-95"
            >
              <LogOut className="mr-2 h-5 w-5" />
              გამოსვლა
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="rounded-[4rem] border-none shadow-2xl shadow-black/5 bg-card overflow-hidden">
          <div className="p-12 space-y-10">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Settings className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tighter">პროფილის პარამეტრები</h2>
                <p className="text-sm text-muted-foreground font-medium">განაახლეთ თქვენი პერსონალური ინფორმაცია</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 opacity-60">სახელი და გვარი</label>
                <Input 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-16 rounded-[2rem] border-none bg-secondary/50 px-8 font-bold text-lg focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 opacity-60">თქვენი როლი</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setRole('owner')}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex items-center gap-4 group ${
                      role === 'owner' 
                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' 
                        : 'border-transparent bg-secondary/30 hover:bg-secondary/50'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${role === 'owner' ? 'bg-primary text-white' : 'bg-background text-muted-foreground group-hover:text-primary'}`}>
                      <Package className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-black tracking-tight">მომწოდებელი</span>
                  </button>
                  <button
                    onClick={() => setRole('renter')}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex items-center gap-4 group ${
                      role === 'renter' 
                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' 
                        : 'border-transparent bg-secondary/30 hover:bg-secondary/50'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${role === 'renter' ? 'bg-primary text-white' : 'bg-background text-muted-foreground group-hover:text-primary'}`}>
                      <Truck className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-black tracking-tight">მომხმარებელი</span>
                  </button>
                </div>
              </div>

              <Button 
                onClick={handleUpdateProfile} 
                disabled={loading}
                className="w-full h-16 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all active:scale-95"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
                ცვლილებების შენახვა
              </Button>
            </div>
          </div>
        </Card>

        <Card className="rounded-[4rem] border-none shadow-2xl shadow-black/5 bg-card overflow-hidden">
          <div className="p-12 space-y-10">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <MessageSquare className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tighter">შეტყობინებები</h2>
                <p className="text-sm text-muted-foreground font-medium">თქვენი მიმოწერები</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-8 rounded-[2.5rem] bg-secondary/30 border border-border/50 space-y-6 group hover:bg-secondary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <p className="text-lg font-black tracking-tight">ყველა ჩატი</p>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">გადადით ჩატების გვერდზე</p>
                  </div>
                  <Link to="/messages">
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all">
                      <ArrowRight className="h-6 w-6" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[4rem] border-none shadow-2xl shadow-black/5 bg-card overflow-hidden">
          <div className="p-12 space-y-10">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tighter">უსაფრთხოება</h2>
                <p className="text-sm text-muted-foreground font-medium">დაიცავით თქვენი ანგარიში</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-8 rounded-[2.5rem] bg-secondary/30 border border-border/50 space-y-6 group hover:bg-secondary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <p className="text-lg font-black tracking-tight">ორფაქტორიანი ავტორიზაცია</p>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">დამატებითი დაცვა თქვენი ანგარიშისთვის SMS კოდით</p>
                  </div>
                  <div className="h-8 w-14 rounded-full bg-border relative cursor-pointer transition-all hover:ring-4 hover:ring-primary/10">
                    <div className="absolute left-1.5 top-1.5 h-5 w-5 rounded-full bg-white shadow-md" />
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-secondary/30 border border-border/50 space-y-6 group hover:bg-secondary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <p className="text-lg font-black tracking-tight">პაროლის შეცვლა</p>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">რეკომენდებულია პაროლის პერიოდული განახლება</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all">
                    <ArrowRight className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-red-50/30 border border-red-100/50 space-y-6 group hover:bg-red-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <p className="text-lg font-black tracking-tight text-red-600">ანგარიშის წაშლა</p>
                    <p className="text-xs text-red-600/60 font-medium leading-relaxed">ეს მოქმედება შეუქცევადია</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-red-100 hover:text-red-600 transition-all">
                    <ArrowRight className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
