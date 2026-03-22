import React, { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Truck, 
  Phone, 
  Search, 
  Filter,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ka } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const RouteList = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      where('type', '==', 'route'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching posts:', error);
      setLoading(false);
      handleFirestoreError(error, OperationType.LIST, 'posts');
    });

    return () => unsubscribe();
  }, []);

  const handleContact = (post: any) => {
    if (!user) {
      toast.error('გთხოვთ გაიაროთ ავტორიზაცია');
      navigate('/login');
      return;
    }
    if (user.uid === post.userId) {
      toast.info('ეს თქვენი განცხადებაა');
      return;
    }
    navigate(`/messages?chatWith=${post.userId}`);
  };

  const filteredPosts = posts.filter(post => 
    post.origin.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.destination.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-12 md:py-24 bg-background min-h-screen relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[140px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] -z-10" />

      <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 md:gap-12 mb-12 md:mb-20">
          <div className="space-y-4 md:space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/10 shadow-sm"
            >
              <Truck className="h-3 w-3 md:h-3.5 md:w-3.5" />
              რეისების ბაზა
            </motion.div>
            <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-[0.85] font-display">
              აქტიური <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700">რეისები</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-2xl font-medium leading-relaxed max-w-md">
              მოძებნეთ თავისუფალი ადგილი ტვირთის დასამატებლად და დაზოგეთ ხარჯები.
            </p>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-96 group">
              <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
              <input 
                placeholder="ძებნა..." 
                className="w-full pl-12 md:pl-16 h-14 md:h-16 rounded-2xl md:rounded-[2rem] border-none bg-card/50 backdrop-blur-sm shadow-2xl shadow-black/5 focus-visible:ring-2 focus-visible:ring-emerald-500/20 transition-all text-sm md:text-base font-bold outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="h-14 w-14 md:h-16 md:w-16 rounded-2xl md:rounded-[2rem] border-none bg-card/50 backdrop-blur-sm shadow-2xl shadow-black/5 hover:bg-emerald-50 shrink-0 transition-all active:scale-95">
              <Filter className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[450px] rounded-[3rem] bg-card/50 animate-pulse border border-border/50" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredPosts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-40 bg-card/30 backdrop-blur-sm rounded-[4rem] border-4 border-dashed border-border/50 flex flex-col items-center justify-center space-y-8"
              >
                <div className="h-32 w-32 rounded-[2.5rem] bg-emerald-50 flex items-center justify-center shadow-inner">
                  <Truck className="h-16 w-16 text-muted-foreground opacity-40" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black tracking-tighter">განცხადებები არ მოიძებნა</h3>
                  <p className="text-muted-foreground text-lg font-medium">სცადეთ სხვა საძიებო სიტყვა ან შეცვალეთ ფილტრი</p>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    layout
                  >
                    <Card className="group relative h-full rounded-[2rem] md:rounded-[3rem] border-none shadow-sm hover:shadow-[0_40px_80px_rgba(16,185,129,0.1)] transition-all duration-700 overflow-hidden bg-card/50 backdrop-blur-sm flex flex-col border border-border/50">
                      <div className="p-6 md:p-10 pb-4 md:pb-6 space-y-6 md:space-y-10 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/10">
                            რეისი
                          </div>
                          <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                            <Clock className="h-3 w-3 md:h-3.5 md:w-3.5" />
                            {post.createdAt?.toDate ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true, locale: ka }) : 'ახლახანს'}
                          </div>
                        </div>

                        <div className="space-y-6 md:space-y-8 relative">
                          <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-500 via-emerald-500/20 to-primary rounded-full" />
                          
                          <div className="flex items-start gap-4 md:gap-6 pl-6">
                            <div className="mt-1.5 h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 shrink-0" />
                            <div className="space-y-0.5 md:space-y-1">
                              <p className="text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-widest">საიდან</p>
                              <p className="font-black text-lg md:text-xl tracking-tight leading-tight">{post.origin.address}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-4 md:gap-6 pl-6">
                            <div className="mt-1.5 h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-primary ring-4 ring-primary/20 shrink-0" />
                            <div className="space-y-0.5 md:space-y-1">
                              <p className="text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-widest">სად</p>
                              <p className="font-black text-lg md:text-xl tracking-tight leading-tight">{post.destination.address}</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 md:pt-6">
                          <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed line-clamp-3">
                            {post.description}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 md:p-10 pt-4 md:pt-6 border-t border-border/50 bg-secondary/20">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-6">
                          <div className="space-y-1 md:space-y-1.5">
                            <p className="text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">ფასი</p>
                            <p className="text-3xl md:text-4xl font-black text-emerald-600 tracking-tighter leading-none">₾{post.price}</p>
                          </div>
                          
                          <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-card hover:bg-emerald-500/10 hover:text-emerald-600 transition-all active:scale-90 shadow-sm border border-border/50 shrink-0"
                              onClick={() => window.open(`tel:${post.contactPhone}`)}
                            >
                              <Phone className="h-4 w-4 md:h-5 md:w-5" />
                            </Button>
                            <Button 
                              onClick={() => handleContact(post)}
                              className="flex-1 sm:flex-none h-12 md:h-14 rounded-xl md:rounded-2xl px-6 md:px-8 font-black text-[9px] md:text-[10px] uppercase tracking-widest group transition-all active:scale-95 shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700"
                            >
                              მიწერა
                              <ArrowUpRight className="ml-2 h-3.5 w-3.5 md:h-4 md:w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default RouteList;
