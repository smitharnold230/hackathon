import { useEffect, useState } from "react";

// Define the type for a category
type Category = {
  id: number;
  name: string;
};

type CategorySectionProps = {
  onSelect: (cat: Category | null) => void;
};

export default function CategorySection({ onSelect }: CategorySectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<Category | null>(null);

  useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
      .then((res) => res.json())
      .then((data) => setCategories(data.trivia_categories));
  }, []);

  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      <button
        className={`px-3 py-1 rounded ${selected === null ? "bg-purple-700 text-white" : "bg-[#232336] text-purple-300"}`}
        onClick={() => {
          setSelected(null);
          onSelect(null);
        }}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`px-3 py-1 rounded ${selected?.id === cat.id ? "bg-purple-700 text-white" : "bg-[#232336] text-purple-300"}`}
          onClick={() => {
            setSelected(cat);
            onSelect(cat);
          }}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}