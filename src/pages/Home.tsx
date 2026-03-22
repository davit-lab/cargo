import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  Shield, 
  Clock, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Construction,
  Package,
  ChevronRight,
  Star,
  Users,
  Globe,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

import { useAuthStore } from '@/stores/useAuthStore';

const Home = () => {
  const { user, profile } = useAuthStore();
  const features = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: 'სწრაფი გადაზიდვა',
      description: 'იპოვეთ საუკეთესო მარშრუტები და მძღოლები თქვენი ტვირთისთვის წამებში.',
      color: 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'უსაფრთხოება',
      description: 'ყველა მძღოლი და კომპანია გადის ვერიფიკაციას უსაფრთხოების გარანტიისთვის.',
      color: 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: '24/7 მხარდაჭერა',
      description: 'ჩვენი გუნდი მზად არის დაგეხმაროთ ნებისმიერ დროს, ნებისმიერ საკითხზე.',
      color: 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
    },
    {
      icon: <Construction className="h-6 w-6" />,
      title: 'სპეცტექნიკა',
      description: 'მძიმე ტექნიკის ფართო არჩევანი ნებისმიერი სირთულის სამუშაოებისთვის.',
      color: 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
    }
  ];

  const stats = [
    { label: 'აქტიური მომხმარებელი', value: '10,000+', icon: <Users className="h-5 w-5" /> },
    { label: 'წარმატებული რეისი', value: '50,000+', icon: <CheckCircle2 className="h-5 w-5" /> },
    { label: 'ქალაქი საქართველოში', value: '60+', icon: <MapPin className="h-5 w-5" /> },
    { label: 'საერთაშორისო პარტნიორი', value: '15+', icon: <Globe className="h-5 w-5" /> },
  ];

  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/10 selection:text-primary overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.02] dark:opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="space-y-32 md:space-y-48 pb-32">
        {/* Hero Section - Editorial Style */}
        <section className="relative pt-16 md:pt-40 lg:pt-56">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-8 md:space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-primary/5 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10"
              >
                <Zap className="h-3 w-3 fill-primary" />
                #1 ლოჯისტიკური პლატფორმა საქართველოში
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="space-y-4 max-w-6xl w-full"
              >
                <h1 className="text-[12vw] sm:text-[10vw] lg:text-[8vw] font-black leading-[0.85] tracking-tighter uppercase break-words">
                  მართე <span className="text-primary italic font-serif normal-case tracking-normal">ლოჯისტიკა</span> <br />
                  ჭკვიანურად.
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-base md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed text-balance px-4"
              >
                CargoConnect GE აკავშირებს ტვირთის მფლობელებს, მძღოლებს და სპეცტექნიკის ოპერატორებს ერთიან, უსაფრთხო სივრცეში.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4"
              >
                <Button asChild size="lg" className="w-full sm:w-auto h-14 md:h-20 px-12 rounded-full text-base md:text-xl font-bold group shadow-2xl shadow-primary/20">
                  <Link to={profile?.role === 'owner' ? '/owner' : '/cargo'}>
                    {profile?.role === 'owner' ? 'მართვის პანელი' : 'დაიწყე ახლა'}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-14 md:h-20 px-12 rounded-full text-base md:text-xl font-bold border-2">
                  <Link to="/map">რუკის ნახვა</Link>
                </Button>
              </motion.div>
            </div>

            {/* Stats - Bento Style */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-12 md:mt-32"
            >
              {stats.map((stat, i) => (
                <div key={i} className="p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] bg-secondary/30 border border-border/50 flex flex-row sm:flex-col justify-between items-center sm:items-start gap-4 md:gap-6 group hover:bg-primary hover:text-primary-foreground transition-all duration-500">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-background flex items-center justify-center text-foreground group-hover:scale-110 transition-transform shrink-0">
                    {stat.icon}
                  </div>
                  <div className="space-y-1 text-right sm:text-left">
                    <p className="text-2xl md:text-5xl font-black tracking-tighter">{stat.value}</p>
                    <p className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold opacity-60">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Services Section - Visual Grid */}
        <section className="max-w-screen-2xl mx-auto px-4 md:px-6">
          <div className="space-y-12 md:space-y-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
              <div className="space-y-4 md:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest">
                  სერვისები
                </div>
                <h2 className="text-4xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase">
                  ყველაფერი <br />
                  <span className="text-muted-foreground/30">რაც გჭირდებათ.</span>
                </h2>
              </div>
              <Button variant="ghost" className="rounded-full font-bold group text-base md:text-lg h-14 md:h-16 px-6 md:px-8 hover:bg-primary/5">
                ყველას ნახვა <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { to: '/cargo', title: 'ტვირთები', desc: 'იპოვეთ საუკეთესო შემოთავაზებები ტვირთების გადასაზიდად.', icon: <Package />, img: 'truck-cargo' },
                { to: '/routes', title: 'რეისები', desc: 'დაამატეთ თქვენი მარშრუტი და იპოვეთ ტვირთები.', icon: <Truck />, img: 'highway' },
                { to: '/heavy-equipment', title: 'სპეცტექნიკა', desc: 'მძიმე ტექნიკის გაქირავება და მომსახურება.', icon: <Construction />, img: 'excavator-hero' }
              ].map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={service.to} className="group block relative aspect-[4/5] md:aspect-[3/4] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <img 
                      src={`https://picsum.photos/seed/${service.img}/800/1200`} 
                      alt={service.title} 
                      className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end space-y-4 md:space-y-6">
                      <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                        {service.icon}
                      </div>
                      <div className="space-y-1 md:space-y-2">
                        <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase">{service.title}</h3>
                        <p className="text-white/60 text-xs md:text-sm font-medium leading-relaxed max-w-[200px]">{service.desc}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Modern List */}
        <section className="bg-zinc-950 py-24 md:py-48 text-white overflow-hidden">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
              <div className="space-y-12 md:space-y-16">
                <div className="space-y-6 md:space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest">
                    რატომ ჩვენ?
                  </div>
                  <h2 className="text-4xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase">
                    მომავლის <br />
                    <span className="text-white/20">ლოჯისტიკა.</span>
                  </h2>
                </div>
                
                <div className="space-y-2 md:space-y-4">
                  {features.map((feature, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 md:gap-8 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] hover:bg-white/5 transition-colors group"
                    >
                      <div className={`h-12 w-12 md:h-16 md:w-16 rounded-2xl md:rounded-3xl flex items-center justify-center shrink-0 ${feature.color}`}>
                        {feature.icon}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg md:text-2xl font-bold tracking-tight">{feature.title}</h4>
                        <p className="text-white/40 font-medium text-sm md:text-base">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="aspect-square rounded-[4rem] overflow-hidden rotate-3 scale-110">
                  <img 
                    src="https://picsum.photos/seed/logistics-pro/1000/1000" 
                    alt="Logistics" 
                    className="w-full h-full object-cover opacity-50"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Floating Element */}
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-10 -left-10 p-12 rounded-[3rem] bg-white text-zinc-950 shadow-2xl space-y-4 max-w-xs -rotate-3"
                >
                  <div className="h-12 w-12 rounded-2xl bg-zinc-950 flex items-center justify-center text-white">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <p className="text-xl font-black tracking-tight uppercase">ვერიფიცირებული</p>
                  <p className="text-sm font-medium opacity-60">ყველა პარტნიორი გადის მკაცრ შემოწმებას პლატფორმაზე დაშვებამდე.</p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-screen-2xl mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-primary text-primary-foreground rounded-[2.5rem] md:rounded-[4rem] p-12 md:p-32 overflow-hidden text-center space-y-8 md:space-y-12"
          >
            <div className="space-y-4 md:space-y-6 relative z-10">
              <h2 className="text-4xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
                მზად ხარ <br /> 
                დასაწყებად?
              </h2>
              <p className="text-lg md:text-3xl font-medium opacity-80 max-w-3xl mx-auto px-4">
                შემოუერთდი 10,000-ზე მეტ პროფესიონალს და გახადე შენი ბიზნესი უფრო ეფექტური.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 relative z-10 px-4">
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto h-16 md:h-20 px-12 md:px-16 rounded-full text-lg md:text-xl font-bold group">
                <Link to="/login">
                  რეგისტრაცია
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-16 md:h-20 px-12 md:px-16 rounded-full text-lg md:text-xl font-bold border-white/20 hover:bg-white/10">
                <Link to="/profile">გაიგე მეტი</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Home;
