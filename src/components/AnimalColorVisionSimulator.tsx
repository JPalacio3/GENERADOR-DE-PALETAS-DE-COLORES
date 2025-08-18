import React, { useState, useCallback } from "react";
import styled from "styled-components";
import ColorPicker from "./ColorPicker";

const AnimalVisionType = {
  Normal: "Normal",
  Dog: "Perro",
  Chicken: "Gallina",
  Cat: "Gato",
  Cow: "Vaca",
  Hummingbird: "Colibrí",
  Pigeon: "Paloma",
  Wolf: "Lobo",
  Lion: "León",
  Tiger: "Tigre",
  Mouse: "Ratón",
  Elephant: "Elefante",
  Dolphin: "Delfín",
} as const;

type AnimalVisionType =
  (typeof AnimalVisionType)[keyof typeof AnimalVisionType];

interface RGB {
  r: number;
  g: number;
  b: number;
}

const SimulatorContainer = styled.div`
  padding: 5px;
  border-radius: 10px;
  background-color: var(--card-background);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: var(--text-color);
  text-align: center;
  width: 100%;
  max-width: 800px;
  margin: 5px auto;
  box-sizing: border-box;
`;

const Title = styled.h2`
  color: auto
  margin-bottom: 20px;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
`;

const ColorDisplayContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  flex-wrap: wrap;
  width: 100%;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const DisplayColumn = styled.div<{ color: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  min-width: 150px;
  border: 1px solid var(--border-color); /* Add border */
  border-radius: 8px; /* Rounded corners for card look */
  padding: 5px; /* Padding inside the card */
  background-color: ${(props) =>
    hexToRgba(props.color, 0.1)}; /* Faded background */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); /* Subtle shadow */
  margin: 2px; /* Margin between cards */
  color: auto;
  @media (max-width: 768px) {
    min-width: unset;
    flex-basis: 100%;
  }
`;

const ColorBox = styled.div<{ color: string }>`
  width: 100%;
  height: 100px;
  background-color: ${(props) => props.color};
  border: 1px solid var(--border-color);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px; /* Add margin-bottom */
  // ajustar el color de la fuente para que se vea claro con cualquier color
  color: ${(props) => {
    const rgb = parseHexToRgbObject(props.color); // Use original hex for brightness
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? "black" : "white";
  }};
  font-size: 0.9rem;
  font-weight: bold;
  word-break: break-all;
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

// Helper to convert hex to RGBA
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Simplified Dog Vision (Dichromatic) - similar to human red-green deficiency
const simulateDogVision = (rgb: RGB): RGB => {
  const r = rgb.r;
  const g = rgb.g;
  const b = rgb.b;

  // Protanopia simulation matrix (approximated for RGB)
  // Source: https://www.color-blindness.com/color-blindness-simulators/
  const newR = 0.567 * r + 0.433 * g + 0.0 * b;
  const newG = 0.558 * r + 0.442 * g + 0.0 * b;
  const newB = 0.0 * r + 0.242 * g + 0.758 * b;

  return {
    r: Math.min(255, Math.max(0, newR)),
    g: Math.min(255, Math.max(0, newG)),
    b: Math.min(255, Math.max(0, newB)),
  };
};

const simulateChickenVision = (rgb: RGB): RGB => {
  const r = rgb.r;
  const g = rgb.g;
  const b = rgb.b;

  // Increase saturation and enhance blue/purple tones
  const saturationFactor = 1.2; // Increase saturation
  const blueEnhancement = 0.15; // Enhance blue/purple

  const newR = r * saturationFactor;
  const newG = g * saturationFactor;
  const newB = b * saturationFactor;

  // Shift some red and green towards blue to simulate UV perception and broader spectrum
  const finalR = newR - blueEnhancement * newR;
  const finalG = newG - blueEnhancement * newG;
  const finalB = newB + blueEnhancement * (newR + newG);

  // Increase overall brightness/vibrancy
  const brightnessFactor = 1.1;

  return {
    r: Math.min(255, Math.max(0, finalR * brightnessFactor)),
    g: Math.min(255, Math.max(0, finalG * brightnessFactor)),
    b: Math.min(255, Math.max(0, finalB * brightnessFactor)),
  };
};

