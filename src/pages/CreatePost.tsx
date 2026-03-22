import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LocationInput } from '@/components/maps/LocationInput';
import { 
  Truck, 
  Package, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  CreditCard,
  Phone,
  DollarSign,
  Construction,
  Zap,
  Shield,
  Globe,
  Scale,
  Box,
  Calendar,
  Layers,
  Settings2,
  Cpu
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageUpload } from '@/components/ui/ImageUpload';

const CreatePost = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'cargo' as 'cargo' | 'route' | 'equipment',
    title: '',
    origin: { address: '', lat: 0, lng: 0 },
    destination: { address: '', lat: 0, lng: 0 },
    description: '',
    price: '',
    contactPhone: '',
    paymentPlan: 'standard' as 'standard' | 'premium' | 'vip' | 'exclusive',
    equipmentType: 'excavator',
    images: [] as string[],
    // Detailed fields
    weight: '',
    volume: '',
    dimensions: { length: '', width: '', height: '' },
    cargoType: 'general',
    vehicleType: 'truck',
    loadingDate: '',
    unloadingDate: '',
    capacity: '',
    availableSpace: '',
    model: '',
    year: '',
    power: '',
    attachments: ''
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    const isEquipment = formData.type === 'equipment';
    const collectionName = isEquipment ? 'equipment' : 'posts';
    
    try {
      const dataToSave = isEquipment ? {
        title: formData.title,
        type: formData.equipmentType,
        location: formData.origin.address,
        price: `${formData.price} ₾/სთ`,
        description: formData.description,
        phone: formData.contactPhone,
        images: formData.images,
        image: formData.images[0] || `https://picsum.photos/seed/${formData.equipmentType}/800/600`,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      } : {
        ...formData,
        userId: user.uid,
        price: parseFloat(formData.price),
        status: 'active',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, collectionName), dataToSave);
      toast.success('განცხადება წარმატებით დაემატა');
      navigate(isEquipment ? '/heavy-equipment' : '/my-posts');
    } catch (error: any) {
      console.error('Error adding post:', error);
      handleFirestoreError(error, OperationType.CREATE, collectionName);
    } finally {
      setLoading(false);
    }
  };

  if (false) {
    return null;
  }

  return (
    <div className="min-h-screen relative py-8 md:py-16 px-4 overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
        {/* Decorative Background Elements - More Subtle & Premium */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[140px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px] -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/2 via-transparent to-transparent -z-10" />

        <div className="max-w-5xl mx-auto relative">
          {/* Progress Header - Refined & Responsive */}
          <div className="relative mb-12 md:mb-24 px-2 md:px-8">
            <div className="absolute top-7 left-0 w-full h-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary via-blue-500 to-emerald-400"
                initial={{ width: "0%" }}
                animate={{ width: `${((step - 1) / 2) * 100}%` }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="relative flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex flex-col items-center gap-3 md:gap-5">
                  <motion.div 
                    initial={false}
                    animate={{ 
                      scale: step === s ? 1.15 : 1,
                      backgroundColor: step >= s ? "var(--primary)" : "white",
                      color: step >= s ? "white" : "#94a3b8",
                      borderColor: step >= s ? "var(--primary)" : "#e2e8f0",
                      boxShadow: step === s ? "0 25px 50px -12px rgba(0,0,0,0.15)" : "none"
                    }}
                    className={`h-12 w-12 md:h-16 md:w-16 rounded-2xl md:rounded-3xl flex items-center justify-center font-black text-lg md:text-2xl transition-all duration-700 z-10 border-2 md:border-4 dark:border-slate-950`}
                  >
                    {step > s ? <CheckCircle2 className="h-6 w-6 md:h-8 md:w-8" /> : s}
                  </motion.div>
                  <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-700 ${step >= s ? 'text-primary opacity-100' : 'text-slate-400 opacity-60'}`}>
                    {s === 1 ? 'ტიპი' : s === 2 ? 'დეტალები' : 'გამოქვეყნება'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-12 md:space-y-20"
              >
                <div className="text-center space-y-6">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-8xl font-black tracking-[-0.05em] font-display leading-[0.85] text-balance"
                  >
                    აირჩიეთ <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">განცხადების</span> ტიპი
                  </motion.h2>
                  <p className="text-slate-500 text-lg md:text-2xl font-medium max-w-2xl mx-auto">რა ტიპის მომსახურების განთავსება გსურთ პლატფორმაზე?</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                  {[
                    { 
                      id: 'cargo', 
                      title: 'მაქვს ტვირთი', 
                      desc: 'ვეძებ გადამზიდველს ჩემი ტვირთისთვის', 
                      icon: Package, 
                      color: 'primary',
                      accent: 'blue'
                    },
                    { 
                      id: 'route', 
                      title: 'მაქვს რეისი', 
                      desc: 'ვეძებ ტვირთს ჩემი ავტომობილისთვის', 
                      icon: Truck, 
                      color: 'emerald',
                      accent: 'teal'
                    },
                    { 
                      id: 'equipment', 
                      title: 'სპეცტექნიკა', 
                      desc: 'ვთავაზობ მძიმე ტექნიკის მომსახურებას', 
                      icon: Construction, 
                      color: 'amber',
                      accent: 'orange'
                    }
                  ].map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ y: -15, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setFormData({ ...formData, type: item.id as any }); handleNext(); }}
                      className={`group relative p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] border-2 transition-all text-left flex flex-col justify-between h-[320px] md:h-[420px] overflow-hidden shadow-sm hover:shadow-2xl ${
                        formData.type === item.id 
                          ? `border-${item.color}-500 bg-${item.color}-50/50 dark:bg-${item.color}-950/20` 
                          : 'border-slate-100 bg-white dark:bg-slate-900 hover:border-primary/20'
                      }`}
                    >
                      {/* Glass Background Highlight */}
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 pointer-events-none" />
                      
                      <div className={`h-16 w-16 md:h-24 md:w-24 rounded-3xl md:rounded-[2rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-${item.color}-500 group-hover:bg-${item.color}-50 dark:group-hover:bg-${item.color}-500/10 transition-all duration-700 shadow-inner`}>
                        <item.icon className="h-8 w-8 md:h-12 md:w-12" />
                      </div>
                      
                      <div className="space-y-4 relative z-10">
                        <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-none group-hover:translate-x-2 transition-transform duration-500">{item.title}</h3>
                        <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed opacity-80">{item.desc}</p>
                      </div>

                      <div className="absolute -bottom-10 -right-10 opacity-[0.02] group-hover:opacity-[0.08] transition-all duration-1000 group-hover:scale-125 group-hover:-rotate-12">
                        <item.icon className="h-48 w-48 md:h-64 md:w-64" />
                      </div>
                      
                      <div className="absolute bottom-12 right-12 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                        <div className={`h-12 w-12 rounded-full bg-${item.color}-500 flex items-center justify-center text-white shadow-xl shadow-${item.color}-500/30`}>
                          <ArrowRight className="h-6 w-6" />
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-12 md:space-y-20"
              >
                <div className="text-center space-y-6">
                  <h2 className="text-5xl md:text-8xl font-black tracking-[-0.05em] font-display leading-[0.85] text-balance">
                    დეტალური <span className="text-primary">ინფორმაცია</span>
                  </h2>
                  <p className="text-slate-500 text-lg md:text-2xl font-medium max-w-2xl mx-auto">შეავსეთ განცხადების დეტალები მაქსიმალური სიზუსტით</p>
                </div>

                <div className="glass dark:glass-dark rounded-[3rem] md:rounded-[5rem] p-8 md:p-20 space-y-12 md:space-y-16 relative overflow-hidden">
                  {/* Decorative Gradient inside card */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  
                  {formData.type === 'equipment' ? (
                    <div className="space-y-10 md:space-y-14">
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-4">ტექნიკის დასახელება</Label>
                        <Input 
                          placeholder="მაგ: JCB 3CX ექსკავატორი" 
                          className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-2 border-slate-100 dark:border-slate-800 focus-visible:ring-primary text-xl md:text-2xl font-bold bg-white/50 dark:bg-slate-800/50 px-8 md:px-10 transition-all shadow-sm"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-4">ტიპი</Label>
                          <div className="relative group">
                            <select 
                              className="w-full h-16 md:h-20 rounded-2xl md:rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 px-8 md:px-10 text-xl md:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer shadow-sm"
                              value={formData.equipmentType}
                              onChange={(e) => setFormData({ ...formData, equipmentType: e.target.value })}
                            >
                              <option value="excavator">ექსკავატორი</option>
                              <option value="crane">ამწე</option>
                              <option value="bulldozer">ბულდოზერი</option>
                              <option value="loader">დამტვირთველი</option>
                              <option value="truck">თვითმცლელი</option>
                              <option value="roller">სატკეპნი</option>
                            </select>
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary transition-colors">
                              <ArrowRight className="h-6 w-6 rotate-90" />
                            </div>
                          </div>
                        </div>
                        <LocationInput 
                          label="მდებარეობა" 
                          placeholder="ქალაქი..." 
                          onLocationSelect={(loc) => setFormData({ ...formData, origin: loc })}
                          defaultValue={formData.origin.address}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-4 flex items-center gap-2">
                            <Settings2 className="h-4 w-4 text-primary" />
                            მოდელი
                          </Label>
                          <Input 
                            placeholder="მაგ: 2022" 
                            className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-2 border-slate-100 dark:border-slate-800 focus-visible:ring-primary text-xl md:text-2xl font-bold bg-white/50 dark:bg-slate-800/50 px-8 md:px-10 transition-all shadow-sm"
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                          />
                        </div>
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-4 flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-primary" />
                            სიმძლავრე (HP)
                          </Label>
                          <Input 
                            placeholder="მაგ: 100" 
                            className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-2 border-slate-100 dark:border-slate-800 focus-visible:ring-primary text-xl md:text-2xl font-bold bg-white/50 dark:bg-slate-800/50 px-8 md:px-10 transition-all shadow-sm"
                            value={formData.power}
                            onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                          />
                        </div>
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-4 flex items-center gap-2">
                            <Scale className="h-4 w-4 text-primary" />
                            წონა (ტ)
                          </Label>
                          <Input 
                            placeholder="მაგ: 8.5" 
                            className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-2 border-slate-100 dark:border-slate-800 focus-visible:ring-primary text-xl md:text-2xl font-bold bg-white/50 dark:bg-slate-800/50 px-8 md:px-10 transition-all shadow-sm"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        <LocationInput 
                          label="საიდან" 
                          placeholder="ქალაქი, ქუჩა..." 
                          onLocationSelect={(loc) => setFormData({ ...formData, origin: loc })}
                          defaultValue={formData.origin.address}
                        />
                        <LocationInput 
                          label="სად" 
                          placeholder="ქალაქი, ქუჩა..." 
                          onLocationSelect={(loc) => setFormData({ ...formData, destination: loc })}
                          defaultValue={formData.destination.address}
                        />
                      </div>

                      {formData.type === 'cargo' ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-4 flex items-center gap-2">
                              <Scale className="h-4 w-4 text-primary" />
                              წონა (კგ)
                            </Label>
                            <Input 
                              type="number"
                              placeholder="მაგ: 500" 
                              className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-2 border-slate-100 dark:border-slate-800 focus-visible:ring-primary text-xl md:text-2xl font-bold bg-white/50 dark:bg-slate-800/50 px-8 md:px-10 transition-all shadow-sm"
                              value={formData.weight}
                              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            />
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-4 flex items-center gap-2">
                              <Box className="h-4 w-4 text-primary" />
                              მოცულობა (მ³)
                            </Label>
                            <Input 
                              type="number"
                              placeholder="მაგ: 10" 
                              className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-2 border-slate-100 dark:border-slate-800 focus-visible:ring-primary text-xl md:text-2xl font-bold bg-white/50 dark:bg-slate-800/50 px-8 md:px-10 transition-all shadow-sm"
                              value={formData.volume}
                              onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                            />
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-4 flex items-center gap-2">
                              <Layers className="h-4 w-4 text-primary" />
                              ტიპი
                            </Label>
                            <div className="relative group">
                              <select 
                                className="w-full h-16 md:h-20 rounded-2xl md:rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 px-8 md:px-10 text-xl md:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer shadow-sm"
                                value={formData.cargoType}
                                onChange={(e) => setFormData({ ...formData, cargoType: e.target.value })}
                              >
                                <option value="general">სტანდარტული</option>
                                <option value="fragile">მსხვრევადი</option>
                                <option value="perishable">მალფუჭებადი</option>
                                <option value="hazardous">საშიში</option>
                                <option value="oversized">არაგაბარიტული</option>
                              </select>
                              <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary transition-colors">
                                <ArrowRight className="h-6 w-6 rotate-90" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-4 flex items-center gap-2">
                              <Truck className="h-4 w-4 text-primary" />
                              ავტომობილი
                            </Label>
                            <div className="relative group">
                              <select 
                                className="w-full h-16 md:h-20 rounded-2xl md:rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 px-8 md:px-10 text-xl md:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer shadow-sm"
                                value={formData.vehicleType}
                                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                              >
                                <option value="truck">სატვირთო</option>
                                <option value="van">მიკროავტობუსი</option>
                                <option value="refrigerated">მაცივარი</option>
                                <option value="platform">პლატფორმა</option>
                                <option value="tilt">ტენტი</option>
                              </select>
                              <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary transition-colors">
                                <ArrowRight className="h-6 w-6 rotate-90" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-4 flex items-center gap-2">
                              <Scale className="h-4 w-4 text-primary" />
                              ტვირთამწეობა (ტ)
                            </Label>
                            <Input 
                              type="number"
                              placeholder="მაგ: 20" 
                              className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-2 border-slate-100 dark:border-slate-800 focus-visible:ring-primary text-xl md:text-2xl font-bold bg-white/50 dark:bg-slate-800/50 px-8 md:px-10 transition-all shadow-sm"
                              value={formData.capacity}
                              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            />
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-4 flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              გასვლის თარიღი
                            </Label>
                            <Input 
                              type="date"
                              className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-2 border-slate-100 dark:border-slate-800 focus-visible:ring-primary text-xl md:text-2xl font-bold bg-white/50 dark:bg-slate-800/50 px-8 md:px-10 transition-all shadow-sm"
                              value={formData.loadingDate}
                              onChange={(e) => setFormData({ ...formData, loadingDate: e.target.value })}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-4">აღწერა</Label>
                    <Textarea 
                      placeholder="დაწერეთ დეტალები ტვირთის ან რეისის შესახებ..."
                      className="min-h-[220px] md:min-h-[280px] rounded-[2.5rem] md:rounded-[3.5rem] border-2 border-slate-100 dark:border-slate-800 focus-visible:ring-primary text-xl md:text-2xl font-bold bg-white/50 dark:bg-slate-800/50 p-8 md:p-12 transition-all shadow-sm leading-relaxed"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-4 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        ფასი (₾)
                      </Label>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-2 border-slate-100 dark:border-slate-800 focus-visible:ring-primary text-xl md:text-2xl font-bold bg-white/50 dark:bg-slate-800/50 px-8 md:px-10 transition-all shadow-sm"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-4 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        საკონტაქტო ნომერი
                      </Label>
                      <Input 
                        type="tel" 
                        placeholder="+995 5XX XX XX XX" 
                        className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-2 border-slate-100 dark:border-slate-800 focus-visible:ring-primary text-xl md:text-2xl font-bold bg-white/50 dark:bg-slate-800/50 px-8 md:px-10 transition-all shadow-sm"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="pt-6">
                    <ImageUpload 
                      images={formData.images}
                      onChange={(images) => setFormData({ ...formData, images })}
                      maxImages={5}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-6">
                  <Button 
                    variant="ghost" 
                    onClick={handleBack} 
                    className="rounded-full px-12 h-16 md:h-20 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                  >
                    <ArrowLeft className="mr-4 h-5 w-5 group-hover:-translate-x-2 transition-transform" /> უკან
                  </Button>
                  <Button 
                    onClick={handleNext} 
                    className="rounded-full px-16 h-16 md:h-20 font-black uppercase tracking-[0.2em] text-[10px] w-full sm:w-auto shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 group"
                  >
                    გაგრძელება <ArrowRight className="ml-4 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-12 md:space-y-20"
              >
                <div className="text-center space-y-6">
                  <h2 className="text-5xl md:text-8xl font-black tracking-[-0.05em] font-display leading-[0.85] text-balance">
                    გადახდა და <span className="text-emerald-500">გამოქვეყნება</span>
                  </h2>
                  <p className="text-slate-500 text-lg md:text-2xl font-medium max-w-2xl mx-auto">აირჩიეთ თქვენთვის სასურველი პაკეტი</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {[
                    { id: 'standard', title: 'სტანდარტული', price: '5', desc: 'აქტიურია 24 საათი', icon: Zap, color: 'blue' },
                    { id: 'premium', title: 'პრემიუმი', price: '15', desc: 'აქტიურია 7 დღე', icon: Shield, color: 'indigo' },
                    { id: 'vip', title: 'VIP', price: '50', desc: 'აქტიურია 30 დღე', icon: Zap, color: 'emerald' },
                    { id: 'exclusive', title: 'ექსკლუზივი', price: '120', desc: 'აქტიურია 60 დღე', icon: Globe, color: 'amber' }
                  ].map((plan) => (
                    <motion.button
                      key={plan.id}
                      whileHover={{ y: -10, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, paymentPlan: plan.id as any })}
                      className={`group relative p-8 md:p-10 rounded-[3rem] border-2 transition-all text-left space-y-6 overflow-hidden shadow-sm hover:shadow-xl ${
                        formData.paymentPlan === plan.id 
                          ? `border-${plan.color}-500 bg-${plan.color}-50/50 dark:bg-${plan.color}-950/20` 
                          : 'border-slate-100 bg-white dark:bg-slate-900 hover:border-primary/20'
                      }`}
                    >
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 pointer-events-none" />
                      
                      {formData.paymentPlan === plan.id && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`absolute top-6 right-6 text-${plan.color}-500`}
                        >
                          <CheckCircle2 className="h-8 w-8" />
                        </motion.div>
                      )}
                      
                      <div className="space-y-4 relative z-10">
                        <div className={`h-12 w-12 rounded-2xl bg-${plan.color}-500/10 flex items-center justify-center text-${plan.color}-500`}>
                          <plan.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-black tracking-tighter uppercase opacity-60">{plan.title}</h3>
                        <div className="flex items-baseline gap-1">
                          <span className={`text-4xl md:text-5xl font-black text-${plan.color}-500 tracking-tighter`}>{plan.price}</span>
                          <span className={`text-xl font-bold text-${plan.color}-500`}>₾</span>
                        </div>
                        <p className="text-slate-500 font-medium leading-relaxed text-sm">{plan.desc}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="glass dark:glass-dark rounded-[3rem] md:rounded-[5rem] p-8 md:p-20 space-y-12 relative overflow-hidden">
                  <div className="space-y-10">
                    <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-4 flex items-center gap-4">
                      <CreditCard className="h-6 w-6 text-primary" />
                      ბარათის მონაცემები
                    </Label>
                    <div className="space-y-8">
                      <Input 
                        placeholder="ბარათის ნომერი" 
                        className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-2 border-slate-100 dark:border-slate-800 focus-visible:ring-primary text-xl md:text-2xl font-bold bg-white/50 dark:bg-slate-800/50 px-8 md:px-10 transition-all shadow-sm" 
                      />
                      <div className="grid grid-cols-2 gap-8 md:gap-12">
                        <Input 
                          placeholder="MM/YY" 
                          className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-2 border-slate-100 dark:border-slate-800 focus-visible:ring-primary text-xl md:text-2xl font-bold bg-white/50 dark:bg-slate-800/50 px-8 md:px-10 transition-all shadow-sm" 
                        />
                        <Input 
                          placeholder="CVC" 
                          className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-2 border-slate-100 dark:border-slate-800 focus-visible:ring-primary text-xl md:text-2xl font-bold bg-white/50 dark:bg-slate-800/50 px-8 md:px-10 transition-all shadow-sm" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-6">
                  <Button 
                    variant="ghost" 
                    onClick={handleBack} 
                    className="rounded-full px-12 h-16 md:h-20 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                  >
                    <ArrowLeft className="mr-4 h-5 w-5 group-hover:-translate-x-2 transition-transform" /> უკან
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="rounded-full px-16 h-16 md:h-20 font-black uppercase tracking-[0.2em] text-[10px] w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 group"
                  >
                    {loading ? (
                      <span className="flex items-center gap-3">
                        <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        მუშავდება...
                      </span>
                    ) : (
                      <span className="flex items-center gap-4">
                        გადახდა და გამოქვეყნება <CheckCircle2 className="h-6 w-6 group-hover:scale-125 transition-transform" />
                      </span>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
  );
};

export default CreatePost;
