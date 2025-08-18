import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { blendColors, getContrastingTextColor } from "../utils/colorUtils";
import ColorCard from "./ColorCard";
import ColorPicker from "./ColorPicker";
import JsonModal from "./JsonModal";
import { hexToRgb, hexToHsl } from "../utils/colorUtils";

const BlenderContainer = styled.div`
  background-color: var(--card-background);
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin: 10px auto; /* Added auto for horizontal centering */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  width: 90%;
  max-width: 600px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

const SliderContainer = styled.div`
  width: 80%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Slider = styled.input`
  -webkit-appearance: none;
  margin: 15px;
  width: 100%;
  height: 7px;
  background: var(--border-color);
  border-radius: 5px;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s, background-color 0.3s ease;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
  }
`;

const BlendedColorDisplay = styled.div<{ color: string; textColor: string }>`
  width: 150px;
  height: 80px;
  background-color: ${(props) => props.color};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${(props) => props.textColor};
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;

const BlendedPaletteContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  margin-top: 5px;
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

interface FormattedBlendedColor {
  hex: string | null;
  rgb: string | null;
  hsl: string | null;
  blendRatio: string;
}

interface BlendedPaletteJson {
  originalColors: {
    color1: string;
    color2: string;
  };
  manualBlendedColor: FormattedBlendedColor | null;
  blendedColors: FormattedBlendedColor[];
}

const ColorBlender: React.FC = () => {
  const [color1, setColor1] = useState<string>("#FF0000");
  const [color2, setColor2] = useState<string>("#0000FF");
  const [blendRatio, setBlendRatio] = useState<number>(0.5); // 0 to 1
  const [blendedColor, setBlendedColor] = useState<string | null>(null);
  const [blendedPalette, setBlendedPalette] = useState<string[]>([]);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [jsonModalData, setJsonModalData] = useState<BlendedPaletteJson | null>(
    null
  );

  useEffect(() => {
    const result = blendColors(color1, color2, blendRatio);
    setBlendedColor(result);

    // Generate a small palette of intermediate colors
    const palette: string[] = [];
    for (let i = 0; i <= 10; i++) {
      const ratio = i / 10;
      const intermediateColor = blendColors(color1, color2, ratio);
      if (intermediateColor) {
        palette.push(intermediateColor);
      }
    }
    setBlendedPalette(palette);
  }, [color1, color2, blendRatio]);

  // Effect to prevent body scrolling when modal is open
  useEffect(() => {
    if (showJsonModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open"); // Clean up on unmount
    };
  }, [showJsonModal]);

  const handleRatioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlendRatio(parseFloat(e.target.value));
  };

  const getFormattedBlendedPaletteJson = (): BlendedPaletteJson => {
    const blendedColors: FormattedBlendedColor[] = [];
    for (let i = 0; i <= 10; i++) {
      const ratio = i / 10;
      const intermediateColor = blendColors(color1, color2, ratio);
      if (intermediateColor) {
        blendedColors.push({
          hex: intermediateColor.toUpperCase(),
          rgb: hexToRgb(intermediateColor),
          hsl: hexToHsl(intermediateColor),
          blendRatio: `${(ratio * 100).toFixed(0)}%`,
        });
      }
    }

    // Format the manualBlendedColor
    let manualBlendedColorFormatted: FormattedBlendedColor | null = null;
    if (blendedColor) {
      manualBlendedColorFormatted = {
        hex: blendedColor.toUpperCase(),
        rgb: hexToRgb(blendedColor),
        hsl: hexToHsl(blendedColor),
        blendRatio: `${(blendRatio * 100).toFixed(0)}%`, // Use the current blendRatio
      };
    }

    return {
      originalColors: {
        color1: color1.toUpperCase(),
        color2: color2.toUpperCase(),
      },
      manualBlendedColor: manualBlendedColorFormatted,
      blendedColors: blendedColors,
    };
  };

  const handleShowJsonModal = () => {
    setJsonModalData(getFormattedBlendedPaletteJson());
    setShowJsonModal(true);
  };

  const handleCloseJsonModal = () => {
    setShowJsonModal(false);
    setJsonModalData(null);
  };

  return (
    <BlenderContainer>
      <h2>Mezclador de Colores</h2>
      <InputGroup>
        <ColorPicker value={color1} onChange={setColor1} />
        <ColorPicker value={color2} onChange={setColor2} />
      </InputGroup>
      <SliderContainer>
        <label>Ratio de Mezcla: {(blendRatio * 100).toFixed(0)}%</label>
        <Slider
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={blendRatio}
          onChange={handleRatioChange}
        />
      </SliderContainer>

      {blendedColor && (
        <BlendedColorDisplay
          color={blendedColor}
          textColor={getContrastingTextColor(blendedColor)}
        >
          {blendedColor.toUpperCase()}
        </BlendedColorDisplay>
      )}
      <h2>Variantes</h2>
      <BlendedPaletteContainer>
        {blendedPalette.map((color, index) => (
          <ColorCard
            key={index}
            color={color}
            isLocked={false}
            toggleLock={() => {}}
            colorFormat="hex"
            isCompact={true}
          />
        ))}
      </BlendedPaletteContainer>
      <Button onClick={handleShowJsonModal} style={{ marginTop: "20px" }}>
        Exportar Variantes a JSON
      </Button>
      <JsonModal
        show={showJsonModal}
        onClose={handleCloseJsonModal}
        jsonData={jsonModalData}
      />
    </BlenderContainer>
  );
};

export default ColorBlender;
