import React, { useState } from "react";
import styled from "styled-components";
import { FiCopy } from "react-icons/fi";
import {
  hexToRgb,
  hexToHsl,
  getContrastingTextColor,
} from "../utils/colorUtils";

interface ColorCardProps {
  color: string;
  isLocked?: boolean;
  toggleLock?: () => void;
  colorFormat: string;
  isCompact?: boolean;
  isExtraCompact?: boolean; // New prop
  $isHarmonyCard?: boolean; // New prop for harmony generator cards
  sizeMultiplier?: number; // New prop for scaling compact size
  widthMultiplier?: number; // New prop for scaling extra compact width
  onClick?: () => void;
  style?: React.CSSProperties;
}

const ColorCardContainer = styled.div<{
  $isLocked?: boolean;
  color: string;
  $textColor: string;
  $isCompact?: boolean;
  $isExtraCompact?: boolean; // New prop
  $isHarmonyCard?: boolean; // New prop for harmony generator cards
  $sizeMultiplier?: number; // New prop for scaling compact size
  $widthMultiplier?: number; // New prop for scaling extra compact width
}>`
  flex-basis: ${(props) =>
    props.$isHarmonyCard
      ? "52.5px"
      : props.$isExtraCompact
      ? props.$widthMultiplier
        ? `${72 * props.$widthMultiplier}px`
        : "72px"
      : props.$isCompact
      ? props.$sizeMultiplier
        ? `calc(auto * ${props.$sizeMultiplier})`
        : "auto"
      : "50px"};
  max-width: ${(props) =>
    props.$isHarmonyCard
      ? "52.5px"
      : props.$isExtraCompact
      ? props.$widthMultiplier
        ? `${72 * props.$widthMultiplier}px`
        : "72px"
      : props.$isCompact
      ? props.$sizeMultiplier
        ? `calc(fit-content * ${props.$sizeMultiplier})`
        : "fit-content"
      : "95%"};
  height: ${(props) =>
    props.$isHarmonyCard
      ? "40px"
      : props.$isExtraCompact
      ? "40px"
      : props.$isCompact
      ? props.$sizeMultiplier
        ? `calc(auto * ${props.$sizeMultiplier})`
        : "auto"
      : "50px"};
  border-radius: ${(props) => (props.$isCompact ? "8px" : "20px")};
  background-color: ${(props) => props.color};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${(props) =>
    props.$isHarmonyCard
      ? "0.2rem"
      : props.$isExtraCompact
      ? "0.4rem"
      : props.$isCompact
      ? props.$sizeMultiplier
        ? `${0.24 * props.$sizeMultiplier}rem ${0.6 * props.$sizeMultiplier}rem`
        : "0.24rem 0.6rem"
      : "1rem"};
  position: relative;
  border: ${(props) =>
    props.$isCompact
      ? "1px solid var(--border-color)"
      : props.$isLocked
      ? "4px solid #ffc107"
      : "transparent"};
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  color: ${(props) => props.$textColor}; /* Use dynamic text color */
  cursor: pointer;

  @media (max-width: 768px) {
    flex-basis: ${(props) =>
      props.$isHarmonyCard
        ? "calc(50% - 5px)" /* Changed from fixed 52.5px to responsive */
        : props.$isExtraCompact
        ? props.$widthMultiplier
          ? `${72 * props.$widthMultiplier}px`
          : "72px"
        : props.$isCompact
        ? props.$sizeMultiplier
          ? `calc((50% - 5px) * ${props.$sizeMultiplier})`
          : "calc(50% - 5px)"
        : "50px"};
    max-width: ${(props) =>
      props.$isHarmonyCard
        ? "100%" // Allow it to take full width within its flex-basis
        : props.$isExtraCompact
        ? props.$widthMultiplier
          ? `${72 * props.$widthMultiplier}px`
          : "72px"
        : props.$isCompact
        ? props.$sizeMultiplier
          ? `calc(fit-content * ${props.$sizeMultiplier})`
          : "fit-content"
        : "95%"};
  }
`;

const ColorCode = styled.span<{
  $textColor: string;
  $isCompact?: boolean;
  $isExtraCompact?: boolean;
  $sizeMultiplier?: number;
  $widthMultiplier?: number;
}>`
  padding: ${(props) =>
    props.$isCompact
      ? props.$sizeMultiplier
        ? `${0.1 * props.$sizeMultiplier}rem ${0.5 * props.$sizeMultiplier}rem`
        : "0.1rem 0.5rem"
      : "0.5rem 1rem"};
  background-color: transparent;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  cursor: pointer;

  font-size: ${(props) =>
    props.$isExtraCompact
      ? "0.78rem"
      : props.$isCompact
      ? props.$sizeMultiplier
        ? `${1.13 * props.$sizeMultiplier}rem`
        : "1.13rem"
      : "1.25rem"};
  color: ${(props) => props.$textColor}; /* Use dynamic text color */
`;

const CopyMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0.5rem 1rem;
  border-radius: 5px;
  animation: fadeInOut 2s;

  @keyframes fadeInOut {
    0%,
    100% {
      opacity: 0;
    }
    10%,
    90% {
      opacity: 1;
    }
  }
`;

const ColorCard: React.FC<ColorCardProps> = ({
  color,
  isLocked,
  colorFormat,
  isCompact,
  isExtraCompact, // New prop
  onClick,
  style,
}) => {
  const [copied, setCopied] = useState(false);
  const contrastingTextColor = getContrastingTextColor(color);

  const getFormattedColor = () => {
    switch (colorFormat) {
      case "rgb":
        return hexToRgb(color);
      case "hsl":
        return hexToHsl(color);
      default:
        return color.toUpperCase();
    }
  };

  const handleCopy = () => {
    const formattedColor = getFormattedColor();
    if (formattedColor) {
      navigator.clipboard.writeText(formattedColor);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ColorCardContainer
      $isLocked={isLocked}
      color={color}
      $textColor={contrastingTextColor}
      $isCompact={isCompact}
      $isExtraCompact={isExtraCompact} // New prop
      onClick={onClick}
      style={style}
    >
      <ColorCode
        onClick={handleCopy}
        $textColor={contrastingTextColor}
        $isCompact={isCompact}
        $isExtraCompact={isExtraCompact} // New prop
      >
        {getFormattedColor()}
        {!isCompact && <FiCopy />}
        {/* Conditionally render copy icon */}
      </ColorCode>
      {copied && <CopyMessage>Copied!</CopyMessage>}
    </ColorCardContainer>
  );
};

export default ColorCard;
