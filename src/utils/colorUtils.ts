export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )})`
    : null;
};

export const hexToRgbArray = (hex: string): [number, number, number] | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null;
};

export const getLuminance = (hex: string): number => {
  const rgb = hexToRgbArray(hex);
  if (!rgb) return 0;

  const a = rgb.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
};

export const getContrastRatio = (hex1: string, hex2: string): number => {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

export const checkWCAGCompliance = (ratio: number): { level: string; description: string } => {
  let level = '';
  let description = '';

  if (ratio >= 7) {
    level = 'AAA';
    description = 'Excelente para texto normal y grande.';
  } else if (ratio >= 4.5) {
    level = 'AA';
    description = 'Bueno para texto normal; excelente para texto grande.';
  } else if (ratio >= 3) {
    level = 'AA Large';
    description = 'Aceptable solo para texto grande.';
  } else {
    level = 'Fail';
    description = 'No cumple con los requisitos mínimos de contraste.';
  }

  return { level, description };
};

export const hexToHsl = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
    l * 100
  )}%)`;
};

export const getContrastingTextColor = (hex: string): string => {
  const luminance = getLuminance(hex);
  // Using a common threshold for WCAG 2.0 (relative luminance of 0.179)
  // For a simpler check, 0.5 is often used.
  return luminance > 0.179 ? '#000000' : '#FFFFFF';
};

export const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const hexToHslArray = (hex: string): [number, number, number] | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), s * 100, l * 100];
};

export const getComplementaryColor = (hex: string): string | null => {
  const hsl = hexToHslArray(hex);
  if (!hsl) return null;
  const [h, s, l] = hsl;
  const complementaryH = (h + 180) % 360;
  return hslToHex(complementaryH, s, l);
};

export const getAnalogousColors = (hex: string): string[] | null => {
  const hsl = hexToHslArray(hex);
  if (!hsl) return null;
  const [h, s, l] = hsl;
  const colors: string[] = [];
  // Analogous colors are typically within 30 degrees of the base color
  colors.push(hslToHex((h - 30 + 360) % 360, s, l));
  colors.push(hslToHex(h, s, l));
  colors.push(hslToHex((h + 30) % 360, s, l));
  return colors;
};

export const getTriadicColors = (hex: string): string[] | null => {
  const hsl = hexToHslArray(hex);
  if (!hsl) return null;
  const [h, s, l] = hsl;
  const colors: string[] = [];
  colors.push(hslToHex(h, s, l));
  colors.push(hslToHex((h + 120) % 360, s, l));
  colors.push(hslToHex((h + 240) % 360, s, l));
  return colors;
};

export const getTetradicColors = (hex: string): string[] | null => {
  const hsl = hexToHslArray(hex);
  if (!hsl) return null;
  const [h, s, l] = hsl;
  const colors: string[] = [];
  colors.push(hslToHex(h, s, l));
  colors.push(hslToHex((h + 90) % 360, s, l));
  colors.push(hslToHex((h + 180) % 360, s, l));
  colors.push(hslToHex((h + 270) % 360, s, l));
  return colors;
};

export const blendColors = (color1: string, color2: string, ratio: number): string | null => {
  const rgb1 = hexToRgbArray(color1);
  const rgb2 = hexToRgbArray(color2);

  if (!rgb1 || !rgb2) return null;

  const blendedR = Math.round(rgb1[0] * (1 - ratio) + rgb2[0] * ratio);
  const blendedG = Math.round(rgb1[1] * (1 - ratio) + rgb2[1] * ratio);
  const blendedB = Math.round(rgb1[2] * (1 - ratio) + rgb2[2] * ratio);

  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(blendedR)}${toHex(blendedG)}${toHex(blendedB)}`;
};