// Simplified Cat Vision (Dichromatic)
const simulateCatVision = (rgb: RGB): RGB => {
  const r = rgb.r;
  const g = rgb.g;
  const b = rgb.b;

  // Deuteranopia simulation matrix (approximated for RGB)
  // Source: https://www.color-blindness.com/color-blindness-simulators/
  const newR = 0.62 * r + 0.38 * g + 0.0 * b;
  const newG = 0.7 * r + 0.3 * g + 0.0 * b;
  const newB = 0.0 * r + 0.3 * g + 0.7 * b;

  return {
    r: Math.min(255, Math.max(0, newR)),
    g: Math.min(255, Math.max(0, newG)),
    b: Math.min(255, Math.max(0, newB)),
  };
};

// Simplified Cow Vision (Dichromatic)
const simulateCowVision = (rgb: RGB): RGB => {
  const r = rgb.r;
  const g = rgb.g;
  const b = rgb.b;

  // Tritanopia simulation matrix (approximated for RGB)
  // Source: https://www.color-blindness.com/color-blindness-simulators/
  const newR = 0.95 * r + 0.05 * g + 0.0 * b;
  const newG = 0.0 * r + 0.93 * g + 0.07 * b;
  const newB = 0.0 * r + 0.82 * g + 0.18 * b;

  return {
    r: Math.min(255, Math.max(0, newR)),
    g: Math.min(255, Math.max(0, newG)),
    b: Math.min(255, Math.max(0, newB)),
  };
};

const simulateHummingbirdVision = (rgb: RGB): RGB => {
  const r = rgb.r;
  const g = rgb.g;
  const b = rgb.b;

  // Increase saturation significantly
  const saturationFactor = 1.5;

  const newR = r * saturationFactor;
  const newG = g * saturationFactor;
  const newB = b * saturationFactor;

  // Apply a transformation to make colors more distinct and vibrant, with a bias towards blue/purple for UV
  // This is a conceptual approximation to make it visually distinct and vibrant
  const finalR = newR * 0.9 + newG * 0.05 + newB * 0.05; // Reduce green/blue influence on red
  const finalG = newR * 0.05 + newG * 0.9 + newB * 0.05; // Reduce red/blue influence on green
  const finalB = newR * 0.1 + newG * 0.1 + newB * 1.2; // Enhance blue and add some red/green for purplish UV effect

  // Increase overall brightness
  const brightnessFactor = 1.2;

  return {
    r: Math.min(255, Math.max(0, finalR * brightnessFactor)),
    g: Math.min(255, Math.max(0, finalG * brightnessFactor)),
    b: Math.min(255, Math.max(0, finalB * brightnessFactor)),
  };
};

// Simplified Pigeon Vision (Pentachromatic - extremely simplified)
const simulatePigeonVision = (rgb: RGB): RGB => {
  const r = rgb.r;
  const g = rgb.g;
  const b = rgb.b;

  // Increase saturation and vibrancy significantly
  const saturationFactor = 1.8;
  const newR = r * saturationFactor;
  const newG = g * saturationFactor;
  const newB = b * saturationFactor;

  // Apply a transformation to make colors more distinct and vibrant, with a bias towards blue/purple for UV
  // This is a conceptual approximation to make it visually distinct and vibrant
  const finalR = newR * 1.0 - newG * 0.1 - newB * 0.1; // Reduce influence from other channels
  const finalG = newG * 1.0 - newR * 0.1 - newB * 0.1; // Reduce influence from other channels
  const finalB = newB * 1.3 + newR * 0.1 + newG * 0.1; // Enhance blue/purple and add some cross-channel influence for complexity

  // Further enhance distinctness and vibrancy
  const brightnessFactor = 1.3;

  return {
    r: Math.min(255, Math.max(0, finalR * brightnessFactor)),
    g: Math.min(255, Math.max(0, finalG * brightnessFactor)),
    b: Math.min(255, Math.max(0, finalB * brightnessFactor)),
  };
};

