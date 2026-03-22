import React from "react";
import { Link } from "react-router-dom";
import { Truck, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary text-primary-foreground p-2 rounded-xl group-hover:rotate-12 transition-transform duration-500">
                <Truck className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">
                CargoConnect<span className="text-primary">GE</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              საქართველოს წამყვანი ლოჯისტიკური პლატფორმა. ჩვენ ვაკავშირებთ ტვირთის მფლობელებს და გადამზიდველებს უსაფრთხო და ეფექტური გზით.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">პლატფორმა</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/cargo" className="text-muted-foreground hover:text-primary transition-colors">ტვირთები</Link></li>
              <li><Link to="/routes" className="text-muted-foreground hover:text-primary transition-colors">რეისები</Link></li>
              <li><Link to="/heavy-equipment" className="text-muted-foreground hover:text-primary transition-colors">სპეცტექნიკა</Link></li>
              <li><Link to="/map" className="text-muted-foreground hover:text-primary transition-colors">რუკა</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">კომპანია</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">ჩვენს შესახებ</Link></li>
              <li><Link to="/packets" className="text-muted-foreground hover:text-primary transition-colors">პაკეტები</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">კონტაქტი</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">დახმარება</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">საკონტაქტო</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-center gap-3 text-muted-foreground group">
                <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                info@cargoconnect.ge
              </li>
              <li className="flex items-center gap-3 text-muted-foreground group">
                <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                +995 555 123 456
              </li>
              <li className="flex items-center gap-3 text-muted-foreground group">
                <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <MapPin className="h-4 w-4" />
                </div>
                თბილისი, საქართველო
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            © {currentYear} CargoConnect Georgia. ყველა უფლება დაცულია.
          </p>
          <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary transition-colors">კონფიდენციალურობა</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">წესები და პირობები</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
