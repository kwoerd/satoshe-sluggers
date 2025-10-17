"use client"

import React, { useState, useRef } from "react"
import { ChevronDown, ChevronRight, Search, X, ArrowDown, ArrowUp, ExternalLink } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// Removed unused Select components
// import { track } from '@vercel/analytics'; // Commented out - package not installed

// Stub analytics function to prevent errors
const track = (..._args: unknown[]) => {
  // Analytics tracking - implement as needed
};

// Helper function to shorten skin tone names for display
const shortenSkinToneName = (name: string): string => {
  const shortNames: Record<string, string> = {
    'Medium Dark': 'MedDark',
    'Medium Light': 'MedLight',
    'Medium': 'Medium',
    'Dark': 'Dark',
    'Light': 'Light',
    'Darkest': 'Darkest',
    'Confetti': 'Confetti',
    'Gold': 'Gold',
    'Pink': 'Pink'
  };
  return shortNames[name] || name;
};

// Create a context for filter reset functionality
interface FilterContextType {
  resetAllFilters: () => void;
  registerResetFunction: (_fn: () => void) => void;
  closeAllDropdowns: () => void;
  registerCloseFunction: (_fn: () => void) => void;
}

const defaultContextValue: FilterContextType = {
  resetAllFilters: () => {},
  registerResetFunction: (_fn: () => void) => {},
  closeAllDropdowns: () => {},
  registerCloseFunction: (_fn: () => void) => {},
};

export const FilterContext = React.createContext(defaultContextValue);

// Add prop types for FilterCategory
interface FilterCategoryProps {
  title: string;
  color: string;
  options: string[] | { value: string; display: string }[];
  twoColumns?: boolean;
  icon?: React.ReactNode;
}

// Add prop types for RarityTiersCategory
interface RarityTiersCategoryProps {
  title: string;
  color: string;
  icon?: React.ReactNode;
}

// Add prop types for FilterCategoryWithSubcategories
interface Subcategory {
  name: string;
  options: string[];
}
interface FilterCategoryWithSubcategoriesProps {
  title: string;
  color: string;
  subcategories: Subcategory[];
  twoColumns?: boolean;
  icon?: React.ReactNode;
}

