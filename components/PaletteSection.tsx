import { generatePalette } from "@/lib/generatePalette";

type Props = {
  hex: string;
  generatedColors: { name: string; hex: string }[];
  setGeneratedColors: (c: { name: string; hex: string }[]) => void;
};

export default function PaletteSection({
  hex,
  generatedColors,
  setGeneratedColors,
}: Props) {
  return (
    <div className="space-y-2">
      <button
        onClick={() => {
          const palette = generatePalette(hex);
          setGeneratedColors(palette);
        }}
        className="w-full bg-purple-600 text-white px-4 py-2 rounded"
      >
        類似色を生成
      </button>

      {generatedColors.map((color) => (
        <div key={color.name} className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: color.hex }}
          />
          <span>{color.name}</span>
        </div>
      ))}
    </div>
  );
}
