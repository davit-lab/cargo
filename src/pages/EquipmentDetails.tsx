import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, addDoc, collection, serverTimestamp, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ka } from "date-fns/locale";
import { Calendar as CalendarIcon, MapPin, Star, Shield, Clock, Loader2, CheckCircle2, MessageSquare, Settings, User, PlusCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Equipment {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  imageUrl: string;
  category: string;
  ownerId: string;
  rating?: number;
  availability?: 'available' | 'busy' | 'maintenance';
}

interface Owner {
  displayName: string;
  photoURL?: string;
  phone?: string;
  rating?: number;
  totalReviews?: number;
}

const EquipmentDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [relatedEquipment, setRelatedEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState<Date>();
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const fetchEquipmentAndOwner = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "equipment", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const equipmentData = { id: docSnap.id, ...docSnap.data() } as Equipment;
          setEquipment(equipmentData);

          // Fetch owner info
          if (equipmentData.ownerId) {
            const ownerRef = doc(db, "users", equipmentData.ownerId);
            const ownerSnap = await getDoc(ownerRef);
            if (ownerSnap.exists()) {
              setOwner(ownerSnap.data() as Owner);
            } else if (equipmentData.ownerId === 'system') {
              setOwner({
                displayName: "RentHub System",
                photoURL: "https://i.pravatar.cc/150?u=system",
                phone: "+995 599 00 00 00",
                rating: 5.0,
                totalReviews: 124
              });
            }

            // Fetch related equipment
            const relatedQuery = query(
              collection(db, "equipment"),
              where("category", "==", equipmentData.category),
              limit(10) // Fetch a few more to filter out current one
            );
            const relatedSnap = await getDocs(relatedQuery);
            const relatedData = relatedSnap.docs
              .map(doc => ({ id: doc.id, ...doc.data() } as Equipment))
              .filter(item => item.id !== id)
              .slice(0, 4);
            setRelatedEquipment(relatedData);
          }
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching equipment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentAndOwner();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      toast.error("საჭიროა ავტორიზაცია", {
        description: "გთხოვთ გაიაროთ ავტორიზაცია დაჯავშნისთვის",
      });
      navigate("/login");
      return;
    }

    if (!bookingDate) {
      toast.error("აირჩიეთ თარიღი", {
        description: "გთხოვთ აირჩიოთ სასურველი თარიღი",
      });
      return;
    }

    setIsBooking(true);
    try {
      await addDoc(collection(db, "bookings"), {
        equipmentId: id,
        equipmentTitle: equipment?.title,
        userId: user.uid,
        userEmail: user.email,
        ownerId: equipment?.ownerId,
        bookingDate: bookingDate.toISOString(),
        status: "pending",
        createdAt: serverTimestamp(),
        price: equipment?.price,
      });

      setBooked(true);
      toast.success("წარმატებული დაჯავშნა", {
        description: "თქვენი მოთხოვნა გაიგზავნა მფლობელთან",
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("შეცდომა", {
        description: "დაჯავშნა ვერ მოხერხდა, სცადეთ მოგვიგვიანებით",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleContact = () => {
    if (!user) {
      toast.error("საჭიროა ავტორიზაცია", {
        description: "გთხოვთ გაიაროთ ავტორიზაცია შეტყობინების გასაგზავნად",
      });
      navigate("/login");
      return;
    }
    
    if (user.uid === equipment?.ownerId) {
      toast.error("შეცდომა", {
        description: "თქვენ ვერ გაუგზავნით შეტყობინებას საკუთარ თავს",
      });
      return;
    }

    navigate(`/messages?chatWith=${equipment?.ownerId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!equipment) {
    return (
      <Layout>
        <div className="container mx-auto py-20 px-4 text-center">
          <h1 className="text-2xl font-bold">სერვისი ვერ მოიძებნა</h1>
          <Button className="mt-4" onClick={() => navigate("/equipment")}>უკან დაბრუნება</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-12 md:py-24 bg-background min-h-screen relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[140px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] -z-10" />

        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Left Column: Image and Description */}
            <div className="lg:col-span-2 space-y-8 md:space-y-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="aspect-video rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl shadow-black/10 relative group"
              >
                <img
                  src={equipment.imageUrl || `https://picsum.photos/seed/${equipment.id}/1200/800`}
                  alt={equipment.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
              
              <div className="space-y-6 md:space-y-8">
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                  <span className="bg-primary/10 text-primary px-4 py-1.5 md:px-6 md:py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10 shadow-sm">
                    {equipment.category}
                  </span>
                  <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/10 shadow-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span className="font-black text-[10px] md:text-xs tracking-tight uppercase">
                      {equipment.availability === 'busy' ? 'დაკავებულია' : 
                       equipment.availability === 'maintenance' ? 'რემონტზე' : 'ხელმისაწვდომია'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/10 shadow-sm">
                    <Star className="h-3.5 w-3.5 md:h-4 md:w-4 fill-current" />
                    <span className="font-black text-[10px] md:text-xs tracking-tight">{equipment.rating || "4.9"}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] font-display">
                    {equipment.title}
                  </h1>
                  
                  <div className="flex items-center gap-3 text-muted-foreground font-medium text-base md:text-lg">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl md:rounded-2xl bg-secondary/50 flex items-center justify-center">
                      <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    </div>
                    <span>{equipment.location}</span>
                  </div>
                </div>

                <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-card/50 backdrop-blur-sm border border-border/50 space-y-6 md:space-y-8 shadow-sm">
                  <h2 className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-3">
                    <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center">
                      <User className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                    </div>
                    მფლობელი
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl md:rounded-[2rem] overflow-hidden border-2 border-primary/20 shadow-xl">
                        <img 
                          src={owner?.photoURL || `https://i.pravatar.cc/150?u=${equipment.ownerId}`} 
                          alt={owner?.displayName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-black tracking-tight">{owner?.displayName || "მფლობელი"}</h3>
                        <div className="flex items-center gap-3 md:gap-4 mt-1">
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-[10px] font-black">{owner?.rating || "5.0"}</span>
                          </div>
                          <span className="text-[9px] md:text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                            {owner?.totalReviews || "12"} მიმოხილვა
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto rounded-xl md:rounded-2xl h-12 md:h-14 px-6 md:px-8 font-black uppercase tracking-widest text-[9px] md:text-[10px] border-2 border-primary/10 hover:bg-primary/5"
                      onClick={handleContact}
                    >
                      პროფილის ნახვა
                    </Button>
                  </div>
                </div>

                {/* Related Services Section */}
                {relatedEquipment.length > 0 && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between px-4">
                      <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                          <PlusCircle className="h-4 w-4 text-primary" />
                        </div>
                        მსგავსი სერვისები
                      </h2>
                      <Button 
                        variant="ghost" 
                        className="text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary rounded-xl"
                        onClick={() => navigate('/heavy-equipment')}
                      >
                        ყველას ნახვა
                      </Button>
                    </div>
                    
                    <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 snap-x">
                      {relatedEquipment.map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ y: -5 }}
                          className="min-w-[240px] md:min-w-[280px] bg-card/50 backdrop-blur-sm border border-border/50 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group cursor-pointer snap-start shadow-sm hover:shadow-xl transition-all duration-500"
                          onClick={() => navigate(`/equipment/${item.id}`)}
                        >
                          <div className="aspect-[4/3] overflow-hidden relative">
                            <img 
                              src={item.imageUrl || `https://picsum.photos/seed/${item.id}/400/300`} 
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full border border-border/50">
                              <span className="text-[10px] font-black text-primary">₾{item.price}</span>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="font-black tracking-tight text-lg line-clamp-1 group-hover:text-primary transition-colors">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">{item.location}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* View All Card at the end */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="min-w-[200px] bg-primary/5 border-2 border-dashed border-primary/20 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 cursor-pointer group snap-start"
                        onClick={() => navigate('/heavy-equipment')}
                      >
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                          <ArrowRight className="h-6 w-6" />
                        </div>
                        <span className="font-black text-[10px] uppercase tracking-widest text-primary">ყველას ნახვა</span>
                      </motion.div>
                    </div>
                  </div>
                )}

                <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-card/50 backdrop-blur-sm border border-border/50 space-y-4 md:space-y-6 shadow-sm">
                  <h2 className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-3">
                    <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center">
                      <Settings className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                    </div>
                    აღწერა
                  </h2>
                  <p className="text-muted-foreground text-base md:text-lg font-medium leading-relaxed whitespace-pre-wrap">
                    {equipment.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-8 bg-card/50 backdrop-blur-sm rounded-[2.5rem] border border-border/50 flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md transition-all">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Shield className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-black tracking-tight text-lg">დაზღვეული</h3>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">სრული დაცვა</p>
                    </div>
                  </div>
                  <div className="p-8 bg-card/50 backdrop-blur-sm rounded-[2.5rem] border border-border/50 flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md transition-all">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Clock className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-black tracking-tight text-lg">24/7 მხარდაჭერა</h3>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">ყოველთვის ხელმისაწვდომი</p>
                    </div>
                  </div>
                  <div className="p-8 bg-card/50 backdrop-blur-sm rounded-[2.5rem] border border-border/50 flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md transition-all">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-black tracking-tight text-lg">შემოწმებული</h3>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">ხარისხის გარანტია</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 bg-card/50 backdrop-blur-sm border border-border/50 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 shadow-2xl shadow-black/5 space-y-8 md:space-y-10">
                <div className="space-y-2">
                  <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">ფასი</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-black text-primary tracking-tighter">₾{equipment.price}</span>
                    <span className="text-muted-foreground font-bold text-base md:text-lg">/ საათი</span>
                  </div>
                </div>

                <div className="space-y-6 md:space-y-8">
                  <div className="space-y-3 md:space-y-4">
                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">აირჩიეთ თარიღი</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-bold rounded-xl md:rounded-2xl h-14 md:h-16 border-none bg-secondary/50 px-6 md:px-8 transition-all hover:bg-secondary text-sm md:text-base",
                            !bookingDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-3 h-4 w-4 md:h-5 md:w-5 text-primary" />
                          {bookingDate ? format(bookingDate, "PPP", { locale: ka }) : <span>აირჩიეთ თარიღი</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-[1.5rem] md:rounded-[2rem] border-none shadow-2xl" align="start">
                        <Calendar
                          mode="single"
                          selected={bookingDate}
                          onSelect={setBookingDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                          className="rounded-[1.5rem] md:rounded-[2rem]"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {booked ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-emerald-500/10 text-emerald-600 p-5 md:p-6 rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-4 border border-emerald-500/10 shadow-sm"
                    >
                      <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 shrink-0" />
                      <p className="text-xs md:text-sm font-black tracking-tight">მოთხოვნა გაგზავნილია!</p>
                    </motion.div>
                  ) : (
                    <Button 
                      className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95" 
                      onClick={handleBooking}
                      disabled={isBooking}
                    >
                      {isBooking ? <Loader2 className="h-5 w-5 animate-spin" /> : "დაჯავშნა"}
                    </Button>
                  )}

                  <Button 
                    variant="ghost"
                    className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 hover:bg-primary/10 hover:text-primary transition-all active:scale-95 border border-border/50" 
                    onClick={handleContact}
                  >
                    <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
                    შეტყობინების გაგზავნა
                  </Button>

                  <p className="text-[8px] md:text-[10px] text-center text-muted-foreground font-black uppercase tracking-widest opacity-40 leading-relaxed">
                    დაჯავშნისას თქვენ ეთანხმებით <br /> მომსახურების პირობებს
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EquipmentDetails;