// Filter category component with toggle functionality and persistent selections
function FilterCategory({ title, color, options, twoColumns = false, icon, selected = [], onChange, traitCounts = {} }: FilterCategoryProps & { selected: string[], onChange: (selected: string[]) => void, traitCounts?: Record<string, Record<string, number>> }) {
  const [isOpen, setIsOpen] = useState(false)
  const context = React.useContext(FilterContext) || defaultContextValue;
  const { registerResetFunction, registerCloseFunction } = context as FilterContextType;

  // Keep category open if it has active selections, but allow manual closing
  const _hasActiveSelections = selected && selected.length > 0;
  const shouldBeOpen = isOpen;

  // Register reset function
  React.useEffect(() => {
    registerResetFunction(() => {
      onChange([])
    })
  }, [registerResetFunction, onChange])

  // Register close function
  React.useEffect(() => {
    registerCloseFunction(() => {
      setIsOpen(false)
    })
  }, [registerCloseFunction])

  // Map color names to Tailwind classes - matching circular graph colors
  const colorClasses: Record<string, string> = {
    purple: "text-purple-400",
    blue: "text-blue-500",
    amber: "text-amber-500",
    red: "text-red-500",
    green: "text-emerald-500",
    cyan: "text-cyan-500",
    orange: "text-orange-500",
  }

  // Map color names to border classes for underlines
  const _borderColorClasses: Record<string, string> = {
    purple: "border-purple-400",
    blue: "border-blue-500",
    amber: "border-amber-500",
    red: "border-red-500",
    green: "border-emerald-500",
    cyan: "border-cyan-500",
    orange: "border-orange-500",
  }

  // Map color names to background classes for checkboxes - matching circular graph colors
  const bgColorClasses: Record<string, string> = {
    purple: "checked:bg-purple-500 checked:border-purple-500",
    blue: "checked:bg-blue-500 checked:border-blue-500",
    amber: "checked:bg-amber-500 checked:border-amber-500",
    red: "checked:bg-red-500 checked:border-red-500",
    green: "checked:bg-emerald-500 checked:border-emerald-500",
    cyan: "checked:bg-cyan-500 checked:border-cyan-500",
    orange: "checked:bg-orange-500 checked:border-orange-500",
  }

  const handleCheckboxChange = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((o) => o !== option))
      } else {
      onChange([...selected, option])
    }
  }

  return (
    <div className={`${shouldBeOpen ? 'pt-3 pb-3' : 'pt-1'}`}>
      <button
        onClick={() => {
          console.log('FilterCategory clicked:', title, 'Current state:', isOpen)
          setIsOpen(!isOpen)
        }}
        className={`w-full flex items-center justify-between text-neutral-100 py-2 focus:outline-none ${shouldBeOpen ? `border-b ${_borderColorClasses[color]} pb-2` : ''}`}
        aria-expanded={shouldBeOpen}
      >
        <div className="flex items-center gap-2">
          {icon && <span className={`${colorClasses[color]}`}>{icon}</span>}
          <h3 className={`font-normal text-sm ${shouldBeOpen ? colorClasses[color] : 'text-neutral-100'}`}>{title}</h3>
      </div>
        {shouldBeOpen ? (
          <ChevronDown className={`h-5 w-5 ${colorClasses[color]}`} />
        ) : (
          <ChevronRight className={`h-5 w-5 ${colorClasses[color]}`} />
        )}
      </button>

      {shouldBeOpen && (
        <div className={`mt-2 ${twoColumns ? 'grid grid-cols-2 gap-x-6 gap-y-1' : 'space-y-1'}`}>
          {(options as (string | { value: string; display: string })[]).map((option) => {
            const optValue = typeof option === 'string' ? option : option.value;
            const optDisplay = typeof option === 'string' ? option : option.display;
                    return (
              <div key={optValue} className="flex items-center">
                <div className="relative flex items-center w-full">
                  <input
                    type="checkbox"
                    id={optValue}
                    checked={selected?.includes(optValue) ?? false}
                    onChange={() => handleCheckboxChange(optValue)}
                    className={`sidebar-checkbox mr-2 appearance-none w-4 h-4 min-w-[16px] min-h-[16px] flex-shrink-0 rounded-sm border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-${color}-400 focus:ring-offset-0 transition-colors relative ${bgColorClasses[color]} checked:after:content-['✓'] checked:after:text-white checked:after:text-[10px] checked:after:font-light checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center`}
                  />
                  <label
                    htmlFor={optValue}
                    className="text-xs text-neutral-300 cursor-pointer py-0.5 pl-6 pr-1 -ml-6 block w-full"
                  >
                    <div className="grid grid-cols-2 gap-x-4 items-center">
                      <span className="text-left whitespace-nowrap">{optDisplay}</span>
                      {(() => {
                        const key = title === "Background" ? "background"
                          : title === "Skin Tone" ? "skinTone"
                          : title === "Shirt" ? "shirt"
                          : title === "Eyewear" ? "eyewear"
                          : title === "Rarity Tiers" ? "rarity"
                          : title.toLowerCase();
                        const count = traitCounts[key]?.[optValue];
                        return (
                          <span className={`${colorClasses[color]} text-xs font-normal text-right font-mono`}>
                            {count ? `(${count})` : ''}
                          </span>
                        );
                      })()}
                    </div>
                  </label>
                </div>
                      </div>
                    )
                  })}
                </div>
      )}
    </div>
  )
}

