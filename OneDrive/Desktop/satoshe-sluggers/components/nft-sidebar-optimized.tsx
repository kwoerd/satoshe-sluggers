"use client"

import React, { useState, useRef } from "react"
import { ChevronDown, ChevronRight, Search, X, ArrowDown, ArrowUp, ExternalLink } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// import { track } from '@vercel/analytics'; // Commented out - package not installed

// Stub analytics function to prevent errors
const track = (..._args: unknown[]) => {
};

// Create a context for filter reset functionality
interface FilterContextType {
  resetAllFilters: () => void;
  registerResetFunction: (fn: () => void) => void;
  closeAllDropdowns: () => void;
  registerCloseFunction: (fn: () => void) => void;
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
  const borderColorClasses: Record<string, string> = {
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
    <div className={`${isOpen ? 'pt-3 pb-3' : 'pt-1'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between py-2 focus:outline-none ${isOpen ? `border-b-4 ${borderColorClasses[color]} pb-2` : ''}`}
        style={{ color: "#fffbeb" }}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          {icon && <span className={`${colorClasses[color]}`}>{icon}</span>}
          <h3 className={`font-normal text-base ${isOpen ? colorClasses[color] : ''}`} style={!isOpen ? { color: "#fffbeb" } : {}}>{title}</h3>
        </div>
        {isOpen ? (
          <ChevronDown className={`h-5 w-5 ${colorClasses[color]}`} />
        ) : (
          <ChevronRight className={`h-5 w-5 ${colorClasses[color]}`} />
        )}
      </button>

      {isOpen && (
        <div className="mt-2 space-y-1">
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
                    className={`mr-3 appearance-none w-5 h-5 min-w-[20px] min-h-[20px] flex-shrink-0 rounded border border-neutral-300 checked:border-0 focus:outline-none focus:ring-offset-0 focus:ring-2 focus:ring-${color}-400 focus:ring-offset-neutral-800 transition-colors ${bgColorClasses[color]}`}
              />
              <label
                    htmlFor={optValue}
                    className="text-sm text-neutral-300 cursor-pointer flex-1 py-0.5 pl-7 pr-2 -ml-7 block flex justify-between items-center"
                  >
                    <span>{optDisplay}</span>
                    {(() => {
                      const key = title === "Background" ? "background"
                        : title === "Skin Tone" ? "skinTone"
                        : title === "Shirt" ? "shirt"
                        : title === "Eyewear" ? "eyewear"
                        : title === "Rarity Tiers" ? "rarity"
                        : title.toLowerCase();
                      const count = traitCounts[key]?.[optValue];
                      return count ? (
                        <span className={`${colorClasses[color]} text-xs font-medium flex-shrink-0`}>
                          ({count})
                        </span>
                      ) : null;
                    })()}
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
  const borderColorClasses: Record<string, string> = {
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
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between py-2 focus:outline-none ${isOpen ? `border-b-4 border-orange-500 pb-2` : ''}`}
        style={{ color: "#fffbeb" }}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          {icon && <span className={`${colorClasses[color]}`}>{icon}</span>}
          <h3 className={`font-normal text-base ${isOpen ? colorClasses[color] : ''}`} style={!isOpen ? { color: "#fffbeb" } : {}}>{title}</h3>
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
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors w-full justify-between"
              style={{ color: "#fffbeb" }}
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
            {currentOptions.map((option, index) => (
              <div key={option.value} className="flex items-center group hover:bg-neutral-800/50 rounded px-1 py-0.5 transition-colors">
                <div className="relative flex items-center w-full">
                  <input
                    type="checkbox"
                    id={option.value}
                    checked={selected?.includes(option.value) ?? false}
                    onChange={() => handleCheckboxChange(option.value)}
                    className={`mr-3 appearance-none w-6 h-6 rounded border-2 border-neutral-300 checked:border-0 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-neutral-800 transition-colors cursor-pointer ${bgColorClasses[color]} focus:ring-${color}-400`}
                />
                <label
                    htmlFor={option.value}
                    className="text-sm text-neutral-300 cursor-pointer flex-1 py-1 whitespace-pre-line leading-tight"
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.display.replace('\n', ' ')}</span>
                      {(() => {
                        const count = traitCounts["rarity"]?.[option.value];
                        return count ? (
                          <span className={`${colorClasses[color]} text-xs font-medium`}>
                            ({count})
                          </span>
                        ) : null;
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
  const borderColorClasses: Record<string, string> = {
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
      const { [subcategoryName]: _, ...rest } = selected;
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
    <div className={`${isOpen ? 'pt-3 pb-3' : 'pt-1'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between py-2 focus:outline-none ${isOpen ? `border-b-4 ${borderColorClasses[color]} pb-2` : ''}`}
        style={{ color: "#fffbeb" }}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          {icon && <span className={`${colorClasses[color]}`}>{icon}</span>}
          <h3 className={`font-normal text-base ${isOpen ? colorClasses[color] : ''}`} style={!isOpen ? { color: "#fffbeb" } : {}}>{title}</h3>
        </div>
        {isOpen ? (
          <ChevronDown className={`h-5 w-5 ${colorClasses[color]}`} />
        ) : (
          <ChevronRight className={`h-5 w-5 ${colorClasses[color]}`} />
        )}
      </button>

      {isOpen && (
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
                    className={`mr-2 appearance-none w-5 h-5 min-w-[20px] min-h-[20px] flex-shrink-0 rounded border border-neutral-300 checked:border-0 focus:outline-none focus:ring-offset-0 focus:ring-2 focus:ring-${color}-400 focus:ring-offset-neutral-800 transition-colors ${bgColorClasses[color]}`}
                    onClick={(e: any) => e.stopPropagation()}
                  />
                  <label
                    htmlFor={`subcat-${subcategory.name}`}
                    className={`text-sm cursor-pointer py-1 pr-2 block flex-1 ${isChecked ? `border-b-4 ${borderColorClasses[color]} pb-2` : ''}`}
                    onClick={(e: any) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between pb-1">
                      <span className={colorClasses[color]}>{subcategory.name}</span>
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
                          <span className={`${colorClasses[color]} text-xs font-medium`}>
                            ({totalCount})
                          </span>
                        ) : null;
                      })()}
                    </div>
                  </label>
                </div>
                {/* Show color checkboxes if subcategory is checked */}
                {isChecked && (
                  <div className={`ml-7 mt-1 ${twoColumns ? "grid grid-cols-2 gap-x-3 gap-y-0.5" : "space-y-1"}`}>
                    {subcategory.options.map((option) => (
                      <div key={option} className={`flex items-center ${twoColumns ? "group hover:bg-neutral-800/50 rounded px-1 py-1 transition-colors" : ""}`}>
                        <input
                          type="checkbox"
                          id={`${subcategory.name}-${option}`}
                          checked={selected[subcategory.name]?.includes(option) ?? false}
                          onChange={() => handleColorCheckbox(subcategory.name, option)}
                          className={`mr-3 appearance-none w-5 h-5 min-w-[20px] min-h-[20px] flex-shrink-0 rounded border border-neutral-300 checked:border-0 focus:outline-none focus:ring-offset-0 focus:ring-2 focus:ring-${color}-400 focus:ring-offset-neutral-800 transition-colors ${bgColorClasses[color]}`}
                        />
                        <label
                          htmlFor={`${subcategory.name}-${option}`}
                          className={`text-sm text-neutral-300 cursor-pointer flex-1 ${twoColumns ? "flex justify-between items-center min-w-0" : "py-1 pr-2 block flex justify-between items-center"}`}
                        >
                          <span>{option}</span>
                          {(() => {
                            const key = title === "Hair" ? "hair" : title === "Headwear" ? "headwear" : title.toLowerCase();
                            const fullValue = `${subcategory.name} ${option}`;
                            const count = traitCounts[key]?.[fullValue];
                            return count ? (
                              <span className={`${colorClasses[color]} text-xs font-medium flex-shrink-0`}>
                                ({count})
                              </span>
                            ) : null;
                          })()}
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

interface NFTSidebarProps {
  searchTerm: string;
  searchMode: "exact" | "contains";
  selectedFilters: Record<string, string[] | Record<string, string[]>>;
  onSearchChange: (term: string) => void;
  onSearchModeChange: (mode: "exact" | "contains") => void;
  onFilterChange: (filters: Record<string, string[]>) => void;
  onTraitCountsChange: (_counts: Record<string, Record<string, number>>) => void;
  traitCounts?: Record<string, Record<string, number>>;
}

export default function NFTSidebar({ searchTerm, searchMode, selectedFilters, onSearchChange, onSearchModeChange, onFilterChange, onTraitCountsChange, traitCounts = {} }: NFTSidebarProps) {
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
    // Clear the search term
    onSearchChange("")
    // Reset search mode to "contains" to prevent "no NFTs found" when exact is enabled
    onSearchModeChange("contains")
    // Call all registered reset functions
    resetFunctions.current.forEach((resetFn) => resetFn())
    // Close all dropdowns
    closeFunctions.current.forEach((closeFn) => closeFn())
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
      className="w-full max-w-[95vw] sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl space-y-2 bg-card p-3 lg:p-4 pt-6 rounded border border-neutral-700 shadow-sm"
      suppressHydrationWarning={true}
    >
      <div className="space-y-1 mb-4 p-3 border border-neutral-700 rounded">
        <div>
          <div className="text-xs font-sans text-neutral-300 mb-0">Blockchain: Base</div>        </div>
        <div>
          <div className="text-xs font-sans text-neutral-300 mb-0">Chain ID: 8453</div>        </div>
        <div>
          <div className="text-xs font-sans text-neutral-300 mb-2">Token Standard: ERC-721</div>        </div>

        {/* Contract Links */}
        <div className="space-y-3 mt-3">
          <div>
            <h4 className="text-xs font-sans text-neutral-300 mb-2">Marketplace</h4>
            <div className="flex gap-2">
              <button
                onClick={() => window.open(`https://basescan.org/address/${process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || '0xYourMarketplaceAddress'}`, '_blank')}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-[11px] px-2 py-1.5 rounded transition-colors border border-neutral-600 flex items-center justify-center gap-1"
                style={{ color: "#fffbeb" }}
              >
                BaseScan
                <ExternalLink className="h-3 w-3" style={{ color: "#fffbeb" }} />
              </button>
              <button
                onClick={() => window.open(`https://base.blockscout.com/address/${process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || '0xYourMarketplaceAddress'}`, '_blank')}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-[11px] px-2 py-1.5 rounded transition-colors border border-neutral-600 flex items-center justify-center gap-1"
                style={{ color: "#fffbeb" }}
              >
                Blockscout
                <ExternalLink className="h-3 w-3" style={{ color: "#fffbeb" }} />
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-sans text-neutral-300 mb-2">NFT Contract</h4>
            <div className="flex gap-2">
              <button
                onClick={() => window.open(`https://basescan.org/address/${process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS || '0xYourNFTCollectionAddress'}`, '_blank')}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-[11px] px-2 py-1.5 rounded transition-colors border border-neutral-600 flex items-center justify-center gap-1"
                style={{ color: "#fffbeb" }}
              >
                BaseScan
                <ExternalLink className="h-3 w-3" style={{ color: "#fffbeb" }} />
              </button>
              <button
                onClick={() => window.open(`https://base.blockscout.com/address/${process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS || '0xYourNFTCollectionAddress'}`, '_blank')}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-[11px] px-2 py-1.5 rounded transition-colors border border-neutral-600 flex items-center justify-center gap-1"
                style={{ color: "#fffbeb" }}
              >
                Blockscout
                <ExternalLink className="h-3 w-3" style={{ color: "#fffbeb" }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-neutral-700 mb-4"></div>

      <div suppressHydrationWarning={true}>
        <h3 className="font-normal mb-2 text-base" style={{ color: "#fffbeb" }}>Search</h3>
        
        {/* Search Mode Toggle */}
        <div className="mb-3">
          <div className="flex bg-neutral-700 rounded p-1">
            <button
              onClick={() => onSearchModeChange("contains")}
              className={`flex-1 px-3 py-1.5 text-xs rounded transition-colors ${
                searchMode === "contains"
                  ? "bg-brand-pink text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Contains
            </button>
            <button
              onClick={() => onSearchModeChange("exact")}
              className={`flex-1 px-3 py-1.5 text-xs rounded transition-colors ${
                searchMode === "exact"
                  ? "bg-brand-pink text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Exact
            </button>
          </div>
        </div>

        <div className="relative mb-2" suppressHydrationWarning={true}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Search NFTs..."
            className="pl-9 py-1.5 text-sm font-normal h-8 rounded text-brand-pink border-neutral-600 focus:outline-none focus:ring-0 focus:border-brand-pink transition-colors"
            value={searchTerm}
            onChange={(e: any) => {
              const newValue = (e.target as HTMLInputElement).value;
              onSearchChange(newValue);
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
        
        <Button
          variant="outline"
          size="sm"
          className="text-sm font-light flex items-center justify-center h-8 w-full mb-4 rounded border-neutral-600 focus:outline-none focus:ring-0 focus:border-neutral-500"
          style={{ color: "#fffbeb" }}
          onClick={() => {
            // Search functionality can be implemented here if needed
            track('Search Button Clicked', {
              searchTerm
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
        <Button variant="outline" size="sm" onClick={() => {
          track('Clear All Filters Clicked', {
            filtersCleared: Object.keys(selectedFilters).length,
            hasSearchTerm: searchTerm.length > 0
          });
          clearAllFilters();
        }} className="text-sm font-light flex items-center justify-center gap-1 h-9 w-full rounded border-neutral-600 focus:outline-none focus:ring-0 focus:border-neutral-500" style={{ color: "#fffbeb" }}>
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
          selected={(selectedFilters.rarity as string[]) || []}
          onChange={(arr: string[]) => onFilterChange({ ...selectedFilters, rarity: arr })}
          traitCounts={traitCounts}
        />

        <FilterCategory
          title="Background"
          color="blue"
          twoColumns={false}
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
          selected={(selectedFilters.background as string[]) || []}
          onChange={arr => onFilterChange({ ...selectedFilters, background: arr })}
          traitCounts={traitCounts}
        />

        <FilterCategory
          title="Skin Tone"
          color="amber"
          twoColumns={false}
          icon={
            <Image src="/icons/nft-sidebar-categories/skin-tone-yellow.svg" alt="Skin Tone" width={18} height={18} className="text-amber-400" sizes="18px" />
          }
          options={traitCounts["skinTone"] ? Object.keys(traitCounts["skinTone"]).sort().map(value => ({ value, display: value })) : []}
          selected={(selectedFilters.skinTone as string[]) || []}
          onChange={arr => onFilterChange({ ...selectedFilters, skinTone: arr })}
          traitCounts={traitCounts}
        />

        <FilterCategory
          title="Shirt"
          color="red"
          twoColumns={false}
          icon={<Image src="/icons/nft-sidebar-categories/shirt-red.svg" alt="Shirt" width={18} height={18} className="text-red-400" sizes="18px" />}
          options={traitCounts["shirt"] ? Object.keys(traitCounts["shirt"]).sort().map(value => ({ value, display: value })) : []}
          selected={(selectedFilters.shirt as string[]) || []}
          onChange={arr => onFilterChange({ ...selectedFilters, shirt: arr })}
          traitCounts={traitCounts}
        />

        <FilterCategoryWithSubcategories
          title="Hair"
          color="green"
          twoColumns={false}
          icon={<Image src="/icons/nft-sidebar-categories/hair-green.svg" alt="Hair" width={18} height={18} className="text-green-400" sizes="18px" />}
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
          selected={(selectedFilters.hair as unknown as Record<string, string[]>) || {}}
          onChange={(selected: Record<string, string[]>) => onFilterChange({ ...selectedFilters, hair: selected as any })}
          traitCounts={traitCounts}
        />

        <FilterCategory
          title="Eyewear"
          color="cyan"
          twoColumns={false}
          icon={<Image src="/icons/nft-sidebar-categories/eyewear-blue.svg" alt="Eyewear" width={18} height={18} className="text-cyan-400" sizes="18px" />}
          options={[
            // Values match the cleaned complete_metadata.json (no "Eyewear" prefix)
            "Eyeglasses",
            "Confetti Shades",
            "Diamond Shades",
            "Eyeblack",
            "Gold Shades",
            "Sunglasses",
          ]}
          selected={(selectedFilters.eyewear as string[]) || []}
          onChange={arr => onFilterChange({ ...selectedFilters, eyewear: arr })}
          traitCounts={traitCounts}
        />

        <FilterCategoryWithSubcategories
          title="Headwear"
          color="purple"
          twoColumns={false}
          icon={
            <Image src="/icons/nft-sidebar-categories/headwear-purple.svg" alt="Headwear" width={18} height={18} className="text-purple-400" sizes="18px" />
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
          selected={(selectedFilters.headwear as unknown as Record<string, string[]>) || {}}
          onChange={(selected: Record<string, string[]>) => onFilterChange({ ...selectedFilters, headwear: selected as any })}
          traitCounts={traitCounts}
        />
      </FilterContext.Provider>
    </div>
  )
}