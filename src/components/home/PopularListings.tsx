import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, MapPin, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import { Link } from "react-router-dom";

interface Equipment {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  imageUrl: string;
  category: string;
  rating?: number;
}

export function PopularListings() {
  const { t } = useTranslation();
  const [listings, setListings] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(
          collection(db, "equipment"),
          orderBy("createdAt", "desc"),
          limit(6)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Equipment[];
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">{t("popular.title", "პოპულარული სერვისები")}</h2>
            <p className="text-muted-foreground">{t("popular.subtitle", "აღმოაჩინეთ საუკეთესო სერვისები")}</p>
          </div>
          <Link to="/equipment">
            <Button variant="ghost" className="group">
              {t("popular.viewAll", "ყველას ნახვა")}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-10 bg-muted/30 rounded-3xl">
            <p className="text-muted-foreground">სერვისები ჯერ არ არის დამატებული.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -5 }}
                className="group bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <Link to={`/equipment/${item.id}`}>
                  <div className="aspect-video bg-muted relative">
                    <img
                      src={item.imageUrl || `https://picsum.photos/seed/${item.id}/800/600`}
                      alt={item.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                      {item.category}
                    </div>
                  </div>
                </Link>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Link to={`/equipment/${item.id}`}>
                      <h3 className="text-xl font-bold hover:text-primary transition-colors">{item.title}</h3>
                    </Link>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-bold">{item.rating || "4.9"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-lg font-bold text-primary">{item.price} ₾ / სთ</span>
                    <Link to={`/equipment/${item.id}`}>
                      <Button size="sm" variant="outline">{t("popular.bookNow", "დაჯავშნა")}</Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
