import React from 'react';
import { Github, Globe, Mail, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-8 mt-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-slate-800">InfoPintar SMP</h3>
            <p className="text-sm text-slate-500 mt-1">Platform Belajar Informatika Interaktif</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Dikembangkan Oleh</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border border-slate-200">
                 {/* Placeholder Avatar */}
                 <span className="font-bold text-slate-500 text-xs">DEV</span>
              </div>
              <div className="text-right">
                 <p className="text-sm font-bold text-slate-700">Tim Pengembang</p>
                 <p className="text-xs text-slate-500">Fullstack Engineer</p>
              </div>
            </div>
            
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-slate-400 hover:text-emerald-600 transition-colors" aria-label="Website">
                <Globe size={18} />
              </a>
              <a href="#" className="text-slate-400 hover:text-red-500 transition-colors" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-100 mt-8 pt-6 text-center">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} InfoPintar SMP. Hak Cipta Dilindungi. <br className="md:hidden"/>
            Dibuat dengan ❤️ untuk Pendidikan Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
};