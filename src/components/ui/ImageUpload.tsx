import React, { useState, useRef } from 'react';
import { Camera, X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  images, 
  onChange, 
  maxImages = 5 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    const remainingSlots = maxImages - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        // Skip files larger than 2MB for base64 storage
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onChange([...images, base64String]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files) as File[];
    processFiles(files);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">ფოტოები ({images.length}/{maxImages})</h4>
          <p className="text-[10px] text-muted-foreground font-medium">ატვირთეთ მაქსიმუმ {maxImages} ფოტო (თითოეული მაქს. 2MB)</p>
        </div>
        {images.length < maxImages && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl font-bold h-10 px-4"
          >
            <Upload className="h-4 w-4 mr-2" />
            დამატება
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <AnimatePresence mode="popLayout">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square rounded-3xl overflow-hidden group shadow-sm border border-border"
            >
              <img 
                src={img} 
                alt={`Upload ${idx}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-10 w-10 rounded-full shadow-xl"
                  onClick={() => removeImage(idx)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          ))}
          
          {images.length < maxImages && (
            <motion.div
              layout
              onClick={() => fileInputRef.current?.click()}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`aspect-square rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group ${
                isDragging 
                  ? 'border-primary bg-primary/5 scale-95' 
                  : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                <ImageIcon className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">ატვირთვა</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />
    </div>
  );
};
