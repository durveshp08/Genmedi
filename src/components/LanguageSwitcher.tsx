import React from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#eff4ff] transition-colors text-xs">
        <Globe className="w-4 h-4 text-[#45464d]" />
        <span className="text-[#45464d]">{currentLanguage.flag} {currentLanguage.name}</span>
      </button>

      <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl border border-[#e5eeff] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`w-full px-3 py-2 text-left text-xs hover:bg-[#f8f9ff] transition-colors flex items-center gap-2 ${
              lang.code === i18n.language ? "bg-[#eff4ff] text-[#006a61] font-semibold" : "text-[#45464d]"
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
