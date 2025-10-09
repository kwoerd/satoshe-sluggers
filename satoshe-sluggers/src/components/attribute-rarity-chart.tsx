"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

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

export default function AttributeRarityChart({ attributes, overallRarity }: AttributeRarityProps) {
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
  const chartData = attributes.map((attr, index) => ({
    name: attr.name,
    value: attr.value,
    percentage: attr.percentage,
    fill: getColorForAttribute(attr.name),
  }))

  // Create chart config
  const chartConfig = attributes.reduce((config, attr) => {
    const key = attr.name.toLowerCase().replace(/\s+/g, '')
    config[key] = {
      label: attr.name,
      color: getColorForAttribute(attr.name),
    }
    return config
  }, {} as ChartConfig)

  // Calculate total for center display
  const totalPercentage = React.useMemo(() => {
    return attributes.reduce((acc, curr) => acc + curr.percentage, 0)
  }, [attributes])

  return (
    <Card className="flex flex-col bg-neutral-800 border-neutral-700 mb-8">
      <CardHeader className="items-center pb-3">
        <CardTitle className="text-lg" style={{ color: "#fffbeb" }}>Attribute Rarity Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[280px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent
                hideLabel
                className="bg-neutral-900 border-neutral-600"
                style={{ color: "#fffbeb" }}
                formatter={(value, name) => {
                  const item = chartData.find(d => d.name === name);
                  return [
                    <span key={name} className="font-medium" style={{ color: "#fffbeb" }}>
                      {name}, {item?.value}, {value}%
                    </span>,
                    ""
                  ];
                }}
              />}
            />
            <Pie
              data={chartData}
              dataKey="percentage"
              nameKey="name"
              innerRadius={65}
              outerRadius={110}
              strokeWidth={2}
              stroke="#262626"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 8}
                          className="text-2xl font-bold"
                          style={{ fill: "#fffbeb" }}
                        >
                          {overallRarity}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 18}
                          className="text-sm"
                          style={{ fill: "#fffbeb" }}
                        >
                          Rarity
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.fill }}
              />
              <span className="font-medium" style={{ color: "#fffbeb" }}>
                {item.name}, {item.value}, {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
