"use client";

// Consistent color scheme based on the radial chart
const COLORS = {
  background: "#3B82F6", // blue
  skinTone: "#F59E0B", // yellow/orange
  shirt: "#EF4444", // red
  hair: "#10B981", // green
  eyewear: "#06B6D4", // teal/cyan
  headwear: "#A855F7", // purple
  neutral: "#9CA3AF", // default gray
};

interface Attribute {
  name: string;
  value: string;
  percentage: number;
  occurrence?: number;
}

interface AttributesSectionProps {
  attributes: Attribute[];
}

export function AttributesSection({ attributes }: AttributesSectionProps) {
  const getColorForAttribute = (name: string) => {
    const colorMap: { [key: string]: string } = {
      background: COLORS.background,
      "skin tone": COLORS.skinTone,
      shirt: COLORS.shirt,
      hair: COLORS.hair,
      eyewear: COLORS.eyewear,
      headwear: COLORS.headwear,
    };
    return colorMap[name.toLowerCase()] || COLORS.background;
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-off-white mb-6">Attributes</h3>
      <div className="grid grid-cols-2 gap-4">
        {attributes.map((attr, index) => {
          const color = getColorForAttribute(attr.name);
          const occurrence = attr.occurrence;
          return (
            <div key={index} className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-off-white">
                    {attr.name}
                  </p>
                  <p className="text-sm text-neutral-300">{attr.value}</p>
                </div>
              </div>
              <div className="text-xs text-neutral-400">
                <p>{attr.percentage}% have this trait</p>
                {occurrence && <p>{occurrence} of 7777</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
