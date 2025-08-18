import React, { useState, useCallback } from "react";
import styled from "styled-components";
import ColorPicker from "./ColorPicker"; // Assuming ColorPicker is available
import JsonModal from "./JsonModal"; // Import JsonModal
import { hexToRgb, hexToHsl } from "../utils/colorUtils";
import { useTheme } from "../contexts/useTheme"; // Import useTheme

const ColorBlindnessType = {
  Normal: "Normal",
  Protanopia: "Protanopia",
  Deuteranopia: "Deuteranopia",
  Tritanopia: "Tritanopia",
} as const;

type ColorBlindnessType =
  (typeof ColorBlindnessType)[keyof typeof ColorBlindnessType];

interface RGB {
  r: number;
  g: number;
  b: number;
}

const SimulatorContainer = styled.div`
  padding: 20px;
  border-radius: 10px;
  background-color: var(--card-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: var(--text-color);
  text-align: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto; /* Changed margin to 0 auto */
  box-sizing: border-box;
`;

const Title = styled.h2`
  color: auto;
  margin-bottom: 20px;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
`;

const ExplanationParagraph = styled.p`
  margin-top: 20px;
  padding: 15px;
  background-color: var(--secondary-background);
  border-radius: 8px;
  font-size: 0.95rem;
  line-height: 1.5;
  text-align: left;
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const ColorDisplayContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  width: 100%; /* Explicitly set width to 100% */
  @media (max-width: 768px) {
    gap: 10px; /* Smaller gap for mobile */
  }
`;

const DisplayColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  min-width: 150px;
  @media (max-width: 768px) {
    min-width: unset; /* Remove min-width on mobile */
    flex-basis: 100%; /* Take full width on mobile */
  }
`;

const ColorBox = styled.div<{ color: string }>`
  width: 100%;
  height: 100px;
  background-color: ${(props) => props.color};
  border: 1px solid var(--border-color);
  border-radius: 5px;
  display: flex;
  flex-direction: column; /* Changed to column to stack text */
  align-items: center;
  justify-content: center;
  color: ${(props) => {
    const rgb = parseHexToRgbObject(props.color); // Use original hex for brightness
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? "black" : "white";
  }};
  font-size: 0.9rem;
  font-weight: bold;
  word-break: break-all; /* Added to prevent overflow of long text */
`;

const TypeSelector = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  background-color: var(--secondary-background);
  padding: 10px 12px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  color: var(--text-color);

  &:hover {
    background-color: var(--border-color);
  }

  input[type="radio"] {
    accent-color: var(--primary-color);
  }
`;

const StyledButton = styled.button<{ theme: string }>`
  background-color: var(--primary-color);
  color: ${(props) =>
    props.theme === "light" ? "white" : "black"}; /* Dynamic text color */
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #209ce4ff;
  }
`;

// Helper to convert hex to RGB
const parseHexToRgbObject = (hex: string): RGB => {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return { r, g, b };
};

