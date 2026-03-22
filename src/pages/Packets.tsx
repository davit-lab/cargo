import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Zap, Shield, Globe, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const postPackets = [
  {
    name: 'სტანდარტული',
    price: '5',
    description: 'ერთი განცხადების განთავსება 24 საათით',
    features: [
      'აქტიურია 24 საათი',
      'მყისიერი გამოქვეყნება',
      'რუკაზე გამოჩენა',
      'პირდაპირი კონტაქტი'
    ],
    icon: <Zap className="h-6 w-6" />,
    color: 'blue',
    badge: 'სწრაფი'
  },
  {
    name: 'პრემიუმი',
    price: '15',
    description: 'განცხადების განთავსება 7 დღით',
    features: [
      'აქტიურია 7 დღე',
      'პრიორიტეტული გამოჩენა',
      'რუკაზე გამოჩენა',
      'სტატისტიკის ნახვა',
      'სოც. მედია გაზიარება'
    ],
    icon: <Shield className="h-6 w-6" />,
    color: 'indigo',
    badge: 'პოპულარული'
  },
  {
    name: 'VIP პაკეტი',
    price: '50',
    description: 'ერთი განცხადების განთავსება 30 დღით',
    features: [
      'აქტიურია 30 დღე',
      'TOP პოზიცია სიაში',
      'გამოყოფილი ფერი',
      'პერსონალური მხარდაჭერა',
      'რუკაზე VIP მარკერი'
    ],
    icon: <Zap className="h-6 w-6" />,
    color: 'emerald',
    badge: 'საუკეთესო ფასი'
  },
  {
    name: 'ექსკლუზივი',
    price: '120',
    description: 'მაქსიმალური ხილვადობა 60 დღით',
    features: [
      'აქტიურია 60 დღე',
      'მუდმივი TOP პოზიცია',
      'SMS შეტყობინებები',
      'პრემიუმ ანალიტიკა',
      'VIP მხარდაჭერა 24/7'
    ],
    icon: <Globe className="h-6 w-6" />,
    color: 'amber',
    badge: 'მაქსიმალური'
  }
];

const Packets = () => {
  return (
    <div className="py-20 bg-background min-h-screen relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-primary/5 blur-[160px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[140px] -z-10" />
      
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-8"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            ტარიფები და პაკეტები
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black mb-8 text-gradient leading-[0.9] tracking-tighter"
          >
            აირჩიეთ თქვენი <br /> შესაძლებლობა
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto"
          >
            გაზარდეთ თქვენი ლოჯისტიკური ბიზნესის ხილვადობა და ეფექტურობა ჩვენი პრემიუმ სერვისებით.
          </motion.p>
        </div>

        {/* Post Packets */}
        <div className="mb-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="h-1.5 w-12 bg-emerald-500 rounded-full" />
                <span className="text-xs font-black uppercase tracking-widest text-emerald-500">ერთჯერადი</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">განცხადების პაკეტები</h2>
            </div>
            <p className="text-muted-foreground font-medium max-w-md">კონკრეტული განცხადების პოპულარიზაციისთვის და სწრაფი შედეგისთვის.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {postPackets.map((packet, index) => (
              <motion.div
                key={packet.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="p-10 h-full flex flex-col rounded-[3rem] border-2 border-border hover:border-primary/30 transition-all duration-500 bg-card group overflow-hidden relative shadow-sm hover:shadow-2xl">
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-${packet.color}-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000`} />
                  
                  <div className="flex items-start justify-between mb-10 relative z-10">
                    <div className={`h-16 w-16 rounded-2xl bg-${packet.color}-500/10 flex items-center justify-center text-${packet.color}-500 shadow-inner`}>
                      {packet.icon}
                    </div>
                    {packet.badge && (
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-${packet.color}-500/10 text-${packet.color}-500 border border-${packet.color}-500/20`}>
                        {packet.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 mb-10 relative z-10">
                    <h3 className="text-2xl font-black tracking-tighter">{packet.name}</h3>
                    <p className="text-muted-foreground text-xs font-medium leading-relaxed">{packet.description}</p>
                  </div>

                  <div className="mb-10 relative z-10">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-5xl font-black text-${packet.color}-500 tracking-tighter`}>{packet.price}₾</span>
                      <span className="text-muted-foreground font-bold text-sm uppercase tracking-widest">/პაკეტი</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-12 flex-grow relative z-10">
                    {packet.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <Check className={`h-4 w-4 text-${packet.color}-500 shrink-0`} />
                        <span className="text-xs font-bold text-foreground/70">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest bg-${packet.color}-500 hover:bg-${packet.color}-600 shadow-lg shadow-${packet.color}-500/20 relative z-10 transition-all active:scale-95`}>
                    არჩევა
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { icon: Shield, title: 'უსაფრთხოება', desc: 'ყველა ტრანზაქცია და მონაცემი დაცულია საერთაშორისო SSL სტანდარტებით.' },
            { icon: Globe, title: 'გლობალური წვდომა', desc: 'მართეთ თქვენი გადაზიდვები და ლოჯისტიკა მსოფლიოს ნებისმიერი წერტილიდან.' },
            { icon: Zap, title: 'სისწრაფე', desc: 'მყისიერი შეტყობინებები, სწრაფი ძიება და მარშრუტის ავტომატური ოპტიმიზაცია.' }
          ].map((item, idx) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-6 group"
            >
              <div className="h-20 w-20 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto group-hover:bg-primary/10 transition-colors duration-500 shadow-inner">
                <item.icon className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="space-y-3">
                <h4 className="text-2xl font-black tracking-tighter">{item.title}</h4>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Packets;