// Special component for Rarity Tiers with sorting toggle
function RarityTiersCategory({ title, color, icon, selected = [], onChange, traitCounts = {} }: RarityTiersCategoryProps & { selected: string[], onChange: (selected: string[]) => void, traitCounts?: Record<string, Record<string, number>> }) {
  const [isOpen, setIsOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState("commonToRare")
  const context = React.useContext(FilterContext) || defaultContextValue;
  const { registerResetFunction, registerCloseFunction } = context as FilterContextType;

  React.useEffect(() => {
    registerResetFunction(() => {
      onChange([])
      setSortOrder("commonToRare")
    })
  }, [registerResetFunction, onChange])

  // Register close function
  React.useEffect(() => {
    registerCloseFunction(() => {
      setIsOpen(false)
    })
  }, [registerCloseFunction])

  // Rarity tiers in order from common to rare
  // These should match the actual rarity_tier values in the metadata
  const commonToRareOptions = [
    { value: "Ground Ball", display: "Ground Ball" },
    { value: "Base Hit", display: "Base Hit" },
    { value: "Double", display: "Double" },
    { value: "Stand-Up Double", display: "Stand-Up Double" },
    { value: "Line Drive", display: "Line Drive" },
    { value: "Triple", display: "Triple" },
    { value: "Pinch Hit Home Run", display: "Pinch Hit Home Run" },
    { value: "Home Run", display: "Home Run" },
    { value: "Over-the-Fence Shot", display: "Over-the-Fence Shot" },
    { value: "Walk-Off Home Run", display: "Walk-Off Home Run" },
    { value: "Grand Slam (Ultra-Legendary)", display: "Grand Slam" },
  ]

  // Get the current options based on sort order
  const currentOptions = sortOrder === "commonToRare" ? commonToRareOptions : [...commonToRareOptions].reverse()

  // Map color names to Tailwind classes - matching circular graph colors
  const colorClasses: Record<string, string> = {
    purple: "text-purple-400",
    blue: "text-blue-500",
    amber: "text-amber-500",
    red: "text-red-500",
    green: "text-emerald-500",
    cyan: "text-cyan-500",
    orange: "text-orange-500",
  }

  // Map color names to border classes for underlines
  const _borderColorClasses: Record<string, string> = {
    purple: "border-purple-400",
    blue: "border-blue-500",
    amber: "border-amber-500",
    red: "border-red-500",
    green: "border-emerald-500",
    cyan: "border-cyan-500",
    orange: "border-orange-500",
  }

  // Map color names to background classes for checkboxes - matching circular graph colors
  const bgColorClasses: Record<string, string> = {
    purple: "checked:bg-purple-500 checked:border-purple-500",
    blue: "checked:bg-blue-500 checked:border-blue-500",
    amber: "checked:bg-amber-500 checked:border-amber-500",
    red: "checked:bg-red-500 checked:border-red-500",
    green: "checked:bg-emerald-500 checked:border-emerald-500",
    cyan: "checked:bg-cyan-500 checked:border-cyan-500",
    orange: "checked:bg-orange-500 checked:border-orange-500",
  }

  const handleCheckboxChange = (optionValue: string) => {
    if (selected.includes(optionValue)) {
      onChange(selected.filter((o) => o !== optionValue))
    } else {
      onChange([...selected, optionValue])
    }
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "commonToRare" ? "rareToCommon" : "commonToRare")
  }

  return (
    <div className={`${isOpen ? 'pt-3 pb-3' : 'pt-1'}`}>
      <button
        onClick={() => {
          console.log('Category clicked:', title, 'Current state:', isOpen)
          setIsOpen(!isOpen)
        }}
        className={`w-full flex items-center justify-between text-neutral-100 py-2 focus:outline-none ${isOpen ? `border-b border-orange-500 pb-2` : ''}`}
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
                {sortOrder === "commonToRare" ? "Common to Rare" : "Rare to Common"}
              </span>
              {sortOrder === "commonToRare" ? (
                <ArrowDown className={`h-3.5 w-3.5 ${colorClasses[color]}`} />
              ) : (
                <ArrowUp className={`h-3.5 w-3.5 ${colorClasses[color]}`} />
              )}
            </button>
          </div>

      <div className="space-y-0.5">
            {currentOptions.map((option, _index) => (
              <div key={option.value} className="flex items-center group hover:bg-neutral-800/50 rounded px-1 py-0.5 transition-colors">
                <div className="relative flex items-center w-full">
                  <input
                    type="checkbox"
                    id={option.value}
                    checked={selected?.includes(option.value) ?? false}
                    onChange={() => handleCheckboxChange(option.value)}
                    className={`sidebar-checkbox mr-2 appearance-none w-4 h-4 rounded-sm border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-${color}-400 focus:ring-offset-0 transition-colors cursor-pointer relative ${bgColorClasses[color]} checked:after:content-['✓'] checked:after:text-white checked:after:text-[10px] checked:after:font-light checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center`}
                  />
                  <label
                    htmlFor={option.value}
                    className="text-xs font-normal text-neutral-300 cursor-pointer flex-1 py-1 leading-tight w-full"
                  >
                    <div className="grid grid-cols-2 gap-x-4 items-center">
                      <span className="text-left whitespace-nowrap">{option.display.replace('\n', ' ')}</span>
                      {(() => {
                        const count = traitCounts["rarity"]?.[option.value];
                        return (
                          <span className={`${colorClasses[color]} text-xs font-normal text-right font-mono`}>
                            {count ? `(${count})` : ''}
                          </span>
                        );
                      })()}
                    </div>
                  </label>
                </div>
          </div>
        ))}
      </div>
        </>
      )}
    </div>
  )
}

