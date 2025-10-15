"use client";

import { AttributeRarityChart } from "./attribute-rarity-chart";

interface Attribute {
  name: string;
  value: string;
  percentage: number;
}

interface RarityDistributionSectionProps {
  attributes: Attribute[];
  overallRarity?: string;
}

export function RarityDistributionSection({ 
  attributes, 
  overallRarity = "—" 
}: RarityDistributionSectionProps) {
  return (
    <AttributeRarityChart 
      attributes={attributes}
      overallRarity={overallRarity}
    />
  );
}