// Helper to convert RGB to hex
const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (c: number) => {
    const hex = Math.round(c).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

// Color blindness simulation functions (simplified for demonstration)
// These are based on general transformation matrices. For more accuracy,
// consider more complex models or libraries.

// Protanopia (red-green color blindness, red cones are missing)
const simulateProtanopia = (rgb: RGB): RGB => {
  const r = rgb.r;
  const g = rgb.g;
  const b = rgb.b;

  const newR = 0.56667 * r + 0.43333 * g + 0.0 * b;
  const newG = 0.55833 * r + 0.44167 * g + 0.0 * b;
  const newB = 0.0 * r + 0.24167 * g + 0.75833 * b;

  return {
    r: Math.min(255, Math.max(0, newR)),
    g: Math.min(255, Math.max(0, newG)),
    b: Math.min(255, Math.max(0, newB)),
  };
};

// Deuteranopia (red-green color blindness, green cones are missing)
const simulateDeuteranopia = (rgb: RGB): RGB => {
  const r = rgb.r;
  const g = rgb.g;
  const b = rgb.b;

  const newR = 0.625 * r + 0.375 * g + 0.0 * b;
  const newG = 0.7 * r + 0.3 * g + 0.0 * b;
  const newB = 0.0 * r + 0.3 * g + 0.7 * b;

  return {
    r: Math.min(255, Math.max(0, newR)),
    g: Math.min(255, Math.max(0, newG)),
    b: Math.min(255, Math.max(0, newB)),
  };
};

// Tritanopia (blue-yellow color blindness, blue cones are missing)
const simulateTritanopia = (rgb: RGB): RGB => {
  const r = rgb.r;
  const g = rgb.g;
  const b = rgb.b;

  const newR = 0.95 * r + 0.05 * g + 0.0 * b;
  const newG = 0.0 * r + 0.43333 * g + 0.56667 * b;
  const newB = 0.0 * r + 0.475 * g + 0.525 * b;

  return {
    r: Math.min(255, Math.max(0, newR)),
    g: Math.min(255, Math.max(0, newG)),
    b: Math.min(255, Math.max(0, newB)),
  };
};

const ColorBlindnessSimulator: React.FC = () => {
  const { theme } = useTheme(); // Get the current theme
  const [selectedColor, setSelectedColor] = useState<string>("#007bff"); // Default blue
  const [blindnessType, setBlindnessType] = useState<ColorBlindnessType>(
    ColorBlindnessType.Normal
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jsonData, setJsonData] = useState<unknown>({}); // Initialize with an empty object

  const explanations: Record<ColorBlindnessType, string> = {
    [ColorBlindnessType.Normal]: "",
    [ColorBlindnessType.Protanopia]:
      "La protanopia es un tipo de daltonismo rojo-verde en el que los conos rojos están ausentes o no funcionan correctamente. Las personas con protanopia tienen dificultades para distinguir entre los colores rojo y verde. Los rojos pueden aparecer más amarillos, naranjas o incluso negros. Generalmente, ven los colores en tonos de azul o dorado.",
    [ColorBlindnessType.Deuteranopia]:
      "La deuteranopia es un tipo de daltonismo rojo-verde en el que los conos verdes están ausentes o no funcionan correctamente. Las personas con deuteranopia tienen dificultades para distinguir entre los pigmentos rojos y verdes. Pueden confundir los rojos medios con los verdes medios, los azul-verdes con el gris y los rosas medios, y los amarillos con los tonos brillantes de verde. Generalmente perciben el mundo en tonos azules y dorados, o colores generalmente apagados.",
    [ColorBlindnessType.Tritanopia]:
      "La tritanopia es una forma rara de daltonismo, a menudo llamada daltonismo azul-amarillo. Las personas con tritanopia tienen dificultades para distinguir entre los colores azul y amarillo. Tienen una visión normal del rojo y el verde, pero luchan con colores que contienen azul o amarillo, como el azul-verde, el amarillo-rosa y el púrpura-rojo. Esto se debe a la ausencia o mal funcionamiento de los conos sensibles a las longitudes de onda cortas (conos S) en la retina, que son responsables de detectar el color azul.",
  };

  const handleColorChange = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  const getSimulatedColor = useCallback(
    (color: string, type: ColorBlindnessType): string => {
      if (type === ColorBlindnessType.Normal) {
        return color;
      }

      const rgb = parseHexToRgbObject(color);
      let simulatedRgb: RGB;

      switch (type) {
        case ColorBlindnessType.Protanopia:
          simulatedRgb = simulateProtanopia(rgb);
          break;
        case ColorBlindnessType.Deuteranopia:
          simulatedRgb = simulateDeuteranopia(rgb);
          break;
        case ColorBlindnessType.Tritanopia:
          simulatedRgb = simulateTritanopia(rgb);
          break;
        default:
          simulatedRgb = rgb;
      }
      const simulatedHex = rgbToHex(
        simulatedRgb.r,
        simulatedRgb.g,
        simulatedRgb.b
      );
      return simulatedHex;
    },
    []
  );

  const handleExportJson = useCallback(() => {
    const data: {
      [key: string]: { hex: string; rgb: string; hsl: string | null };
    } = {};
    Object.values(ColorBlindnessType).forEach((type) => {
      const simulatedHex = getSimulatedColor(selectedColor, type);
      const simulatedRgbString = hexToRgb(simulatedHex);
      const simulatedHslString = hexToHsl(simulatedHex);
      data[type] = {
        hex: simulatedHex,
        rgb: simulatedRgbString!,
        hsl: simulatedHslString,
      };
    });
    setJsonData(data as unknown); // Cast to unknown to match JsonModalProps
    setIsModalOpen(true);
  }, [selectedColor, getSimulatedColor]);

  const simulatedColor = getSimulatedColor(selectedColor, blindnessType);

  return (
    <SimulatorContainer>
      <Title>Simulador de Daltonismo</Title>
      <Controls>
        <ColorPicker value={selectedColor} onChange={handleColorChange} />
        <TypeSelector>
          {Object.values(ColorBlindnessType).map((type) => (
            <RadioLabel key={type}>
              <input
                type="radio"
                name="blindnessType"
                value={type}
                checked={blindnessType === type}
                onChange={() => setBlindnessType(type)}
              />
              {type}
            </RadioLabel>
          ))}
        </TypeSelector>
        <StyledButton onClick={handleExportJson} theme={theme}>
          Exportar JSON
        </StyledButton>
      </Controls>
      {blindnessType !== ColorBlindnessType.Normal && (
        <ExplanationParagraph>
          {explanations[blindnessType]}
        </ExplanationParagraph>
      )}
      <ColorDisplayContainer>
        <DisplayColumn>
          <h3>Color Original</h3>
          <ColorBox color={selectedColor}>
            {selectedColor.toUpperCase()}
            <br />
            RGB: {parseHexToRgbObject(selectedColor).r},{" "}
            {parseHexToRgbObject(selectedColor).g},{" "}
            {parseHexToRgbObject(selectedColor).b}
          </ColorBox>
        </DisplayColumn>
        <DisplayColumn>
          <h3>Color Simulado ({blindnessType})</h3>
          <ColorBox color={simulatedColor}>
            {simulatedColor.toUpperCase()}
            <br />
            RGB: {parseHexToRgbObject(simulatedColor).r},{" "}
            {parseHexToRgbObject(simulatedColor).g},{" "}
            {parseHexToRgbObject(simulatedColor).b}
          </ColorBox>
        </DisplayColumn>
      </ColorDisplayContainer>
      {isModalOpen && (
        <JsonModal
          show={isModalOpen}
          jsonData={jsonData}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </SimulatorContainer>
  );
};

export default ColorBlindnessSimulator;