const simulateWolfVision = (rgb: RGB): RGB => {
  const r = rgb.r;
  const g = rgb.g;
  const b = rgb.b;

  // Calculate luminance (grayscale)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  // Blend with a blue-yellow tint to simulate dichromatic vision with reduced saturation
  // These values are illustrative and can be fine-tuned
  const blueTintB = 255;

  const yellowTintR = 255;
  const yellowTintG = 255;

  // A simple blend, favoring blue for shorter wavelengths and yellow for longer
  // This is a conceptual approximation to make it visually distinct
  const newR = luminance * 0.5 + r * 0.2 + yellowTintR * 0.3;
  const newG = luminance * 0.5 + g * 0.2 + yellowTintG * 0.3;
  const newB = luminance * 0.5 + b * 0.2 + blueTintB * 0.3;

  return {
    r: Math.min(255, Math.max(0, newR)),
    g: Math.min(255, Math.max(0, newG)),
    b: Math.min(255, Math.max(0, newB)),
  };
};
const simulateLionVision = (rgb: RGB): RGB => {
  const r = rgb.r;
  const g = rgb.g;
  const b = rgb.b;

  // Convert to grayscale
  const gray = 0.299 * r + 0.587 * g + 0.114 * b;

  // Apply strong desaturation and a subtle blue-yellow tint
  const desaturationFactor = 0.8; // Higher value means more desaturation
  const blueYellowBias = 0.1; // Subtle bias towards blue-yellow

  const newR = gray * (1 - desaturationFactor) + r * desaturationFactor;
  const newG = gray * (1 - desaturationFactor) + g * desaturationFactor;
  const newB = gray * (1 - desaturationFactor) + b * desaturationFactor;

  // Apply blue-yellow tint
  const finalR = newR + blueYellowBias * (newR - newG);
  const finalG = newG - blueYellowBias * (newR - newG);
  const finalB = newB + blueYellowBias * (newB - newR);

  return {
    r: Math.min(255, Math.max(0, finalR)),
    g: Math.min(255, Math.max(0, finalG)),
    b: Math.min(255, Math.max(0, finalB)),
  };
};

const simulateTigerVision = (rgb: RGB): RGB => {
  const r = rgb.r;
  const g = rgb.g;
  const b = rgb.b;

  // Significantly reduce red component and desaturate
  const newR = r * 0.1; // Very little red
  const newG = g * 0.8 + b * 0.2; // Emphasize green and blue
  const newB = b * 0.8 + g * 0.2; // Emphasize blue and green

  // Further desaturate by blending with a grayscale version
  const gray = (newR + newG + newB) / 3;
  const desaturationFactor = 0.7; // Strong desaturation

  const finalR = gray * (1 - desaturationFactor) + newR * desaturationFactor;
  const finalG = gray * (1 - desaturationFactor) + newG * desaturationFactor;
  const finalB = gray * (1 - desaturationFactor) + newB * desaturationFactor;

  return {
    r: Math.min(255, Math.max(0, finalR)),
    g: Math.min(255, Math.max(0, finalG)),
    b: Math.min(255, Math.max(0, finalB)),
  };
};

const simulateMouseVision = (rgb: RGB): RGB => {
  const r = rgb.r;
  const g = rgb.g;
  const b = rgb.b;

  // Reduce red component significantly
  const newR = r * 0.2;

  // Emphasize blue/purple and green, with a bias towards blue/purple for UV
  const newG = g * 0.9 + b * 0.1;
  const newB = b * 0.9 + r * 0.1; // Blend some red into blue for a purplish tint (UV approximation)

  // Desaturate
  const gray = (newR + newG + newB) / 3;
  const desaturationFactor = 0.6;

  const finalR = gray * (1 - desaturationFactor) + newR * desaturationFactor;
  const finalG = gray * (1 - desaturationFactor) + newG * desaturationFactor;
  const finalB = gray * (1 - desaturationFactor) + newB * desaturationFactor;

  return {
    r: Math.min(255, Math.max(0, finalR)),
    g: Math.min(255, Math.max(0, finalG)),
    b: Math.min(255, Math.max(0, finalB)),
  };
};

