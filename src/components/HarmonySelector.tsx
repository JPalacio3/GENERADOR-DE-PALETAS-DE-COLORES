import React from "react";
import styled from "styled-components";
import {
  getComplementaryColor,
  getAnalogousColors,
  getTriadicColors,
  getTetradicColors,
} from "../utils/colorUtils";
import ColorCard from "./ColorCard";

interface HarmonySelectorProps {
  baseColor: string;
  harmonyType: "complementary" | "analogous" | "triadic" | "tetradic";
  onSelectColor: (color: string) => void;
}

const HarmonySelectorContainer = styled.div`
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background-color: var(--secondary-background);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

const HarmonyTitle = styled.h4`
  font-size: 1.5rem;
  color: var(--primary-color);
`;

const HarmonyPalette = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  color: auto;
`;

const HarmonySelector: React.FC<HarmonySelectorProps> = ({
  baseColor,
  harmonyType,
  onSelectColor,
}) => {
  let harmoniousColors: string[] = [];
  let title: string = "";

  switch (harmonyType) {
    case "complementary":
      harmoniousColors = [baseColor, getComplementaryColor(baseColor) || ""];
      title = "Complementario";
      break;
    case "analogous":
      harmoniousColors = getAnalogousColors(baseColor) || [];
      title = "Análogos";
      break;
    case "triadic":
      harmoniousColors = getTriadicColors(baseColor) || [];
      title = "Triádicos";
      break;
    case "tetradic":
      harmoniousColors = getTetradicColors(baseColor) || [];
      title = "Tetrádicos (Doble Complementario)";
      break;
    default:
      break;
  }

  // Filter out any null or empty strings that might come from colorUtils
  harmoniousColors = harmoniousColors.filter((color) => color);

  return (
    <HarmonySelectorContainer>
      <HarmonyTitle>{title}</HarmonyTitle>
      <HarmonyPalette>
        {harmoniousColors.map((color, index) => (
          <ColorCard
            key={index}
            color={color}
            isLocked={false} // Not relevant for this component
            toggleLock={() => {}} // Not relevant for this component
            colorFormat="hex"
            onClick={() => onSelectColor(color)} // Make it clickable
            style={{ cursor: "pointer" }}
          />
        ))}
      </HarmonyPalette>
    </HarmonySelectorContainer>
  );
};

export default HarmonySelector;