// Update the FilterCategoryWithSubcategories component to allow multiple open subcategories
function FilterCategoryWithSubcategories({ title, color, subcategories, twoColumns = false, icon, selected = {}, onChange, traitCounts = {} }: FilterCategoryWithSubcategoriesProps & { selected: Record<string, string[]>, onChange: (selected: Record<string, string[]>) => void, traitCounts?: Record<string, Record<string, number>> }) {
  const [isOpen, setIsOpen] = useState(false)
  const context = React.useContext(FilterContext) || defaultContextValue;
  const { registerResetFunction, registerCloseFunction } = context as FilterContextType;

  // Keep category open if it has active selections, but allow manual closing
  const _hasActiveSelections = selected && Object.values(selected).some(arr => arr && arr.length > 0);
  const shouldBeOpen = isOpen;

  React.useEffect(() => {
    registerResetFunction(() => {
      onChange({})
    })
  }, [registerResetFunction, onChange])

  // Register close function
  React.useEffect(() => {
    registerCloseFunction(() => {
      setIsOpen(false)
    })
  }, [registerCloseFunction])

  // Map color names to Tailwind classes - matching circular graph colors
  const colorClasses: Record<string, string> = {
    purple: "text-purple-400",
    blue: "text-blue-500",
    amber: "text-amber-500",
    red: "text-red-500",
    green: "text-emerald-500",
    cyan: "text-cyan-500",
    orange: "text-orange-500",
  }

  // Map color names to border classes for underlines
  const _borderColorClasses: Record<string, string> = {
    purple: "border-purple-400",
    blue: "border-blue-500",
    amber: "border-amber-500",
    red: "border-red-500",
    green: "border-emerald-500",
    cyan: "border-cyan-500",
    orange: "border-orange-500",
  }

  // Map color names to background classes for checkboxes - matching circular graph colors
  const bgColorClasses: Record<string, string> = {
    purple: "checked:bg-purple-500 checked:border-purple-500",
    blue: "checked:bg-blue-500 checked:border-blue-500",
    amber: "checked:bg-amber-500 checked:border-amber-500",
    red: "checked:bg-red-500 checked:border-red-500",
    green: "checked:bg-emerald-500 checked:border-emerald-500",
    cyan: "checked:bg-cyan-500 checked:border-cyan-500",
    orange: "checked:bg-orange-500 checked:border-orange-500",
  }

  // Handle subcategory checkbox
  const handleSubcategoryCheckbox = (subcategoryName: string) => {
    if (selected[subcategoryName]) {
      // Uncheck: remove subcategory
      const { [subcategoryName]: _unused, ...rest } = selected;
      onChange(rest);
    } else {
      // Check: add subcategory with empty array (all colors)
      onChange({ ...selected, [subcategoryName]: [] });
    }
  };

  // Handle color checkbox
  const handleColorCheckbox = (subcategoryName: string, color: string) => {
    const prevArr = selected[subcategoryName] || [];
    if (prevArr.includes(color)) {
      // Uncheck color
      const newArr = prevArr.filter((c) => c !== color);
      onChange({ ...selected, [subcategoryName]: newArr });
    } else {
      // Check color
      onChange({ ...selected, [subcategoryName]: [...prevArr, color] });
    }
  };

  return (
    <div className={`${shouldBeOpen ? 'pt-3 pb-3' : 'pt-1'}`}>
      <button
        onClick={() => {
          console.log('FilterCategory clicked:', title, 'Current state:', isOpen)
          setIsOpen(!isOpen)
        }}
        className={`w-full flex items-center justify-between text-neutral-100 py-2 focus:outline-none ${shouldBeOpen ? `border-b ${_borderColorClasses[color]} pb-2` : ''}`}
        aria-expanded={shouldBeOpen}
      >
        <div className="flex items-center gap-2">
          {icon && <span className={`${colorClasses[color]}`}>{icon}</span>}
          <h3 className={`font-normal text-sm ${shouldBeOpen ? colorClasses[color] : 'text-neutral-100'}`}>{title}</h3>
        </div>
        {shouldBeOpen ? (
          <ChevronDown className={`h-5 w-5 ${colorClasses[color]}`} />
        ) : (
          <ChevronRight className={`h-5 w-5 ${colorClasses[color]}`} />
        )}
      </button>

      {shouldBeOpen && (
        <div className="mt-2 space-y-1">
          {subcategories.map((subcategory) => {
            const isChecked = !!selected[subcategory.name];
            return (
              <div key={subcategory.name} className="pl-1">
                <div className="flex items-center mb-0.5 cursor-pointer" onClick={() => handleSubcategoryCheckbox(subcategory.name)}>
                  {/* Chevron for dropdown */}
                  {isChecked ? (
                    <ChevronDown className={`h-4 w-4 mr-1 transition-transform duration-200 ${colorClasses[color]}`} />
                  ) : (
                    <ChevronRight className={`h-4 w-4 mr-1 transition-transform duration-200 ${colorClasses[color]}`} />
                  )}
                  <input
                    type="checkbox"
                    id={`subcat-${subcategory.name}`}
                    checked={isChecked}
                    onChange={() => handleSubcategoryCheckbox(subcategory.name)}
                    className={`sidebar-checkbox mr-2 appearance-none w-4 h-4 min-w-[16px] min-h-[16px] flex-shrink-0 rounded-sm border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-${color}-400 focus:ring-offset-0 transition-colors relative ${bgColorClasses[color]} checked:after:content-['✓'] checked:after:text-white checked:after:text-[10px] checked:after:font-light checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center`}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  />
                  <label
                    htmlFor={`subcat-${subcategory.name}`}
                    className={`text-sm cursor-pointer py-1 pr-2 block flex-1 ${isChecked ? `border-b ${_borderColorClasses[color]} pb-2` : ''}`}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    <div className="grid grid-cols-2 gap-x-4 items-center pb-1">
                      <span className={`${colorClasses[color]} text-left whitespace-nowrap`}>{subcategory.name}</span>
                      {(() => {
                        // Calculate total count for this subcategory
                        const key = title === "Hair" ? "hair" : title === "Headwear" ? "headwear" : title.toLowerCase();
                        let totalCount = 0;
                        subcategory.options.forEach(option => {
                          const fullValue = `${subcategory.name} ${option}`;
                          const count = traitCounts[key]?.[fullValue] || 0;
                          totalCount += count;
                        });
                        return totalCount > 0 ? (
                          <span className={`${colorClasses[color]} text-xs font-medium text-right font-mono`}>
                            ({totalCount})
                          </span>
                        ) : null;
                      })()}
                    </div>
                  </label>
                </div>
                {/* Show color checkboxes if subcategory is checked */}
                {isChecked && (
                  <div className={`ml-7 mt-1 ${twoColumns ? "grid grid-cols-2 gap-x-6 gap-y-0.5" : "space-y-1"}`}>
                    {subcategory.options.map((option) => (
                      <div key={option} className={`flex items-center ${twoColumns ? "group hover:bg-neutral-800/50 rounded px-1 py-1 transition-colors" : ""}`}>
                        <input
                          type="checkbox"
                          id={`${subcategory.name}-${option}`}
                          checked={selected[subcategory.name]?.includes(option) ?? false}
                          onChange={() => handleColorCheckbox(subcategory.name, option)}
                          className={`sidebar-checkbox mr-2 appearance-none w-4 h-4 min-w-[16px] min-h-[16px] flex-shrink-0 rounded-sm border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-${color}-400 focus:ring-offset-0 transition-colors relative ${bgColorClasses[color]} checked:after:content-['✓'] checked:after:text-white checked:after:text-[10px] checked:after:font-light checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center`}
                        />
                        <label
                          htmlFor={`${subcategory.name}-${option}`}
                          className={`text-xs text-neutral-300 cursor-pointer ${twoColumns ? "block" : "py-1 pr-1 block"} w-full`}
                        >
                          <div className="grid grid-cols-2 gap-x-4 items-center">
                            <span className="text-left whitespace-nowrap">{option}</span>
                            {(() => {
                              const key = title === "Hair" ? "hair" : title === "Headwear" ? "headwear" : title.toLowerCase();
                              const fullValue = `${subcategory.name} ${option}`;
                              const count = traitCounts[key]?.[fullValue];
                              return (
                                <span className={`${colorClasses[color]} text-xs font-normal text-right font-mono`}>
                                  {count ? `(${count})` : ''}
                                </span>
                              );
                            })()}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
                  })}
                </div>
      )}
    </div>
  );
}

interface SelectedFilters {
  background?: string[];
  skinTone?: string[];
  shirt?: string[];
  eyewear?: string[];
  hair?: Record<string, string[]>;
  headwear?: Record<string, string[]>;
  rarity?: string[];
}

interface NFTSidebarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  searchMode: "contains" | "exact";
  setSearchMode: (mode: "contains" | "exact") => void;
  selectedFilters: SelectedFilters;
  setSelectedFilters: (val: SelectedFilters) => void;
  traitCounts?: Record<string, Record<string, number>>;
}

export default function NFTSidebar({ searchTerm, setSearchTerm, searchMode, setSearchMode, selectedFilters, setSelectedFilters, traitCounts = {} }: NFTSidebarProps) {
  // Array to store reset functions
  const resetFunctions = useRef<(() => void)[]>([])
  // Array to store close functions
  const closeFunctions = useRef<(() => void)[]>([])

  // Function to register reset functions
  const registerResetFunction = (resetFn: () => void) => {
    resetFunctions.current.push(resetFn)
  }

  // Function to register close functions
  const registerCloseFunction = (closeFn: () => void) => {
    closeFunctions.current.push(closeFn)
  }

  // Function to clear all filters
  const clearAllFilters = () => {
    console.log('Clearing all filters...')
    // Clear the search term
    setSearchTerm("")
    // Reset search mode to default
    setSearchMode("contains")
    // Clear all selected filters first
    setSelectedFilters({})
    // Call all registered reset functions
    resetFunctions.current.forEach((resetFn) => resetFn())
    // Close all dropdowns
    closeFunctions.current.forEach((closeFn) => closeFn())
    console.log('All filters cleared')
  }

  // Function to close all dropdowns
  const closeAllDropdowns = () => {
    closeFunctions.current.forEach((closeFn) => closeFn())
  }

  // Context value
  const filterContextValue = {
    resetAllFilters: clearAllFilters,
    registerResetFunction,
    closeAllDropdowns,
    registerCloseFunction,
  }

  return (
    <div
      className="w-full max-w-[95vw] sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl bg-card rounded border border-neutral-700 shadow-sm flex flex-col"
      suppressHydrationWarning={true}
    >
      <div className="p-3 lg:p-4 pt-6 space-y-2 pb-8">
      <div className="space-y-1 mb-4 p-3 border border-neutral-700 rounded">
        <div>
          <div className="text-xs font-normal text-neutral-300 mb-0">Blockchain: Base</div>        </div>
        <div>
          <div className="text-xs font-normal text-neutral-300 mb-0">Chain ID: 8453</div>        </div>
        <div>
          <div className="text-xs font-normal text-neutral-300 mb-2">Token Standard: ERC-721</div>        </div>

        {/* Contract Links */}
        <div className="space-y-3 mt-3">
          <div>
            <h4 className="text-xs font-normal text-neutral-400 mb-2">Marketplace</h4>
            <div className="flex gap-2">
              <button
                onClick={() => window.open('https://basescan.org/address/0xF0f26455b9869d4A788191f6AEdc78410731072C', '_blank')}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] px-2 py-1.5 rounded transition-colors border border-neutral-600 flex items-center justify-center gap-1"
              >
                BaseScan
                <ExternalLink className="h-3 w-3" />
              </button>
              <button
                onClick={() => window.open('https://base.blockscout.com/address/0xF0f26455b9869d4A788191f6AEdc78410731072C', '_blank')}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] px-2 py-1.5 rounded transition-colors border border-neutral-600 flex items-center justify-center gap-1"
              >
                Blockscout
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-normal text-neutral-400 mb-2">NFT Contract</h4>
            <div className="flex gap-2">
              <button
                onClick={() => window.open('https://basescan.org/address/0xE3f1694adCe46ffcF82D15dd88859147c72f7C5a', '_blank')}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] px-2 py-1.5 rounded transition-colors border border-neutral-600 flex items-center justify-center gap-1"
              >
                BaseScan
                <ExternalLink className="h-3 w-3" />
              </button>
              <button
                onClick={() => window.open('https://base.blockscout.com/address/0xE3f1694adCe46ffcF82D15dd88859147c72f7C5a', '_blank')}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] px-2 py-1.5 rounded transition-colors border border-neutral-600 flex items-center justify-center gap-1"
              >
                Blockscout
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-neutral-700 mb-4"></div>

      <div suppressHydrationWarning={true}>
        <h3 className="font-normal mb-3 text-neutral-100 text-sm">Search</h3>
        
        {/* Contains/Exact Toggle */}
        <div className="flex gap-0 mb-3 rounded overflow-hidden border border-neutral-700">
          <button
            className={`flex-1 py-2 text-sm font-normal transition-colors cursor-pointer ${
              searchMode === "contains"
                ? "bg-[#ff0099] text-white"
                : "bg-transparent text-neutral-400 hover:text-neutral-200"
            }`}
            onClick={() => {
              setSearchMode("contains");
              track('Search Mode Changed', { mode: 'contains' });
            }}
          >
            Contains
          </button>
          <button
            className={`flex-1 py-2 text-sm font-normal transition-colors cursor-pointer ${
              searchMode === "exact"
                ? "bg-[#ff0099] text-white"
                : "bg-transparent text-neutral-400 hover:text-neutral-200"
            }`}
            onClick={() => {
              setSearchMode("exact");
              track('Search Mode Changed', { mode: 'exact' });
            }}
          >
            Exact
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-3" suppressHydrationWarning={true}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500 z-10 pointer-events-none" />
          <Input
            placeholder="Search NFTs..."
            className="pl-9 py-1.5 text-sm font-normal h-9 rounded-sm text-[#ff0099] placeholder:text-neutral-500 border border-neutral-700 bg-transparent focus:outline-none focus:ring-0 focus:border-neutral-500"
            value={searchTerm}
            spellCheck={false}
            autoComplete="off"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newValue = e.target.value;
              setSearchTerm(newValue);
              // Track search usage (debounce by only tracking when user pauses)
              if (newValue.length > 2 || newValue.length === 0) {
                track('NFT Search Used', {
                  searchTerm: newValue,
                  searchLength: newValue.length,
                  searchMode
                });
              }
            }}
          />
        </div>

        {/* Search Button */}
        <Button
          variant="outline"
          size="sm"
          className="text-sm font-normal flex items-center justify-center h-9 w-full mb-4 rounded border-neutral-700 bg-neutral-950/80 backdrop-blur-md hover:bg-neutral-900 hover:border-[#ff0099]/50 transition-all duration-200"
          onClick={() => {
            track('Search Button Clicked', {
              searchTerm,
              searchMode
            });
          }}
        >
          Search
        </Button>
        <div className="border-b border-neutral-700 mb-4"></div>
      </div>

      {/* Removed Sort By Price dropdown here */}

      {/* Clear All Filters Button */}
      <div>
        <Button variant="outline" size="sm" onClick={clearAllFilters} className="text-sm font-normal flex items-center justify-center gap-2 h-9 w-full rounded border-neutral-600 bg-neutral-950/80 backdrop-blur-md hover:bg-neutral-900 hover:border-[#ff0099]/50 transition-all duration-200">
          <X className="h-4 w-4" /> Clear All Filters
        </Button>
      </div>

      <FilterContext.Provider value={filterContextValue}>
        {/* Using the special RarityTiersCategory component */}
        <RarityTiersCategory
          title="Rarity Tiers"
          color="orange"
          icon={
            <Image
              src="/icons/nft-sidebar-categories/rarity-tier-orange.svg"
              alt="Rarity Tiers"
              width={18}
              height={18}
              className="text-orange-400"
            />
          }
          selected={selectedFilters.rarity || []}
          onChange={arr => setSelectedFilters({ ...selectedFilters, rarity: arr })}
          traitCounts={traitCounts}
        />

        <FilterCategory
          title="Background"
          color="blue"
          twoColumns={true}
          icon={
            <Image
              src="/icons/nft-sidebar-categories/background-blue.svg"
              alt="Background"
              width={18}
              height={18}
              className="text-blue-400"
            />
          }
          options={traitCounts["background"] ? Object.keys(traitCounts["background"]).sort().map(value => ({ value, display: value })) : []}
          selected={selectedFilters.background || []}
          onChange={arr => setSelectedFilters({ ...selectedFilters, background: arr })}
          traitCounts={traitCounts}
        />

        <FilterCategory
          title="Skin Tone"
          color="amber"
          twoColumns={true}
          icon={
            <Image src="/icons/nft-sidebar-categories/skin-tone-yellow.svg" alt="Skin Tone" width={18} height={18} className="text-amber-400" />
          }
          options={traitCounts["skinTone"] ? Object.keys(traitCounts["skinTone"]).sort().map(value => ({ value, display: shortenSkinToneName(value) })) : []}
          selected={selectedFilters.skinTone || []}
          onChange={arr => setSelectedFilters({ ...selectedFilters, skinTone: arr })}
          traitCounts={traitCounts}
        />

        <FilterCategory
          title="Shirt"
          color="red"
          twoColumns={true}
          icon={<Image src="/icons/nft-sidebar-categories/shirt-red.svg" alt="Shirt" width={18} height={18} className="text-red-400" />}
          options={traitCounts["shirt"] ? Object.keys(traitCounts["shirt"]).sort().map(value => ({ value, display: value })) : []}
          selected={selectedFilters.shirt || []}
          onChange={arr => setSelectedFilters({ ...selectedFilters, shirt: arr })}
          traitCounts={traitCounts}
        />

        <FilterCategoryWithSubcategories
          title="Hair"
          color="green"
          twoColumns={true}
          icon={<Image src="/icons/nft-sidebar-categories/hair-green.svg" alt="Hair" width={18} height={18} className="text-green-400" />}
          subcategories={[
            {
              name: "Banana Clip",
              options: ["Black", "Blonde", "Blue", "Brown", "Confetti", "Gold", "Grey", "Pink", "Purple", "Red"],
            },
            {
              name: "Bob",
              options: ["Black", "Blonde", "Blue", "Brown", "Diamond", "Grey", "Pink", "Purple", "Red"],
            },
            {
              name: "Crew Cut",
              options: ["Black", "Blonde", "Blue", "Brown", "Diamond", "Grey", "Pink", "Purple", "Red"],
            },
            {
              name: "Curly",
              options: ["Black", "Blonde", "Blue", "Brown", "Confetti", "Grey", "Pink", "Purple", "Red"],
            },
            {
              name: "Pixie Cut",
              options: ["Confetti", "Gold"],
            },
            {
              name: "Ponytail",
              options: ["Black", "Blonde", "Blue", "Brown", "Grey", "Pink", "Purple", "Red"],
            },
            {
              name: "Side Part",
              options: ["Black", "Blonde", "Blue", "Brown", "Grey", "Pink", "Purple", "Red"],
            },
            {
              name: "Straight",
              options: ["Black", "Blonde", "Blue", "Brown", "Confetti", "Grey", "Pink", "Purple", "Red"],
            },
          ]}
          selected={selectedFilters.hair || {}}
          onChange={selected => setSelectedFilters({ ...selectedFilters, hair: selected })}
          traitCounts={traitCounts}
        />

        <FilterCategory
          title="Eyewear"
          color="cyan"
          twoColumns={true}
          icon={<Image src="/icons/nft-sidebar-categories/eyewear-blue.svg" alt="Eyewear" width={18} height={18} className="text-cyan-400" />}
          options={[
            // Values match the cleaned combined_metadata.json (no "Eyewear" prefix)
            "Eyeglasses",
            "Confetti Shades",
            "Diamond Shades",
            "Eyeblack",
            "Gold Shades",
            "Sunglasses",
          ]}
          selected={selectedFilters.eyewear || []}
          onChange={arr => setSelectedFilters({ ...selectedFilters, eyewear: arr })}
          traitCounts={traitCounts}
        />

        <FilterCategoryWithSubcategories
          title="Headwear"
          color="purple"
          twoColumns={true}
          icon={
            <Image src="/icons/nft-sidebar-categories/headwear-purple.svg" alt="Headwear" width={18} height={18} className="text-purple-400" />
          }
          subcategories={[
            {
              name: "Baseball Cap",
              options: ["Black", "Blue", "Confetti", "Diamond", "Gold", "Green", "Pink", "Purple", "Red"],
            },
            {
              name: "Batters Helmet",
              options: ["Black", "Blue", "Confetti", "Diamond", "Gold", "Green", "Pink", "Purple", "Red"],
            },
            {
              name: "Snapback",
              options: ["Black", "Blue", "Confetti", "Diamond", "Gold", "Green", "Pink", "Purple", "Red"],
            },
          ]}
          selected={selectedFilters.headwear || {}}
          onChange={selected => setSelectedFilters({ ...selectedFilters, headwear: selected })}
          traitCounts={traitCounts}
        />
      </FilterContext.Provider>
      </div>
    </div>
  )
}