const simulateElephantVision = (rgb: RGB): RGB => {
  const r = rgb.r;
  const g = rgb.g;
  const b = rgb.b;

  // Convert to grayscale
  const gray = 0.299 * r + 0.587 * g + 0.114 * b;

  // Apply strong desaturation
  const desaturationFactor = 0.9; // Very high desaturation
  const newR = gray * (1 - desaturationFactor) + r * desaturationFactor;
  const newG = gray * (1 - desaturationFactor) + g * desaturationFactor;
  const newB = gray * (1 - desaturationFactor) + b * desaturationFactor;

  // Bias towards blue and green, minimizing red
  const finalR = newR * 0.1; // Very little red
  const finalG = newG * 1.1 + newB * 0.1; // Enhance green, slight blue influence
  const finalB = newB * 1.1 + newG * 0.1; // Enhance blue, slight green influence

  return {
    r: Math.min(255, Math.max(0, finalR)),
    g: Math.min(255, Math.max(0, finalG)),
    b: Math.min(255, Math.max(0, finalB)),
  };
};

const simulateDolphinVision = (rgb: RGB): RGB => {
  const r = rgb.r;
  const g = rgb.g;
  const b = rgb.b;

  // Convert to grayscale
  const gray = 0.299 * r + 0.587 * g + 0.114 * b;

  // Apply a slight blue/green tint
  const blueGreenTintFactor = 0.15; // Adjust for desired tint strength

  const newR = gray * (1 - blueGreenTintFactor);
  const newG = gray * (1 + blueGreenTintFactor * 0.5); // Enhance green slightly
  const newB = gray * (1 + blueGreenTintFactor); // Enhance blue

  return {
    r: Math.min(255, Math.max(0, newR)),
    g: Math.min(255, Math.max(0, newG)),
    b: Math.min(255, Math.max(0, newB)),
  };
};

const visionDescriptions: Record<AnimalVisionType, string> = {
  [AnimalVisionType.Normal]:
    "Visión humana tricromática. Percibe una amplia gama de colores.",
  [AnimalVisionType.Dog]:
    "Visión dicromática. Ven el mundo en tonos de azul y amarillo, con dificultad para distinguir entre rojo y verde.",
  [AnimalVisionType.Chicken]:
    "Visión tetracromática. Pueden ver colores que los humanos no, incluyendo el ultravioleta, lo que les da una percepción del color muy rica.",
  [AnimalVisionType.Cat]:
    "Visión dicromática. Similar a los perros, ven principalmente en tonos de azul y verde, con una percepción limitada de rojos y naranjas.",
  [AnimalVisionType.Cow]:
    "Visión dicromática. Su visión es similar a la de los daltónicos rojo-verde en humanos, percibiendo el mundo en tonos de azul y amarillo.",
  [AnimalVisionType.Hummingbird]:
    "Visión tetracromática. Pueden ver el espectro ultravioleta, lo que les permite percibir colores y patrones en las flores que son invisibles para los humanos.",
  [AnimalVisionType.Pigeon]:
    "Visión pentacromática. Con cinco tipos de conos, tienen una de las visiones de color más complejas, percibiendo una gama de colores extremadamente amplia y detallada.",
  [AnimalVisionType.Wolf]:
    "Visión dicromática. Similar a los perros, su visión está adaptada para la caza en condiciones de poca luz, con una percepción limitada de los colores.",
  [AnimalVisionType.Lion]:
    "Visión dicromática. Como otros felinos, los leones ven el mundo en tonos de azul y verde, lo que les ayuda a camuflarse y cazar en su entorno.",
  [AnimalVisionType.Tiger]:
    "Visión dicromática. Similar a los leones, los tigres tienen una visión adaptada a la noche, con una percepción de color limitada a azules y verdes.",
  [AnimalVisionType.Mouse]:
    "Visión dicromática. Ven el mundo en tonos de azul y verde, con una sensibilidad particular a la luz ultravioleta, útil para encontrar alimentos y evitar depredadores.",
  [AnimalVisionType.Elephant]:
    "Visión dicromática. Perciben el mundo en tonos de azul y amarillo, con una capacidad limitada para distinguir entre rojos y verdes.",
  [AnimalVisionType.Dolphin]:
    "Visión monocromática. Los delfines tienen un solo tipo de cono, lo que significa que ven el mundo en escalas de grises, sin percibir colores.",
};

