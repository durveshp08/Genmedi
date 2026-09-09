import React from "react";
import { Pill, HeartPulse, Flame, ShieldAlert, Sparkles, Wind, Stethoscope } from "lucide-react";

interface MobileQuickCategoriesProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const MobileQuickCategories: React.FC<MobileQuickCategoriesProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const categories = [
    { id: "all", label: "All Generics", icon: Sparkles },
    { id: "Antibiotic", label: "Antibiotics", icon: Pill },
    { id: "Antidiabetic", label: "Diabetes", icon: HeartPulse },
    { id: "Gastrointestinal", label: "Antacid & GI", icon: Flame },
    { id: "Allergy", label: "Allergy", icon: Wind },
    { id: "Cardiovascular", label: "Cardiac", icon: Stethoscope },
  ];

  return (
    <div className="overflow-x-auto no-scrollbar py-1 select-none">
      <div className="flex items-center gap-2 min-w-max px-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer min-h-[40px] shadow-2xs ${
                isSelected
                  ? "bg-[#006a61] text-white"
                  : "bg-white text-[#45464d] border border-[#dce9ff] hover:bg-[#eff4ff]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
