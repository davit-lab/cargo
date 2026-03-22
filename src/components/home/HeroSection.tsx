import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { db } from '@/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';

export function HeroSection() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
  });

  const locations = [
    'თბილისი',
    'ბათუმი',
    'ქუთაისი',
    'რუსთავი',
    'გორი',
    'ზუგდიდი',
    'ფოთი',
  ];

  const getCategoryName = (cat: any) => {
    if (i18n.language === 'ka') return cat.name_ka || cat.name;
    if (i18n.language === 'ru') return cat.name_ru || cat.name;
    return cat.name;
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (location) params.set('location', location);
    if (searchQuery) params.set('q', searchQuery);
    navigate(`/equipment?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-primary/10 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-accent/10 blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--muted-foreground)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--muted-foreground)/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>{t('hero.badge', 'საქართველოს #1 სერვისის პლატფორმა')}</span>
              <Zap className="h-4 w-4" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 leading-[1.1] tracking-tight"
          >
            <span className="text-foreground">{t('hero.titlePart1', 'იპოვე სასურველი')}</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              {t('hero.titlePart2', 'სერვისი ადვილად')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            {t('hero.subtitle', 'აღმოაჩინე საუკეთესო სერვისები საქართველოში - სწრაფად, მარტივად და უსაფრთხოდ')}
          </motion.p>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl opacity-50" />
            <div className="relative bg-card/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-border/50 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Search Input */}
                <div className="md:col-span-5">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={t('hero.searchPlaceholder', 'რას ეძებ?')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-14 text-base bg-background/50 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20"
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>

                {/* Location Select */}
                <div className="md:col-span-3">
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="h-14 bg-background/50 border-border/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <SelectValue placeholder={t('hero.locationPlaceholder', 'მდებარეობა')} />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Select */}
                <div className="md:col-span-3">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-14 bg-background/50 border-border/50 rounded-xl">
                      <SelectValue placeholder={t('hero.categoryPlaceholder', 'კატეგორია')} />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      {categories?.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.name || cat.name_ka || cat.id}>
                          {getCategoryName(cat)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Button */}
                <div className="md:col-span-1">
                  <Button
                    onClick={handleSearch}
                    className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                    size="lg"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-3 gap-4 sm:gap-12 mt-16"
          >
            {[
              { value: '500+', label: t('hero.stat1', 'სერვისი') },
              { value: '1000+', label: t('hero.stat2', 'მომხმარებელი') },
              { value: '50+', label: t('hero.stat3', 'ქალაქი') },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="text-center group cursor-default"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent transition-all duration-500">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex justify-center mt-12"
          >
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('/equipment')}
              className="group text-muted-foreground hover:text-foreground"
            >
              {t('hero.exploreAll', 'ყველა სერვისის ნახვა')}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
