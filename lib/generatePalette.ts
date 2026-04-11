import { hexToHsv, hsvToHex } from '@/lib/colorUtils'

export function generatePalette(hex: string) {
  const { h, s, v } = hexToHsv(hex)

  return [
    {
      name: 'ベース',
      hex
    },
    {
      name: '影',
      hex: hsvToHex(h, Math.min(s + 0.1, 1), Math.max(v - 0.2, 0))
    },
    {
      name: 'ハイライト',
      hex: hsvToHex(h, Math.max(s - 0.1, 0), Math.min(v + 0.2, 1))
    },
    {
      name: '中間',
      hex: hsvToHex(h, Math.max(s - 0.2, 0), v)
    }
  ]
}