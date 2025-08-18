import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ColorPicker from "./ColorPicker";
import ColorCard from "./ColorCard";
import JsonModal from "./JsonModal";
import {
  getComplementaryColor,
  getAnalogousColors,
  getTriadicColors,
  getTetradicColors,
  hexToRgb,
  hexToHsl,
} from "../utils/colorUtils";

const HarmonyGeneratorContainer = styled.div`
  background-color: var(--card-background);
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin: 10px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%;
  max-width: 700px;
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HarmonySection = styled.div`
  width: 100%;
  text-align: center;
`;

const HarmonyTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 5px;
  color: var(--primary-color);
`;

const HarmonyPalette = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  padding: 1px;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
    /* Altura fija para consistencia en móvil, aplicada a los elementos */
    & > div {
      height: 40px;
    }
  }

  @media (min-width: 769px) {
    flex-wrap: nowrap;
    overflow-x: auto;
  }
`;

const ExportButton = styled.button`
  background-color: var(--button-background);
  color: var(--button-text);
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold; /* Negrita */
  margin-top: 20px;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: var(--button-hover-background);
  }
`;

interface ColorHarmonyGeneratorProps {
  colorFormat: string;
  palette: string[];
  onHarmonyChange: (newColors: string[]) => void;
}

const ColorHarmonyGenerator: React.FC<ColorHarmonyGeneratorProps> = ({
  colorFormat,
  palette,
  onHarmonyChange,
}) => {
  const [baseColor, setBaseColor] = useState(palette[0] || "#3498db");
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonData, setJsonData] = useState("");

  useEffect(() => {
    if (baseColor && isValidHex(baseColor)) {
      const complementary = getComplementaryColor(baseColor);
      const analogous = getAnalogousColors(baseColor);
      const triadic = getTriadicColors(baseColor);
      const tetradic = getTetradicColors(baseColor);

      const newColors = [
        baseColor,
        complementary,
        ...(analogous ? analogous.filter((color) => color !== baseColor) : []),
        ...(triadic ? triadic.filter((color) => color !== baseColor) : []),
        ...(tetradic ? tetradic.filter((color) => color !== baseColor) : []),
      ].filter((c): c is string => c !== null);

      onHarmonyChange(newColors);
    }
  }, [baseColor, onHarmonyChange]);

  // Scroll lock effect
  useEffect(() => {
    if (showJsonModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showJsonModal]);

  const handleBaseColorChange = (color: string) => {
    setBaseColor(color);
  };

  const isValidHex = (hex: string) =>
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);

  const formatColorData = (hex: string) => {
    return {
      hex: hex,
      rgb: hexToRgb(hex),
      hsl: hexToHsl(hex),
    };
  };

  const generateJsonData = () => {
    const complementary = getComplementaryColor(baseColor);
    const analogous = getAnalogousColors(baseColor);
    const triadic = getTriadicColors(baseColor);
    const tetradic = getTetradicColors(baseColor);

    const data = {
      baseColor: formatColorData(baseColor),
      harmonies: {
        complementary: complementary ? formatColorData(complementary) : null,
        analogous: analogous
          ? analogous.map((color) => formatColorData(color))
          : [],
        triadic: triadic ? triadic.map((color) => formatColorData(color)) : [],
        tetradic: tetradic
          ? tetradic.map((color) => formatColorData(color))
          : [],
      },
    };
    setJsonData(JSON.stringify(data, null, 2));
    setShowJsonModal(true);
  };

  const renderHarmonySection = (
    title: string,
    description: string,
    colors: (string | null)[] | null
  ) => {
    if (!colors || colors.length === 0) return null;

    return (
      <HarmonySection>
        <HarmonyTitle>{title}</HarmonyTitle>
        <p>{description}</p>
        <HarmonyPalette>
          {colors.map((color, index) => {
            if (!color) return null;
            return (
              <ColorCard
                key={index}
                color={color}
                colorFormat={colorFormat}
                $isHarmonyCard={true}
              />
            );
          })}
        </HarmonyPalette>
      </HarmonySection>
    );
  };

  return (
    <HarmonyGeneratorContainer>
      <h2>Generador de Armonías de Color</h2>
      <InputGroup>
        <label htmlFor="baseColor">Color Base:</label>
        <input
          type="text"
          id="baseColor"
          value={baseColor}
          onChange={(e) => handleBaseColorChange(e.target.value)}
          style={{
            padding: "10px",
            border: `1px solid ${
              isValidHex(baseColor) ? "var(--input-border)" : "red"
            }`,
            borderRadius: "25px",
            fontSize: "1rem",
            textAlign: "center",
            backgroundColor: "var(--input-background)",
            color: "var(--text-color)",
            transition:
              "border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease",
          }}
        />
        <ColorPicker value={baseColor} onChange={handleBaseColorChange} />
      </InputGroup>

      {isValidHex(baseColor) ? (
        <>
          {renderHarmonySection(
            "Complementario",
            "El color complementario se encuentra directamente opuesto al color base en la rueda de colores, creando un contraste fuerte y vibrante.",
            [baseColor, getComplementaryColor(baseColor)]
          )}
          {renderHarmonySection(
            "Análogos",
            "Los colores análogos son aquellos que se encuentran uno al lado del otro en la rueda de colores. Crean una sensación de armonía y tranquilidad.",
            getAnalogousColors(baseColor)
          )}
          {renderHarmonySection(
            "Triádicos",
            "Los colores triádicos son tres colores espaciados uniformemente alrededor de la rueda de colores. Ofrecen un contraste equilibrado y una paleta rica.",
            getTriadicColors(baseColor)
          )}
          {renderHarmonySection(
            "Tetrádicos (Doble Complementario)",
            "Los colores tetrádicos consisten en dos pares de colores complementarios. Es una combinación rica y compleja que ofrece muchas posibilidades.",
            getTetradicColors(baseColor)
          )}
          <ExportButton onClick={generateJsonData}>
            Exportar Armonías JSON
          </ExportButton>
        </>
      ) : (
        <p>
          Por favor, introduce un código hexadecimal válido para generar
          armonías.
        </p>
      )}

      <JsonModal
        show={showJsonModal}
        onClose={() => setShowJsonModal(false)}
        jsonData={jsonData}
      />
    </HarmonyGeneratorContainer>
  );
};

export default ColorHarmonyGenerator;
