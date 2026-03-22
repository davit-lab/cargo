import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export function CategoriesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t("categories.title", "აირჩიე სერვისი")}</h2>
          <p className="text-muted-foreground">{t("categories.subtitle", "აირჩიეთ სასურველი კატეგორია და იპოვეთ საჭირო სერვისი")}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {/* Placeholder categories */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm text-center cursor-pointer"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-primary font-bold">C{i}</span>
              </div>
              <h3 className="font-medium">Category {i}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
