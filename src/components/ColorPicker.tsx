import React, { useRef } from "react";
import styled from "styled-components";
import { hexToHsl } from "../utils/colorUtils";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const PickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 95%;
`;

const ColorInput = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
  border: none;
  background-color: transparent;
  visibility: hidden; /* Hide the actual input */
`;

const CustomColorSwatch = styled.div<{ color: string }>`
  width: 100px;
  height: 40px;
  border-radius: 10px;
  border: 2px solid #ddd;
  background-color: ${(props) => props.color};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  color: ${(props) => {
    const hex = props.color.startsWith("#") ? props.color : "#000000"; // Default to black if not a hex
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "black" : "white";
  }};
  text-transform: uppercase;
`;

const PickerText = styled.span`
  font-size: 1rem;
  color: var(--text-color);
`;

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleSwatchClick = () => {
    colorInputRef.current?.click();
  };

  return (
    <PickerContainer>
      <PickerText style={{ color: hexToHsl("#0099ff") ?? "#000" }}>
        Selecciona un color:
      </PickerText>
      <CustomColorSwatch color={value} onClick={handleSwatchClick}>
        {value.toUpperCase()}
      </CustomColorSwatch>
      <ColorInput
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        ref={colorInputRef}
      />
    </PickerContainer>
  );
};

export default ColorPicker;
