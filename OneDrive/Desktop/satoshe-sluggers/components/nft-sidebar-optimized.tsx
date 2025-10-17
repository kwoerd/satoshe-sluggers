"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { getTraitCounts, getRarityTiers } from "@/lib/data-service";

interface NFTSidebarProps {
  searchTerm: string;
  searchMode: string;
  selectedFilters: Record<string, string[]>;
  onSearchChange: (term: string) => void;
  onSearchModeChange: (mode: string) => void;
  onFilterChange: (filters: Record<string, string[]>) => void;
  onTraitCountsChange: (counts: Record<string, Record<string, number>>) => void;
}

// Filter category component
function FilterCategory({ 
  title, 
  color, 
  options, 
  twoColumns = false, 
  icon, 
  selected = [], 
  onChange, 
  traitCounts = {} 
}: {
  title: string;
  color: string;
  options: Array<{ value: string; display: string }>;
  twoColumns?: boolean;
  icon?: React.ReactNode;
  selected: string[];
  onChange: (selected: string[]) => void;
  traitCounts?: Record<string, number>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selected, value]);
    } else {
      onChange(selected.filter(item => item !== value));
    }
  };

  const colorClasses: Record<string, string> = {
    red: "text-red-400",
    blue: "text-blue-400", 
    green: "text-green-400",
    purple: "text-purple-400",
    yellow: "text-yellow-400",
    orange: "text-orange-400",
    cyan: "text-cyan-400",
  };

  return (
    <div className={`${isOpen ? 'pt-3 pb-3' : 'pt-1'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-neutral-100 py-2 focus:outline-none ${isOpen ? `border-b border-${color}-500 pb-2` : ''}`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          {icon && <span className={`${colorClasses[color]}`}>{icon}</span>}
          <h3 className={`font-normal text-sm ${isOpen ? colorClasses[color] : 'text-neutral-100'}`}>{title}</h3>
        </div>
        {isOpen ? (
          <ChevronDown className={`h-5 w-5 ${colorClasses[color]}`} />
        ) : (
          <ChevronRight className={`h-5 w-5 ${colorClasses[color]}`} />
        )}
      </button>

      {isOpen && (
        <div className={`mt-2 ${twoColumns ? 'grid grid-cols-2 gap-x-6 gap-y-1' : 'space-y-1'}`}>
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={selected.includes(option.value)}
                onCheckedChange={(checked) => handleOptionChange(option.value, checked as boolean)}
                className="sidebar-checkbox"
              />
              <label
                htmlFor={option.value}
                className="text-xs font-normal text-neutral-300 cursor-pointer flex-1 py-1 leading-tight w-full"
              >
                {option.display} ({traitCounts[option.value] || 0})
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Rarity tiers component
function RarityTiersCategory({ 
  title, 
  color, 
  icon, 
  selected = [], 
  onChange, 
  rarityTiers = [] 
}: {
  title: string;
  color: string;
  icon?: React.ReactNode;
  selected: string[];
  onChange: (selected: string[]) => void;
  rarityTiers: Array<{ tier: string; count: number; color: string }>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("commonToRare");

  const colorClasses: Record<string, string> = {
    red: "text-red-400",
    blue: "text-blue-400", 
    green: "text-green-400",
    purple: "text-purple-400",
    yellow: "text-yellow-400",
    orange: "text-orange-400",
    cyan: "text-cyan-400",
  };

  const handleOptionChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selected, value]);
    } else {
      onChange(selected.filter(item => item !== value));
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "commonToRare" ? "rareToCommon" : "commonToRare");
  };

  const sortedTiers = [...rarityTiers].sort((a, b) => {
    if (sortOrder === "commonToRare") {
      return b.count - a.count;
    } else {
      return a.count - b.count;
    }
  });

  return (
    <div className={`${isOpen ? 'pt-3 pb-3' : 'pt-1'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-neutral-100 py-2 focus:outline-none ${isOpen ? `border-b border-${color}-500 pb-2` : ''}`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          {icon && <span className={`${colorClasses[color]}`}>{icon}</span>}
          <h3 className={`font-normal text-sm ${isOpen ? colorClasses[color] : 'text-neutral-100'}`}>{title}</h3>
        </div>
        {isOpen ? (
          <ChevronDown className={`h-5 w-5 ${colorClasses[color]}`} />
        ) : (
          <ChevronRight className={`h-5 w-5 ${colorClasses[color]}`} />
        )}
      </button>

      {isOpen && (
        <>
          <div className="mb-3 mt-2 px-1">
            <span className="text-sm text-neutral-400 block mb-1">Sort by:</span>
            <button
              onClick={toggleSortOrder}
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700 transition-colors w-full justify-between"
            >
              <span className={colorClasses[color]}>
                {sortOrder === "commonToRare" ? "Most Common → Rarest" : "Rarest → Most Common"}
              </span>
            </button>
          </div>
          <div className="space-y-1">
            {sortedTiers.map((tier) => (
              <div key={tier.tier} className="flex items-center space-x-2">
                <Checkbox
                  id={tier.tier}
                  checked={selected.includes(tier.tier)}
                  onCheckedChange={(checked) => handleOptionChange(tier.tier, checked as boolean)}
                  className="sidebar-checkbox"
                />
                <label
                  htmlFor={tier.tier}
                  className="text-xs font-normal text-neutral-300 cursor-pointer flex-1 py-1 leading-tight w-full"
                >
                  {tier.tier} ({tier.count})
                </label>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function NFTSidebar({
  searchTerm,
  searchMode,
  selectedFilters,
  onSearchChange,
  onSearchModeChange,
  onFilterChange,
  onTraitCountsChange,
}: NFTSidebarProps) {
  const [traitCounts, setTraitCounts] = useState<Record<string, Record<string, number>>>({});
  const [rarityTiers, setRarityTiers] = useState<Array<{ tier: string; count: number; color: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load trait counts and rarity tiers
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [counts, tiers] = await Promise.all([
          getTraitCounts(),
          getRarityTiers()
        ]);
        setTraitCounts(counts);
        setRarityTiers(tiers);
        onTraitCountsChange(counts);
      } catch (error) {
        console.error('Error loading sidebar data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [onTraitCountsChange]);

  const handleFilterChange = (traitType: string, values: string[]) => {
    onFilterChange({
      ...selectedFilters,
      [traitType]: values,
    });
  };

  const clearAllFilters = () => {
    onSearchChange("");
    onSearchModeChange("contains");
    onFilterChange({});
  };

  if (isLoading) {
    return (
      <div className="w-80 bg-neutral-900 border border-neutral-700 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-800 rounded"></div>
          <div className="h-4 bg-neutral-800 rounded"></div>
          <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-neutral-900 border border-neutral-700 rounded-lg p-6 pb-8">
      <div className="space-y-6">
        {/* Search */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Search & Filter</h2>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Search NFTs..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-400"
            />
            <Select value={searchMode} onValueChange={onSearchModeChange}>
              <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="exact">Exact Match</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Rarity Tiers */}
        <RarityTiersCategory
          title="Rarity Tiers"
          color="orange"
          selected={selectedFilters["Rarity"] || []}
          onChange={(values) => handleFilterChange("Rarity", values)}
          rarityTiers={rarityTiers}
        />

        {/* Background */}
        <FilterCategory
          title="Background"
          color="blue"
          options={[
            { value: "Light Blue", display: "Light Blue" },
            { value: "Dark Blue", display: "Dark Blue" },
            { value: "Purple", display: "Purple" },
            { value: "Green", display: "Green" },
            { value: "Red", display: "Red" },
            { value: "Yellow", display: "Yellow" },
            { value: "Orange", display: "Orange" },
            { value: "Pink", display: "Pink" },
            { value: "Black", display: "Black" },
            { value: "White", display: "White" },
          ]}
          selected={selectedFilters["Background"] || []}
          onChange={(values) => handleFilterChange("Background", values)}
          traitCounts={traitCounts["Background"] || {}}
        />

        {/* Skin Tone */}
        <FilterCategory
          title="Skin Tone"
          color="yellow"
          options={[
            { value: "Darkest", display: "Darkest" },
            { value: "Dark", display: "Dark" },
            { value: "Medium Dark", display: "MedDark" },
            { value: "Medium", display: "Medium" },
            { value: "Medium Light", display: "MedLight" },
            { value: "Light", display: "Light" },
            { value: "Confetti", display: "Confetti" },
            { value: "Gold", display: "Gold" },
            { value: "Pink", display: "Pink" },
          ]}
          selected={selectedFilters["Skin Tone"] || []}
          onChange={(values) => handleFilterChange("Skin Tone", values)}
          traitCounts={traitCounts["Skin Tone"] || {}}
        />

        {/* Shirt */}
        <FilterCategory
          title="Shirt"
          color="red"
          options={[
            { value: "Red", display: "Red" },
            { value: "Blue", display: "Blue" },
            { value: "Green", display: "Green" },
            { value: "Yellow", display: "Yellow" },
            { value: "Purple", display: "Purple" },
            { value: "Orange", display: "Orange" },
            { value: "Pink", display: "Pink" },
            { value: "Black", display: "Black" },
            { value: "White", display: "White" },
          ]}
          selected={selectedFilters["Shirt"] || []}
          onChange={(values) => handleFilterChange("Shirt", values)}
          traitCounts={traitCounts["Shirt"] || {}}
        />

        {/* Hair */}
        <FilterCategory
          title="Hair"
          color="purple"
          options={[
            { value: "Ponytail Black", display: "Ponytail Black" },
            { value: "Ponytail Brown", display: "Ponytail Brown" },
            { value: "Ponytail Blonde", display: "Ponytail Blonde" },
            { value: "Ponytail Red", display: "Ponytail Red" },
            { value: "Short Black", display: "Short Black" },
            { value: "Short Brown", display: "Short Brown" },
            { value: "Short Blonde", display: "Short Blonde" },
            { value: "Short Red", display: "Short Red" },
            { value: "Long Black", display: "Long Black" },
            { value: "Long Brown", display: "Long Brown" },
            { value: "Long Blonde", display: "Long Blonde" },
            { value: "Long Red", display: "Long Red" },
          ]}
          selected={selectedFilters["Hair"] || []}
          onChange={(values) => handleFilterChange("Hair", values)}
          traitCounts={traitCounts["Hair"] || {}}
        />

        {/* Eyewear */}
        <FilterCategory
          title="Eyewear"
          color="cyan"
          options={[
            { value: "Eyeblack", display: "Eyeblack" },
            { value: "Sunglasses", display: "Sunglasses" },
            { value: "Glasses", display: "Glasses" },
            { value: "None", display: "None" },
          ]}
          selected={selectedFilters["Eyewear"] || []}
          onChange={(values) => handleFilterChange("Eyewear", values)}
          traitCounts={traitCounts["Eyewear"] || {}}
        />

        {/* Headwear */}
        <FilterCategory
          title="Headwear"
          color="orange"
          options={[
            { value: "Batters Helmet Black", display: "Batters Helmet Black" },
            { value: "Batters Helmet White", display: "Batters Helmet White" },
            { value: "Cap Black", display: "Cap Black" },
            { value: "Cap White", display: "Cap White" },
            { value: "Cap Red", display: "Cap Red" },
            { value: "Cap Blue", display: "Cap Blue" },
            { value: "None", display: "None" },
          ]}
          selected={selectedFilters["Headwear"] || []}
          onChange={(values) => handleFilterChange("Headwear", values)}
          traitCounts={traitCounts["Headwear"] || {}}
        />

        {/* Clear All Filters */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearAllFilters}
          className="text-sm font-normal flex items-center justify-center gap-2 h-9 w-full rounded border-neutral-600 bg-neutral-950/80 backdrop-blur-md hover:bg-neutral-900 hover:border-[#ff0099]/50 transition-all duration-200"
        >
          <X className="h-4 w-4" /> Clear All Filters
        </Button>
      </div>
    </div>
  );
}
