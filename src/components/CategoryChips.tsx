interface CategoryChipsProps {
  selected: string | null;
  onSelect: (cat: string) => void;
}

const categories = [
  { emoji: "🛒", label: "Consumer Dispute" },
  { emoji: "🏠", label: "Tenant/Property" },
  { emoji: "💼", label: "Workplace" },
  { emoji: "📋", label: "RTI Filing" },
  { emoji: "👩", label: "Domestic Violence" },
  { emoji: "👮", label: "Police Issue" },
  { emoji: "🏛️", label: "Govt Scheme" },
  { emoji: "🚗", label: "Accident/Vehicle" },
  { emoji: "⚖️", label: "Other" },
];

const CategoryChips = ({ selected, onSelect }: CategoryChipsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.label}
          onClick={() => onSelect(cat.label)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
            selected === cat.label
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-secondary text-secondary-foreground border-border hover:border-gold/50"
          }`}
        >
          <span>{cat.emoji}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryChips;
