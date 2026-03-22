import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Info,
  Hammer,
  Wrench,
  Construction
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { db } from '@/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';

// Real-world heavy equipment types common in Georgia
const EQUIPMENT_TYPES = [
  { id: 'excavator', name: 'ექსკავატორი', icon: <Construction className="h-5 w-5" /> },
  { id: 'crane', name: 'ამწე', icon: <Construction className="h-5 w-5" /> },
  { id: 'bulldozer', name: 'ბულდოზერი', icon: <Construction className="h-5 w-5" /> },
  { id: 'loader', name: 'დამტვირთველი', icon: <Construction className="h-5 w-5" /> },
  { id: 'truck', name: 'თვითმცლელი', icon: <Construction className="h-5 w-5" /> },
  { id: 'roller', name: 'სატკეპნი', icon: <Construction className="h-5 w-5" /> },
];

interface EquipmentItem {
  id: string;
  title: string;
  type: string;
  location: string;
  price: string;
  description: string;
  phone: string;
  image: string;
  ownerId: string;
}

const HeavyEquipment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'equipment'), orderBy('title'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const equipmentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as EquipmentItem[];
      setEquipment(equipmentData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'equipment');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType ? item.type === selectedType : true;
    return matchesSearch && matchesType;
  });

  // Seeding logic for demo purposes
  useEffect(() => {
    const seedData = async () => {
      const isAdmin = user?.email === 'academy@codezero.ge';
      if (!loading && equipment.length === 0 && searchTerm === '' && !selectedType && isAdmin) {
        const { addDoc, collection } = await import('firebase/firestore');
        const HEAVY_EQUIPMENT_DATA = [
          {
            title: 'JCB 3CX ექსკავატორი-დამტვირთველი',
            type: 'excavator',
            location: 'თბილისი, დიღომი',
            price: '80 ₾/სთ',
            description: 'გთავაზობთ JCB 3CX მომსახურებას. გამოცდილი ოპერატორით. ვმუშაობთ ნებისმიერ სირთულეზე.',
            phone: '+995 599 00 00 01',
            image: 'https://picsum.photos/seed/excavator/800/600',
            ownerId: 'system'
          },
          {
            title: 'XCMG 25 ტონიანი ამწე',
            type: 'crane',
            location: 'ბათუმი',
            price: '150 ₾/სთ',
            description: '25 ტონიანი ამწის მომსახურება. ისრის სიგრძე 34 მეტრი. სრული ტექნიკური გამართულობა.',
            phone: '+995 599 00 00 02',
            image: 'https://picsum.photos/seed/crane/800/600',
            ownerId: 'system'
          },
          {
            title: 'CAT D6 ბულდოზერი',
            type: 'bulldozer',
            location: 'ქუთაისი',
            price: '120 ₾/სთ',
            description: 'მიწის სამუშაოები, ტერიტორიის მოსწორება. CAT D6 საუკეთესო მდგომარეობაში.',
            phone: '+995 599 00 00 03',
            image: 'https://picsum.photos/seed/bulldozer/800/600',
            ownerId: 'system'
          }
        ];

        for (const item of HEAVY_EQUIPMENT_DATA) {
          try {
            await addDoc(collection(db, 'equipment'), item);
          } catch (e) {
            console.error('Error seeding equipment:', e);
          }
        }
      }
    };
    seedData();
  }, [loading, equipment.length, searchTerm, selectedType]);

  const handleContact = (ownerId: string) => {
    if (!user) {
      toast.error('გთხოვთ გაიაროთ ავტორიზაცია');
      navigate('/login');
      return;
    }
    navigate(`/messages?chatWith=${ownerId}`);
  };

  return (
    <div className="space-y-12 md:space-y-24 pb-24">
      {/* Hero Section - More Immersive */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center px-6 md:px-12 rounded-3xl md:rounded-[4rem] overflow-hidden bg-slate-950 text-white shadow-3xl mx-4 md:mx-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/90 to-amber-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-screen-2xl w-full mx-auto space-y-8 md:space-y-10 py-12 md:py-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-amber-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            სპეცტექნიკის პლატფორმა
          </motion.div>
          
          <div className="space-y-4 md:space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[-0.04em] font-display leading-[0.9] md:leading-[0.85] text-balance"
            >
              მძიმე ტექნიკის <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">მომსახურება</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-base md:text-2xl text-slate-400 max-w-2xl leading-relaxed font-medium"
            >
              იპოვეთ საუკეთესო სპეცტექნიკა და გამოცდილი ოპერატორები ნებისმიერი სირთულის პროექტისთვის მთელი საქართველოს მასშტაბით.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 items-start sm:items-center"
          >
            <Button asChild size="lg" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white rounded-full px-10 md:px-12 h-14 md:h-16 text-lg md:text-xl font-black shadow-[0_20px_50px_rgba(245,158,11,0.3)] transition-all hover:scale-105 active:scale-95"><a href="/create-post">განცხადების დამატება</a></Button>
            
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-2 pr-6 rounded-full">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center overflow-hidden ring-2 ring-amber-500/20">
                    <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <div className="text-[10px] md:text-xs font-bold text-slate-300">
                <span className="text-amber-500 block text-xs md:text-sm font-black">+500</span>
                აქტიური ოპერატორი
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section - Floating Glassmorphism */}
      <section className="sticky top-16 md:top-20 z-40 px-4">
        <div className="max-w-screen-2xl mx-auto">
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-2 md:p-4 rounded-3xl md:rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.1)] border border-white/40 dark:border-white/10 flex flex-col lg:flex-row gap-3 md:gap-4 items-center">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 h-4 md:h-5 w-4 md:w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
              <Input 
                placeholder="ძებნა..." 
                className="pl-12 md:pl-16 h-12 md:h-16 rounded-2xl md:rounded-[2rem] border-none bg-slate-100/50 dark:bg-slate-800/50 focus-visible:ring-2 focus-visible:ring-amber-500 text-base md:text-lg font-bold placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0 w-full lg:w-auto no-scrollbar scroll-smooth">
              <Button 
                variant={selectedType === null ? 'default' : 'ghost'} 
                onClick={() => setSelectedType(null)}
                className={`rounded-xl md:rounded-2xl h-12 md:h-16 px-6 md:px-8 font-black uppercase tracking-widest text-[9px] md:text-[10px] transition-all ${
                  selectedType === null 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30' 
                    : 'bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                ყველა
              </Button>
              {EQUIPMENT_TYPES.map(type => (
                <Button 
                  key={type.id}
                  variant={selectedType === type.id ? 'default' : 'ghost'} 
                  onClick={() => setSelectedType(type.id)}
                  className={`rounded-xl md:rounded-2xl h-12 md:h-16 px-6 md:px-8 font-black uppercase tracking-widest text-[9px] md:text-[10px] gap-2 md:gap-3 whitespace-nowrap transition-all ${
                    selectedType === type.id 
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30' 
                      : 'bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {React.cloneElement(type.icon as React.ReactElement, { className: "h-4 w-4 md:h-5 md:w-5" })}
                  {type.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section - Fluid & Premium */}
      <section className="px-4 md:px-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[550px] bg-slate-100 dark:bg-slate-800 rounded-[3rem] animate-pulse" />
              ))
            ) : filteredEquipment.length > 0 ? (
              filteredEquipment.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                >
                  <Card className="rounded-3xl md:rounded-[3.5rem] border-none shadow-sm hover:shadow-[0_40px_80px_rgba(0,0,0,0.12)] transition-all duration-700 group overflow-hidden bg-white dark:bg-slate-900 h-full flex flex-col relative">
                    <div className="relative aspect-[16/11] overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="absolute top-6 left-6 md:top-8 md:left-8">
                        <div className="px-4 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-amber-600 dark:text-amber-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border border-white/20">
                          {EQUIPMENT_TYPES.find(t => t.id === item.type)?.name}
                        </div>
                      </div>
                      
                      <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="px-6 py-3 md:px-8 md:py-4 rounded-2xl md:rounded-3xl bg-amber-500 text-white font-black text-lg md:text-xl shadow-[0_20px_40px_rgba(245,158,11,0.4)]">
                          {item.price}
                        </div>
                      </div>
                    </div>
                    
                    <CardHeader className="p-6 md:p-10 pb-4 cursor-pointer" onClick={() => navigate(`/equipment/${item.id}`)}>
                      <div className="flex justify-between items-start gap-4">
                        <CardTitle className="text-2xl md:text-3xl font-black tracking-tighter group-hover:text-amber-500 transition-colors leading-[1.1]">
                          {item.title}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-400 text-xs md:text-sm font-bold mt-3 md:mt-4">
                        <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-500" />
                        </div>
                        {item.location}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6 md:p-10 pt-0 flex-1 flex flex-col justify-between space-y-6 md:space-y-10">
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 font-medium text-base md:text-lg cursor-pointer" onClick={() => navigate(`/equipment/${item.id}`)}>
                        {item.description}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 pt-6 md:pt-8 border-t border-slate-100 dark:border-slate-800">
                        <Button 
                          variant="outline" 
                          className="w-full sm:flex-1 rounded-xl md:rounded-2xl h-12 md:h-16 font-black uppercase tracking-widest text-[9px] md:text-[10px] border-2 border-slate-100 dark:border-slate-800 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600 hover:border-amber-200 transition-all"
                          onClick={() => navigate(`/equipment/${item.id}`)}
                        >
                          <Info className="h-4 w-4 mr-2 md:mr-3" />
                          დეტალები
                        </Button>
                        <Button 
                          className="w-full sm:flex-1 rounded-xl md:rounded-2xl h-12 md:h-16 font-black uppercase tracking-widest text-[9px] md:text-[10px] bg-slate-950 hover:bg-slate-800 text-white shadow-2xl shadow-slate-200 dark:shadow-none transition-all hover:scale-[1.02]"
                          onClick={() => handleContact(item.ownerId)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2 md:mr-3" />
                          მიწერა
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-40 text-center space-y-8 bg-white dark:bg-slate-900 rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
                <div className="h-32 w-32 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-200 dark:text-slate-700 shadow-inner">
                  <Construction className="h-16 w-16" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">ტექნიკა არ მოიძებნა</h3>
                  <p className="text-slate-400 text-lg font-medium max-w-md mx-auto">სცადეთ სხვა საძიებო პარამეტრები ან მდებარეობა</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => { setSearchTerm(''); setSelectedType(null); }}
                  className="rounded-full px-12 h-14 font-black uppercase tracking-widest text-[10px] border-2"
                >
                  ფილტრების გასუფთავება
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section - Premium Dark Design */}
      <section className="px-4 md:px-8">
        <div className="max-w-screen-2xl mx-auto bg-slate-950 rounded-[2.5rem] md:rounded-[5rem] p-8 md:p-24 text-white relative overflow-hidden shadow-3xl">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[160px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[120px]" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="space-y-6 md:space-y-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-amber-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                პარტნიორობა
              </div>
              <h2 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter font-display leading-[0.9] md:leading-[0.85] text-balance">
                გაქვთ მძიმე <br />
                ტექნიკა? <span className="text-amber-500">მიიღეთ</span> <br />
                შეკვეთები
              </h2>
              <p className="text-slate-400 text-lg md:text-2xl leading-relaxed max-w-xl mx-auto lg:mx-0">
                დაამატეთ თქვენი ტექნიკა ჩვენს პლატფორმაზე და მიიღეთ შეკვეთები ყოველდღიურად. CargoConnect GE გეხმარებათ ბიზნესის ზრდაში.
              </p>
              <Button asChild size="lg" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white rounded-full px-12 md:px-16 h-16 md:h-20 text-xl md:text-2xl font-black shadow-[0_25px_60px_rgba(245,158,11,0.4)] transition-all hover:scale-105"><a href="/create-post">დაიწყეთ ახლა</a></Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {[
                { label: 'აქტიური ტექნიკა', value: '500+', color: 'text-amber-500' },
                { label: 'მხარდაჭერა', value: '24/7', color: 'text-blue-400' },
                { label: 'გამართული', value: '100%', color: 'text-emerald-400' },
                { label: 'საკომისიო', value: '0%', color: 'text-rose-400' }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -10 }}
                  className="bg-white/5 backdrop-blur-2xl p-8 md:p-10 rounded-3xl md:rounded-[3rem] border border-white/10 space-y-3 md:space-y-4 group transition-all hover:bg-white/10"
                >
                  <h4 className={`font-black text-4xl md:text-6xl tracking-tighter ${stat.color} group-hover:scale-110 transition-transform`}>{stat.value}</h4>
                  <p className="text-[9px] md:text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeavyEquipment;