const DescriptionText = styled.p`
  margin-top: 10px;
  font-size: 0.85rem;
  line-height: 1.4;
  text-align: center;
  max-width: 150px; // To keep it concise and aligned

  @media (max-width: 768px) {
    width: 90%;
    max-width: unset; /* Remove max-width on small screens */
    margin-left: auto;
    margin-right: auto;
  }
`;

const AnimalColorVisionSimulator: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<string>("#007bff");

  const handleColorChange = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  const getSimulatedColor = useCallback(
    (color: string, type: AnimalVisionType): string => {
      if (type === AnimalVisionType.Normal) {
        return color;
      }

      const rgb = parseHexToRgbObject(color);
      let simulatedRgb: RGB;

      switch (type) {
        case AnimalVisionType.Dog:
          simulatedRgb = simulateDogVision(rgb);
          break;
        case AnimalVisionType.Chicken:
          simulatedRgb = simulateChickenVision(rgb);
          break;
        case AnimalVisionType.Cat:
          simulatedRgb = simulateCatVision(rgb);
          break;
        case AnimalVisionType.Cow:
          simulatedRgb = simulateCowVision(rgb);
          break;
        case AnimalVisionType.Hummingbird:
          simulatedRgb = simulateHummingbirdVision(rgb);
          break;
        case AnimalVisionType.Pigeon:
          simulatedRgb = simulatePigeonVision(rgb);
          break;
        case AnimalVisionType.Wolf:
          simulatedRgb = simulateWolfVision(rgb);
          break;
        case AnimalVisionType.Lion:
          simulatedRgb = simulateLionVision(rgb);
          break;
        case AnimalVisionType.Tiger:
          simulatedRgb = simulateTigerVision(rgb);
          break;
        case AnimalVisionType.Mouse:
          simulatedRgb = simulateMouseVision(rgb);
          break;
        case AnimalVisionType.Elephant:
          simulatedRgb = simulateElephantVision(rgb);
          break;
        case AnimalVisionType.Dolphin:
          simulatedRgb = simulateDolphinVision(rgb);
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

  return (
    <SimulatorContainer>
      <Title>Así ven los colores los animales</Title>
      <Controls>
        <ColorPicker value={selectedColor} onChange={handleColorChange} />
      </Controls>
      <ColorDisplayContainer>
        {Object.values(AnimalVisionType)
          .filter((type) => type !== AnimalVisionType.Normal)
          .map((type) => {
            const simulatedColor = getSimulatedColor(selectedColor, type);
            const description = visionDescriptions[type];
            return (
              <DisplayColumn key={type} color={simulatedColor}>
                <h3>{type}</h3>
                <ColorBox color={simulatedColor}>
                  {simulatedColor.toUpperCase()}
                  <br />
                  RGB: {parseHexToRgbObject(simulatedColor).r},{" "}
                  {parseHexToRgbObject(simulatedColor).g},{" "}
                  {parseHexToRgbObject(simulatedColor).b}
                </ColorBox>
                {description && (
                  <DescriptionText>{description}</DescriptionText>
                )}
              </DisplayColumn>
            );
          })}
      </ColorDisplayContainer>
    </SimulatorContainer>
  );
};

export default AnimalColorVisionSimulator;
