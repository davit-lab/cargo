import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Plus, Trash2, CheckCircle2, ShieldCheck, CreditCard as CardIcon, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Billing = () => {
  const [cards, setCards] = useState([
    { id: '1', last4: '4242', brand: 'Visa', expiry: '12/25', isDefault: true },
    { id: '2', last4: '5555', brand: 'Mastercard', expiry: '08/24', isDefault: false },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newCardData, setNewCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newCard = {
        id: Math.random().toString(),
        last4: newCardData.number.slice(-4) || '1234',
        brand: 'Visa',
        expiry: newCardData.expiry || '01/28',
        isDefault: false
      };
      setCards([...cards, newCard]);
      setIsAdding(false);
      setLoading(false);
      setNewCardData({ number: '', expiry: '', cvc: '', name: '' });
      toast.success('ბარათი წარმატებით დაემატა');
    }, 1500);
  };

  const removeCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
    toast.success('ბარათი წაიშალა');
  };

  return (
    <div className="py-24 bg-background min-h-screen relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[140px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] -z-10" />

      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-20">
          
          {/* Left Side: Info */}
          <div className="w-full lg:w-1/3 space-y-12">
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10 shadow-sm"
              >
                <CreditCard className="h-3.5 w-3.5" />
                ფინანსები
              </motion.div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] font-display">
                ანგარიშსწორება
              </h1>
              <p className="text-muted-foreground text-xl md:text-2xl font-medium leading-relaxed max-w-md">
                მართეთ თქვენი გადახდის მეთოდები და ბარათები უსაფრთხოდ ერთ სივრცეში.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-6 p-8 bg-card/50 backdrop-blur-sm rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-xl transition-all duration-500 group">
                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-7 w-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-xl tracking-tight">დაცული ტრანზაქციები</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">თქვენი მონაცემები დაშიფრულია და დაცულია საერთაშორისო SSL სტანდარტებით.</p>
                </div>
              </div>
              <div className="flex items-start gap-6 p-8 bg-card/50 backdrop-blur-sm rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-xl transition-all duration-500 group">
                <div className="h-14 w-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-xl tracking-tight">მყისიერი გადახდა</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">პაკეტების გააქტიურება და სერვისებით სარგებლობა ხდება მომენტალურად.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Cards List & Add Form */}
          <div className="w-full lg:w-2/3 space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <AnimatePresence mode="popLayout">
                {cards.map((card) => (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                  >
                    <Card className="relative p-10 h-64 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-white overflow-hidden group rounded-[3rem] shadow-2xl border-none ring-1 ring-white/10">
                      <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                        <CardIcon className="h-48 w-48" />
                      </div>
                      
                      <div className="relative h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-40">ბარათის ტიპი</p>
                            <p className="font-black text-3xl italic tracking-tighter">{card.brand}</p>
                          </div>
                          {card.isDefault && (
                            <span className="bg-white/10 backdrop-blur-xl text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-white/20 shadow-lg">ნაგულისხმე</span>
                          )}
                        </div>

                        <div className="space-y-8">
                          <p className="text-2xl md:text-3xl font-mono tracking-[0.3em] text-white/90">•••• •••• •••• {card.last4}</p>
                          <div className="flex justify-between items-end">
                            <div className="space-y-1.5">
                              <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-40">ვადა</p>
                              <p className="font-black text-lg">{card.expiry}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-12 w-12 rounded-2xl text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all active:scale-90 border border-white/5 hover:border-red-400/20"
                              onClick={() => removeCard(card.id)}
                            >
                              <Trash2 className="h-6 w-6" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02, y: -8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAdding(true)}
                className="h-64 rounded-[3rem] border-4 border-dashed border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-8 group bg-card/30 backdrop-blur-sm"
              >
                <div className="h-20 w-20 bg-secondary rounded-[2rem] flex items-center justify-center group-hover:bg-primary/10 transition-all shadow-inner group-hover:scale-110">
                  <Plus className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="text-center space-y-2">
                  <span className="block font-black text-xl group-hover:text-primary transition-colors tracking-tight">ბარათის დამატება</span>
                  <span className="block text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">VISA, MASTERCARD, AMEX</span>
                </div>
              </motion.button>
            </div>

            {/* Add Card Form Modal-like Overlay */}
            <AnimatePresence>
              {isAdding && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 60, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 60, opacity: 0 }}
                    className="w-full max-w-4xl bg-card rounded-[4rem] shadow-[0_64px_128px_rgba(0,0,0,0.4)] overflow-hidden border border-white/10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      {/* Form Side */}
                      <div className="p-12 md:p-16 space-y-12">
                        <div className="flex justify-between items-center">
                          <div className="space-y-2">
                            <h3 className="text-4xl font-black tracking-tighter">ახალი ბარათი</h3>
                            <p className="text-muted-foreground font-medium">შეიყვანეთ ბარათის მონაცემები</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)} className="rounded-full md:hidden">
                            <X className="h-8 w-8" />
                          </Button>
                        </div>

                        <form onSubmit={handleAddCard} className="space-y-8">
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1">ბარათის მფლობელი</Label>
                            <Input 
                              placeholder="სახელი გვარი" 
                              className="h-16 rounded-2xl border-2 border-border/50 focus:border-primary transition-all font-bold text-lg bg-background/50"
                              value={newCardData.name}
                              onChange={(e) => setNewCardData({...newCardData, name: e.target.value})}
                              required 
                            />
                          </div>

                          <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1">ბარათის ნომერი</Label>
                            <div className="relative">
                              <Input 
                                placeholder="0000 0000 0000 0000" 
                                className="h-16 rounded-2xl border-2 border-border/50 pl-14 font-mono text-xl bg-background/50" 
                                value={newCardData.number}
                                onChange={(e) => setNewCardData({...newCardData, number: e.target.value})}
                                maxLength={19}
                                required 
                              />
                              <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1">ვადა</Label>
                              <Input 
                                placeholder="MM/YY" 
                                className="h-16 rounded-2xl border-2 border-border/50 font-mono text-xl bg-background/50" 
                                value={newCardData.expiry}
                                onChange={(e) => setNewCardData({...newCardData, expiry: e.target.value})}
                                maxLength={5}
                                required 
                              />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1">CVC</Label>
                              <Input 
                                placeholder="•••" 
                                type="password" 
                                maxLength={3} 
                                className="h-16 rounded-2xl border-2 border-border/50 font-mono text-xl bg-background/50" 
                                value={newCardData.cvc}
                                onChange={(e) => setNewCardData({...newCardData, cvc: e.target.value})}
                                required 
                              />
                            </div>
                          </div>

                          <div className="flex gap-6 pt-6">
                            <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="flex-1 h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] hidden md:block border-2">გაუქმება</Button>
                            <Button type="submit" className="flex-1 h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/30" disabled={loading}>
                              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'დამატება'}
                            </Button>
                          </div>
                        </form>
                      </div>

                      {/* Preview Side */}
                      <div className="hidden md:flex bg-secondary/20 p-16 flex-col items-center justify-center border-l border-border/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]" />
                        
                        <div className="text-center mb-16 space-y-3 relative z-10">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">ბარათის პრევიუ</p>
                          <p className="text-base text-muted-foreground font-medium">ასე გამოჩნდება თქვენი ბარათი</p>
                        </div>

                        <motion.div
                          animate={{ rotateY: newCardData.cvc ? 180 : 0 }}
                          transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 25 }}
                          className="w-full aspect-[1.6/1] relative preserve-3d perspective-[1000px]"
                        >
                          {/* Front */}
                          <div className="absolute inset-0 backface-hidden">
                            <Card className="w-full h-full p-10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-white rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.3)] border-none flex flex-col justify-between ring-1 ring-white/10">
                              <div className="flex justify-between items-start">
                                <div className="h-12 w-16 bg-white/10 rounded-xl backdrop-blur-xl border border-white/20 shadow-inner" />
                                <CardIcon className="h-12 w-12 opacity-40" />
                              </div>
                              <div className="space-y-8">
                                <p className="text-2xl font-mono tracking-[0.3em] text-white/90">
                                  {newCardData.number || '•••• •••• •••• ••••'}
                                </p>
                                <div className="flex justify-between items-end">
                                  <div className="space-y-1.5">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">მფლობელი</p>
                                    <p className="font-black text-sm uppercase truncate max-w-[180px] tracking-tight">{newCardData.name || 'NAME SURNAME'}</p>
                                  </div>
                                  <div className="space-y-1.5 text-right">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">ვადა</p>
                                    <p className="font-black text-sm">{newCardData.expiry || 'MM/YY'}</p>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
