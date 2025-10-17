"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

// Consistent color scheme - same as main page
const COLORS = {
  background: "#3B82F6", // blue
  skinTone: "#F59E0B", // yellow/orange
  shirt: "#EF4444", // red
  hair: "#10B981", // green
  eyewear: "#06B6D4", // teal/cyan
  headwear: "#A855F7", // purple
  neutral: "#9CA3AF", // default gray
};

interface AttributeRarityProps {
  attributes: {
    name: string
    value: string
    percentage: number
  }[]
  overallRarity?: string | number // Overall NFT rarity percentage
}

export function AttributeRarityChart({ attributes, overallRarity }: AttributeRarityProps) {
  console.log("Chart props:", { attributes, overallRarity });
  console.log("Chart component rendering...");
  
  // Color mapping based on attribute names - exact same as NFT details page
  const getColorForAttribute = (attributeName: string) => {
    const colorMap: { [key: string]: string } = {
      "Background": COLORS.background,
      "Skin Tone": COLORS.skinTone,
      "Shirt": COLORS.shirt,
      "Hair": COLORS.hair,
      "Eyewear": COLORS.eyewear,
      "Headwear": COLORS.headwear,
    }
    return colorMap[attributeName] || COLORS.neutral
  }

  // Transform attributes data for recharts
  const chartData = attributes.map((attr) => ({
    name: attr.name,
    value: attr.percentage,
    attributeValue: attr.value,
    fill: getColorForAttribute(attr.name),
  }))
  
  console.log("Chart data:", chartData);

  // If no data, show empty state
  if (!chartData || chartData.length === 0) {
    console.log("No chart data available");
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-neutral-400">
          <div className="text-lg">No data available</div>
          <div className="text-sm">Chart cannot be rendered</div>
        </div>
      </div>
    )
  }

  console.log("Chart data available:", chartData);

  // Fallback if chart doesn't render
  if (chartData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-neutral-400">
          <div className="text-lg">No data available</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex items-start gap-6 pt-4">
      {/* Legend - Left Side */}
      <div className="flex-1">
        <div className="grid grid-cols-1 gap-2 text-xs">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.fill }}
              />
              <div className="flex-1">
                <span className="font-medium text-off-white">
                  {item.name}
                </span>
                <div className="text-xs text-neutral-400">
                  {item.attributeValue}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chart - Right Side */}
      <div className="flex-1 relative">
        <div className="w-full flex items-center justify-center pt-2">
          <div className="w-40 h-40 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={1}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-xl font-bold text-off-white">
                  {overallRarity}%
                </div>
                <div className="text-xs text-neutral-400">
                  Rarity
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
