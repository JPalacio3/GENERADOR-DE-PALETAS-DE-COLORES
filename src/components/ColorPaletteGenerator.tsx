import React, { useState } from "react";
import styled from "styled-components";
import ColorPicker from "./ColorPicker";
import ColorCard from "./ColorCard";
import JsonModal from "./JsonModal";
import {
  hexToRgb,
  hexToHsl,
  hexToHslArray,
  hslToHex,
  getComplementaryColor,
  getAnalogousColors,
  getTriadicColors,
  getTetradicColors,
} from "../utils/colorUtils";

const generatePalette = (baseColor: string, rule: string): string[] => {
  let palette: string[] = [];
  const hsl = hexToHslArray(baseColor);

  if (!hsl) return [baseColor]; // Fallback if baseColor is invalid

  const [h, s, l] = hsl;

  switch (rule) {
    case "monochromatic":
      // Generate monochromatic shades by varying lightness
      palette.push(hslToHex(h, s, Math.min(100, l + 20))); // Lighter
      palette.push(baseColor);
      palette.push(hslToHex(h, s, Math.max(0, l - 20))); // Darker
      break;
    case "complementary":
      const complementary = getComplementaryColor(baseColor);
      if (complementary) {
        palette.push(baseColor);
        palette.push(complementary);
      }
      break;
    case "analogous":
      const analogous = getAnalogousColors(baseColor);
      if (analogous) {
        palette = analogous;
      }
      break;
    case "triadic":
      const triadic = getTriadicColors(baseColor);
      if (triadic) {
        palette = triadic;
      }
      break;
    case "tetradic":
      const tetradic = getTetradicColors(baseColor);
      if (tetradic) {
        palette = tetradic;
      }
      break;
    default:
      palette.push(baseColor);
      break;
  }
  return palette;
};

const PaletteGeneratorContainer = styled.div`
  background-color: var(--card-background);
  border-radius: 15px;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  width: 90%;
  max-width: 90%;
  overflow: hidden;
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 5px;
  justify-content: center;
  align-items: center;
`;

const PaletteDisplay = styled.div`
  display: flex;
  flex-wrap: wrap; /* Allow wrapping */
  gap: 5px;
  margin-top: 5px;
  justify-content: center; /* Center items horizontally */
  overflow-x: hidden; /* Enable horizontal scrolling if content overflows */
  padding-bottom: 10px; /* Add some padding for scrollbar */
`;

const Button = styled.button`
  background-color: var(--button-background);
  color: var(--button-text);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: var(--button-hover-background);
  }

  &:disabled {
    background-color: var(--border-color);
    cursor: not-allowed;
    box-shadow: none;
    color: var(--text-color);
  }
`;

interface FormattedPaletteColor {
  hex: string | null;
  rgb: string | null;
  hsl: string | null;
}

interface PaletteJson {
  baseColor: FormattedPaletteColor;
  harmonyRules: {
    complementary: FormattedPaletteColor[] | null;
    analogous: FormattedPaletteColor[] | null;
    triadic: FormattedPaletteColor[] | null;
    tetradic: FormattedPaletteColor[] | null;
  };
}

const ColorPaletteGenerator: React.FC = () => {
  const [baseColor, setBaseColor] = useState<string>("#3498db"); // Default blue
  const [harmonyRule, setHarmonyRule] = useState<string>("monochromatic");
  const [generatedPalette, setGeneratedPalette] = useState<string[]>([]);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [jsonModalData, setJsonModalData] = useState<PaletteJson | null>(null);

  // Effect to generate palette whenever baseColor or harmonyRule changes
  React.useEffect(() => {
    setGeneratedPalette(generatePalette(baseColor, harmonyRule));
  }, [baseColor, harmonyRule]);

  const formatColor = (color: string): FormattedPaletteColor => ({
    hex: color.toUpperCase(),
    rgb: hexToRgb(color),
    hsl: hexToHsl(color),
  });

  const getFormattedPaletteJson = (): PaletteJson => {
    const complementaryColors = getComplementaryColor(baseColor);
    const analogousColors = getAnalogousColors(baseColor);
    const triadicColors = getTriadicColors(baseColor);
    const tetradicColors = getTetradicColors(baseColor);

    return {
      baseColor: formatColor(baseColor),
      harmonyRules: {
        complementary: complementaryColors
          ? [formatColor(complementaryColors)]
          : null,
        analogous: analogousColors ? analogousColors.map(formatColor) : null,
        triadic: triadicColors ? triadicColors.map(formatColor) : null,
        tetradic: tetradicColors ? tetradicColors.map(formatColor) : null,
      },
    };
  };

  const handleShowJsonModal = () => {
    setJsonModalData(getFormattedPaletteJson());
    setShowJsonModal(true);
  };

  const handleCloseJsonModal = () => {
    setShowJsonModal(false);
    setJsonModalData(null);
  };

  return (
    <PaletteGeneratorContainer>
      <h2>Generador de Paletas de Colores</h2>
      <Controls>
        <ColorPicker value={baseColor} onChange={setBaseColor} />
        <select
          id="harmonyRule"
          value={harmonyRule}
          onChange={(e) => setHarmonyRule(e.target.value)}
        >
          <option value="monochromatic">Monocromática</option>
          <option value="analogous">Análoga</option>
          <option value="complementary">Complementaria</option>
          <option value="triadic">Triádica</option>
          <option value="tetradic">Tetrádica</option>
        </select>
        <Button onClick={handleShowJsonModal}>Exportar Paleta a JSON</Button>
      </Controls>
      <PaletteDisplay>
        {generatedPalette.map((color, index) => (
          <ColorCard
            key={index}
            color={color}
            colorFormat="hex"
            isCompact={true}
            sizeMultiplier={0.5}
          />
        ))}
      </PaletteDisplay>
      <JsonModal
        show={showJsonModal}
        onClose={handleCloseJsonModal}
        jsonData={jsonModalData}
      />
    </PaletteGeneratorContainer>
  );
};

export default ColorPaletteGenerator;
