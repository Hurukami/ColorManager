"use client";

import { useState, useEffect } from "react";
import { hexToHsv, hsvToHex } from "@/lib/colorUtils";

type Props = {
  baseHex: string;
  generatedColors?: { name: string; hex: string; tag?: string }[];
  setGeneratedColors: (
    c: { name: string; hex: string; tag?: string }[],
  ) => void;
};

export default function PaletteGenerator({
  baseHex,
  generatedColors,
  setGeneratedColors,
}: Props) {
  const [shadow, setShadow] = useState(0.2);
  const [highlight, setHighlight] = useState(0.2);
  const [saturation, setSaturation] = useState(0);

  const [palette, setPalette] = useState<
    { name: string; hex: string; tag?: string }[]
  >([]);

  useEffect(() => {
    generate();
  }, [shadow, highlight, saturation, baseHex]);

  const generate = () => {
    const { h, s, v } = hexToHsv(baseHex);

    const newPalette = [
      {
        name: "ベース",
        hex: baseHex,
      },
      {
        name: "影",
        hex: hsvToHex(
          h,
          Math.min(s + 0.1 + saturation, 1),
          Math.max(v - shadow, 0),
        ),
        tag: "影",
      },
      {
        name: "ハイライト",
        hex: hsvToHex(
          h,
          Math.max(s - 0.1 + saturation, 0),
          Math.min(v + highlight, 1),
        ),
        tag: "ハイライト",
      },
    ];

    setPalette(newPalette);
    setGeneratedColors(newPalette);
  };

  return (
    <div className="space-y-4">
      {/* プレビュー */}
      <div className="grid grid-cols-3 gap-2">
        {palette.map((c) => (
          <div
            key={c.name}
            className="p-3 rounded text-white text-sm"
            style={{ backgroundColor: c.hex }}
          >
            {c.name}
          </div>
        ))}
      </div>

      {/* スライダー */}
      <div>
        <label>影の強さ: {shadow.toFixed(2)}</label>
        <input
          type="range"
          min="0"
          max="0.5"
          step="0.01"
          value={shadow}
          onChange={(e) => setShadow(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label>ハイライト: {highlight.toFixed(2)}</label>
        <input
          type="range"
          min="0"
          max="0.5"
          step="0.01"
          value={highlight}
          onChange={(e) => setHighlight(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label>彩度補正: {saturation.toFixed(2)}</label>
        <input
          type="range"
          min="-0.5"
          max="0.5"
          step="0.01"
          value={saturation}
          onChange={(e) => setSaturation(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}
