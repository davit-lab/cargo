import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Mail, Lock, User as UserIcon, ShieldCheck, ArrowRight, Truck } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { handleFirestoreError, OperationType } from "@/lib/firestore-errors";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'owner' | 'renter' | null>(null);
  const { signIn, signUp, signInWithGoogle, user, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const defaultTab = location.pathname === "/register" ? "register" : "login";

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signIn(email, password);
      toast.success("წარმატებული ავტორიზაცია");
      // Role check is handled by useEffect or after sign in
    } catch (error: any) {
      toast.error(error.message || "ავტორიზაცია ვერ მოხერხდა");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    try {
      await signUp(email, password, fullName);
      toast.success("რეგისტრაცია წარმატებით დასრულდა");
      setShowRoleSelection(true);
    } catch (error: any) {
      toast.error(error.message || "რეგისტრაცია ვერ მოხერხდა");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("წარმატებული ავტორიზაცია");
      // Role check is handled by useEffect or after sign in
    } catch (error: any) {
      toast.error(error.message || "Google-ით ავტორიზაცია ვერ მოხერხდა");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelection = async () => {
    if (!user || !selectedRole) return;
    
    setLoading(true);
    const userRef = doc(db, 'users', user.uid);
    const path = `users/${user.uid}`;
    
    try {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: selectedRole,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      toast.success("როლი წარმატებით შეინახა");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setLoading(false);
    }
  };

  // If user is logged in but has no role, show role selection
  React.useEffect(() => {
    if (user && userRole === null) {
      setShowRoleSelection(true);
    } else if (user && userRole) {
      navigate("/");
    }
  }, [user, userRole, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 pt-20">
      <AnimatePresence mode="wait">
        {!showRoleSelection ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Truck className="h-8 w-8" />
                </div>
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-primary uppercase">CargoConnect<span className="text-muted-foreground">GE</span></h1>
              <p className="text-muted-foreground mt-2 font-medium">საქართველოს #1 სერვისის პლატფორმა</p>
            </div>

            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card/80 backdrop-blur-xl">
              <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-none h-14 bg-muted/50">
                  <TabsTrigger value="login" className="data-[state=active]:bg-background data-[state=active]:shadow-none rounded-none font-bold">შესვლა</TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:bg-background data-[state=active]:shadow-none rounded-none font-bold">რეგისტრაცია</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="p-8 pt-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-bold text-xs uppercase tracking-widest ml-1">ელ-ფოსტა</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="email" name="email" type="email" placeholder="name@example.com" className="pl-12 rounded-2xl h-14 border-2 focus:border-primary transition-all" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="font-bold text-xs uppercase tracking-widest ml-1">პაროლი</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="password" name="password" type="password" placeholder="••••••••" className="pl-12 rounded-2xl h-14 border-2 focus:border-primary transition-all" required />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-14 rounded-2xl font-black text-base uppercase tracking-widest shadow-xl shadow-primary/20" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "შესვლა"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="p-8 pt-6">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="font-bold text-xs uppercase tracking-widest ml-1">სახელი და გვარი</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="fullName" name="fullName" type="text" placeholder="გიორგი გიორგაძე" className="pl-12 rounded-2xl h-14 border-2 focus:border-primary transition-all" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email" className="font-bold text-xs uppercase tracking-widest ml-1">ელ-ფოსტა</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="reg-email" name="email" type="email" placeholder="name@example.com" className="pl-12 rounded-2xl h-14 border-2 focus:border-primary transition-all" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password" className="font-bold text-xs uppercase tracking-widest ml-1">პაროლი</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="reg-password" name="password" type="password" placeholder="••••••••" className="pl-12 rounded-2xl h-14 border-2 focus:border-primary transition-all" required />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-14 rounded-2xl font-black text-base uppercase tracking-widest shadow-xl shadow-primary/20" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "რეგისტრაცია"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="px-8 pb-8">
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black">
                    <span className="bg-card px-4 text-muted-foreground">ან გააგრძელეთ</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Button variant="outline" className="h-14 rounded-2xl font-black text-xs uppercase tracking-widest border-2 hover:bg-muted/50 transition-all" onClick={handleGoogleSignIn} disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                    )}
                    Google-ით შესვლა
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="role-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg"
          >
            <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-card/80 backdrop-blur-xl p-2">
              <div className="bg-primary h-2 w-full rounded-full" />
              <CardHeader className="text-center space-y-4 pt-10">
                <CardTitle className="text-3xl font-black tracking-tighter uppercase">აირჩიეთ როლი</CardTitle>
                <CardDescription className="text-base font-medium">
                  როგორ აპირებთ პლატფორმის გამოყენებას?
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-12 pt-6 px-10 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <button
                    onClick={() => setSelectedRole('renter')}
                    className={`p-8 rounded-[2.5rem] border-2 transition-all text-left flex flex-col gap-6 group relative overflow-hidden ${
                      selectedRole === 'renter' 
                        ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10' 
                        : 'border-border/50 hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      selectedRole === 'renter' ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 'bg-primary/10 text-primary'
                    }`}>
                      <UserIcon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="font-black text-xl tracking-tight uppercase">მომხმარებელი</h3>
                      <p className="text-xs text-muted-foreground font-medium mt-2 leading-relaxed">ვეძებ სერვისებს, ტვირთებს და სპეცტექნიკას</p>
                    </div>
                    {selectedRole === 'renter' && (
                      <motion.div layoutId="role-check" className="absolute top-4 right-4 h-6 w-6 bg-primary rounded-full flex items-center justify-center text-white">
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedRole('owner')}
                    className={`p-8 rounded-[2.5rem] border-2 transition-all text-left flex flex-col gap-6 group relative overflow-hidden ${
                      selectedRole === 'owner' 
                        ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10' 
                        : 'border-border/50 hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      selectedRole === 'owner' ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 'bg-primary/10 text-primary'
                    }`}>
                      <ShieldCheck className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="font-black text-xl tracking-tight uppercase">მომწოდებელი</h3>
                      <p className="text-xs text-muted-foreground font-medium mt-2 leading-relaxed">ვამატებ ტვირთებს, რეისებს და სპეცტექნიკას</p>
                    </div>
                    {selectedRole === 'owner' && (
                      <motion.div layoutId="role-check" className="absolute top-4 right-4 h-6 w-6 bg-primary rounded-full flex items-center justify-center text-white">
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    )}
                  </button>
                </div>

                <Button 
                  onClick={handleRoleSelection} 
                  disabled={!selectedRole || loading}
                  className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all active:scale-95 gap-3"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      გაგრძელება
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Auth;
