import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

interface LocationInputProps {
  label: string;
  placeholder: string;
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
  defaultValue?: string;
}

// List of major Georgian cities with approximate coordinates
const GEORGIAN_CITIES = [
  { name: 'თბილისი', lat: 41.7151, lng: 44.8271 },
  { name: 'ბათუმი', lat: 41.6168, lng: 41.6367 },
  { name: 'ქუთაისი', lat: 42.2662, lng: 42.7180 },
  { name: 'რუსთავი', lat: 41.5438, lng: 45.0007 },
  { name: 'გორი', lat: 41.9842, lng: 44.1158 },
  { name: 'ზუგდიდი', lat: 42.5088, lng: 41.8709 },
  { name: 'ფოთი', lat: 42.1468, lng: 41.6720 },
  { name: 'თელავი', lat: 41.9191, lng: 45.4731 },
  { name: 'ხაშური', lat: 41.9941, lng: 43.5992 },
  { name: 'სამტრედია', lat: 42.1625, lng: 42.3417 },
  { name: 'ზესტაფონი', lat: 42.1083, lng: 43.0333 },
  { name: 'მარნეული', lat: 41.4750, lng: 44.8122 },
];

export const LocationInput = ({ label, placeholder, onLocationSelect, defaultValue }: LocationInputProps) => {
  const [value, setValue] = React.useState(defaultValue || '');
  const [suggestions, setSuggestions] = React.useState<typeof GEORGIAN_CITIES>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    
    if (val.length > 0) {
      const filtered = GEORGIAN_CITIES.filter(city => 
        city.name.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (city: typeof GEORGIAN_CITIES[0]) => {
    setValue(city.name);
    setSuggestions([]);
    onLocationSelect({
      address: city.name,
      lat: city.lat,
      lng: city.lng
    });
  };

  return (
    <div className="space-y-2 relative">
      <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-4 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        {label}
      </Label>
      <Input
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-2 border-slate-100 dark:border-slate-800 focus-visible:ring-primary text-xl md:text-2xl font-bold bg-white/50 dark:bg-slate-800/50 px-8 md:px-10 transition-all shadow-sm"
      />
      {suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {suggestions.map((city) => (
            <button
              key={city.name}
              type="button"
              onClick={() => handleSelect(city)}
              className="w-full px-8 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-lg transition-colors border-b last:border-none border-slate-100 dark:border-slate-800"
            >
              {city.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
