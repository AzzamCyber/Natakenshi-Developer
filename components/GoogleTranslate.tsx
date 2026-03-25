"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronUp, Check } from "lucide-react";

// Daftar bahasa yang ingin ditampilkan
const languages = [
  { code: "id", name: "Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ms", name: "Malaysia", flag: "🇲🇾" },
  { code: "th", name: "Thailand", flag: "🇹🇭" },
];

export default function GoogleTranslate() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLang, setActiveLang] = useState("id");

  useEffect(() => {
    // 🔥 1. CSS SUPER STRICT: Membasmi elemen dari segala kemungkinan class Google
    const style = document.createElement("style");
    style.innerHTML = `
      /* Basmi Iframe Banner */
      iframe.goog-te-banner-frame, 
      .goog-te-banner-frame.skiptranslate, 
      .skiptranslate > iframe { 
        display: none !important; 
        visibility: hidden !important; 
        opacity: 0 !important;
        width: 0 !important; 
        height: 0 !important;
      }
      /* Cegah pergeseran Body */
      body { 
        top: 0px !important; 
        position: static !important; 
        min-height: 100vh !important; 
      }
      /* Sembunyikan Pop-up Highlight & Tooltip */
      #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
      .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
      /* Sembunyikan Widget Asli */
      #google_translate_element { display: none !important; }
    `;
    document.head.appendChild(style);

    // 🔥 2. MUTATION OBSERVER: Mengawasi DOM dari perubahan paksa Google
    // Jika Google maksa nambahin style "top: 40px" ke <body>, langsung kita hapus!
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          const body = document.body;
          if (body.style.top) {
            body.style.top = ''; // Hapus paksaan top: 40px
          }
          if (body.style.position === 'relative') {
            body.style.position = ''; // Hapus paksaan position relative
          }
        }
      });
    });

    // Mulai mengawasi elemen <body>
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    return () => {
      observer.disconnect(); // Matikan observer jika komponen dibongkar
      document.head.removeChild(style);
    };
  }, []);

  const handleTranslate = (langCode: string) => {
    setActiveLang(langCode);
    setIsOpen(false);

    // Cari elemen select asli milik Google yang sudah disembunyikan
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change")); // Pura-pura diklik
    }
  };

  return (
    <>
      {/* 👻 ENGINE GOOGLE TRANSLATE (DISEMBUNYIKAN) */}
      <div id="google_translate_element"></div>
      <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
      <Script id="google-translate-init" strategy="afterInteractive">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'id',
              includedLanguages: 'en,id,ms,th',
              autoDisplay: false
            }, 'google_translate_element');
          }
        `}
      </Script>

      {/* 💎 CUSTOM UI KITA (Eksklusif & Mewah) */}
      <div className="fixed bottom-6 left-6 z-[9000]">
        <AnimatePresence>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
              
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-0 mb-3 w-48 bg-[#0a0f1c]/90 border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden z-50 backdrop-blur-xl"
              >
                <div className="p-2 space-y-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleTranslate(lang.code)}
                      className={`w-full text-left px-4 py-3 text-sm transition-all flex items-center justify-between rounded-xl ${
                        activeLang === lang.code
                          ? "bg-brand-blue/20 text-brand-cyan font-bold border border-brand-blue/30"
                          : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg leading-none">{lang.flag}</span>
                        {lang.name}
                      </span>
                      {activeLang === lang.code && <Check className="w-4 h-4 text-brand-cyan" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group flex items-center gap-2 backdrop-blur-md border px-4 py-3 rounded-full shadow-2xl transition-all duration-300 ${
            isOpen ? "bg-brand-blue/10 border-brand-blue/50" : "bg-darker/80 border-white/10 hover:border-brand-blue/30"
          }`}
        >
          <Globe className={`w-5 h-5 ${isOpen ? "text-brand-cyan" : "text-gray-400 group-hover:text-brand-cyan"} transition-colors`} />
          <span className="text-sm font-bold text-white uppercase hidden sm:block">
            {languages.find((l) => l.code === activeLang)?.code}
          </span>
          <ChevronUp className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-brand-cyan" : ""}`} />
        </button>
      </div>
    </>
  );
}