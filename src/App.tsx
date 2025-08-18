import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import ColorBlender from "./components/ColorBlender";
import ColorBlindnessSimulator from "./components/ColorBlindnessSimulator";
import ColorCard from "./components/ColorCard";
import ColorContrastChecker from "./components/ColorContrastChecker";
import ColorHarmonyGenerator from "./components/ColorHarmonyGenerator";
import ColorPaletteGenerator from "./components/ColorPaletteGenerator";
import ImageColorExtractor from "./components/ImageColorExtractor";
import JsonModal from "./components/JsonModal";
import { Theme } from "./contexts/ThemeContext";
import { useTheme } from "./contexts/useTheme";
import AnimalColorVisionSimulator from "./components/AnimalColorVisionSimulator";
import { hexToRgb, hexToHsl } from "./utils/colorUtils";

interface FormattedColor {
  hex: string | null;
  rgb: string | null;
  hsl: string | null;
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  text-align: center;
  align-items: center;
  background-color: var(--background-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const Header = styled.header<{ theme: Theme; palette: string[] }>`
  background: ${(props) =>
    props.palette.length > 0
      ? `linear-gradient(to right, ${props.palette.join(", ")})`
      : props.theme === Theme.Light
      ? "#030d44ff"
      : "var(--secondary-background)"};
  padding: 0.5rem;
  border-radius: 0 0 10px 10px;
  display: flex;
  justify-content: space-evenly;
  margin: 0px;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%; /* Changed from 96% to 100% */
  box-sizing: border-box; /* Added box-sizing */
  transition: background-color 0.3s ease, color 0.3s ease;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    font-size: 5px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
  color: auto-darken;
  @media (max-width: 768px) {
    padding: 1px;
    font-size: 1rem;
  }
`;

const CardWrapper = styled.div`
  background-color: var(--card-background);
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 10px;
    margin: 5px;
  }
`;

const PaletteContainer = styled.div<{
  $isImagePalette?: boolean;
}>`
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 5px;
  align-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    ${(props) =>
      props.$isImagePalette
        ? `
      display: flex;
      flex-wrap: wrap;
      justify-content: center; /* Changed to center */
      gap: 10px;
      & > * {
        flex-basis: calc(33.33% - 10px); /* Changed to 3 per line */
        max-width: calc(33.33% - 10px); /* Changed to 3 per line */
      }
    `
        : `
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    `}
  }

  @media (min-width: 769px) {
    flex-wrap: nowrap;
    overflow-x: auto;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch; /* Allow children to stretch to full width */
  }
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--text-color);
  background: var(--secondary-background);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.3rem;
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;
`;

const Slider = styled.input`
  -webkit-appearance: none;
  max-width: 100%;
  height: 7px;
  background: var(--border-color);
  border-radius: 5px;
  outline: none;
  opacity: 0.9;
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

const Button = styled.button`
  background-color: var(--button-background);
  color: var(--button-text);
  border: none;
  padding: 1rem 2rem;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

const FormatSelector = styled.div`
  display: flex;
  gap: 3px;

  @media (max-width: 768px) {
    flex-direction: column;
    flex-wrap: wrap;
  }
`;

const ThemeToggleButton = styled(Button)`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  margin-left: 20px;
`;

const App: React.FC = () => {
  const [colorCount, setColorCount] = useState<number>(5); // Default to 5
  const [palette, setPalette] = useState<string[]>([]); // Initialize as empty
  const [lockedColors, setLockedColors] = useState<boolean[]>([]); // Initialize as empty
  const [harmonyPalette, setHarmonyPalette] = useState<string[]>([]);
  const [lockedHarmonyColors, setLockedHarmonyColors] = useState<boolean[]>([]);

  const [imageExtractedColors, setImageExtractedColors] = useState<string[]>(
    []
  );

  const [colorFormat, setColorFormat] = useState<string>("hex");
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [jsonModalData, setJsonModalData] = useState<FormattedColor[] | null>(
    null
  );

  const { theme, toggleTheme } = useTheme();

  const generateInitialPalette = useCallback((count: number) => {
    const newPalette: string[] = [];
    const newLockedColors: boolean[] = [];
    for (let i = 0; i < count; i++) {
      newPalette.push(generateRandomColor());
      newLockedColors.push(false);
    }
    return { newPalette, newLockedColors };
  }, []);

  useEffect(() => {
    try {
      const savedColorCount = localStorage.getItem("colorCount");
      const savedPalette = localStorage.getItem("palette");
      const savedLockedColors = localStorage.getItem("lockedColors");

      const initialColorCount = savedColorCount
        ? JSON.parse(savedColorCount)
        : 5;
      let initialPalette: string[];
      let initialLockedColors: boolean[];

      if (savedPalette && savedLockedColors) {
        initialPalette = JSON.parse(savedPalette);
        initialLockedColors = JSON.parse(savedLockedColors);
      } else {
        const { newPalette, newLockedColors } =
          generateInitialPalette(initialColorCount);
        initialPalette = newPalette;
        initialLockedColors = newLockedColors;
      }

      setColorCount(initialColorCount);
      setPalette(initialPalette);
      setLockedColors(initialLockedColors);
      setHarmonyPalette(initialPalette); // Initialize harmony palette with main palette
      setLockedHarmonyColors(initialLockedColors); // Initialize locked harmony colors with main locked colors
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      const { newPalette, newLockedColors } = generateInitialPalette(5); // Fallback to default
      setColorCount(5);
      setPalette(newPalette);
      setLockedColors(newLockedColors);
      setHarmonyPalette(newPalette); // Fallback harmony palette
      setLockedHarmonyColors(newLockedColors); // Fallback locked harmony colors
    }
  }, [generateInitialPalette]);

  const generateRandomColor = () => {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  };

  const getFormattedPaletteJson = () => {
    return palette.map((color) => ({
      hex: color.toUpperCase(),
      rgb: hexToRgb(color),
      hsl: hexToHsl(color),
    }));
  };

  const handleShowJsonModal = () => {
    setJsonModalData(getFormattedPaletteJson());
    setShowJsonModal(true);
  };

  const handleCloseJsonModal = () => {
    setShowJsonModal(false);
    setJsonModalData(null);
  };

  const getFormattedImageColorsJson = () => {
    return imageExtractedColors.map((color) => ({
      hex: color.toUpperCase(),
      rgb: hexToRgb(color),
      hsl: hexToHsl(color),
    }));
  };

  const handleShowImageJsonModal = () => {
    setJsonModalData(getFormattedImageColorsJson());
    setShowJsonModal(true);
  };

  const generatePalette = () => {
    const newPalette = palette.map((color, index) => {
      return lockedColors[index] ? color : generateRandomColor();
    });
    setPalette(newPalette);
  };

  const toggleLock = (index: number) => {
    const newLockedColors = [...lockedColors];
    newLockedColors[index] = !newLockedColors[index];
    setLockedColors(newLockedColors);
  };

  const adjustPalette = useCallback(
    (count: number) => {
      const newPalette = [...palette];
      const newLockedColors = [...lockedColors];

      if (count > newPalette.length) {
        for (let i = newPalette.length; i < count; i++) {
          newPalette.push(generateRandomColor());
          newLockedColors.push(false);
        }
      } else {
        newPalette.length = count;
        newLockedColors.length = count;
      }

      setPalette(newPalette);
      setLockedColors(newLockedColors);
    },
    [palette, lockedColors]
  );

  const handleColorCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    setColorCount(count);
    adjustPalette(count);
  };

  useEffect(() => {
    try {
      if (palette.length > 0) {
        localStorage.setItem("colorCount", JSON.stringify(colorCount));
        localStorage.setItem("palette", JSON.stringify(palette));
        localStorage.setItem("lockedColors", JSON.stringify(lockedColors));
      }
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }, [colorCount, palette, lockedColors]);

  const allColorsLocked = lockedColors.every((isLocked) => isLocked);

  const handleHarmonyChange = (newColors: string[]) => {
    const updatedHarmonyPalette = harmonyPalette.map((color, index) => {
      return lockedHarmonyColors[index] ? color : newColors[index] || color;
    });
    setHarmonyPalette(updatedHarmonyPalette);
  };

  const handleImageColorsExtracted = (extractedColors: string[]) => {
    setImageExtractedColors(extractedColors);
  };

  return (
    <AppContainer>
      <Header theme={theme} palette={palette}>
        <Title>GENERADOR DE PALETA DE COLORES </Title>

        <ThemeToggleButton onClick={toggleTheme}>
          Modo {theme === Theme.Light ? "Oscuro" : "Claro"}
        </ThemeToggleButton>
      </Header>
      <CardWrapper>
        <ControlsContainer>
          <FormatSelector>
            <label>
              <input
                type="radio"
                name="colorFormat"
                value="hex"
                checked={colorFormat === "hex"}
                onChange={() => setColorFormat("hex")}
              />
              HEX
            </label>
            <label>
              <input
                type="radio"
                name="colorFormat"
                value="rgb"
                checked={colorFormat === "rgb"}
                onChange={() => setColorFormat("rgb")}
              />
              RGB
            </label>
            <label>
              <input
                type="radio"
                name="colorFormat"
                value="hsl"
                checked={colorFormat === "hsl"}
                onChange={() => setColorFormat("hsl")}
              />
              HSL
            </label>
          </FormatSelector>
          <SliderContainer>
            <label htmlFor="colorCount">Colores: {colorCount}</label>
            <Slider
              type="range"
              id="colorCount"
              min="1"
              max="6"
              value={colorCount}
              onChange={handleColorCountChange}
            />
          </SliderContainer>
        </ControlsContainer>
        <PaletteContainer>
          {palette.map((color, index) => (
            <ColorCard
              key={index}
              color={color}
              isLocked={lockedColors[index]}
              toggleLock={() => toggleLock(index)}
              colorFormat={colorFormat}
            />
          ))}
        </PaletteContainer>

        <div
          className="flex"
          style={{
            marginTop: "20px",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <Button onClick={generatePalette} disabled={allColorsLocked}>
            Generar Nueva Paleta
          </Button>
          <Button
            onClick={handleShowJsonModal}
            style={{ marginTop: "20px", marginLeft: "10px" }}
          >
            Exportar JSON
          </Button>
        </div>
      </CardWrapper>
      <ColorContrastChecker />
      <ColorHarmonyGenerator
        colorFormat={colorFormat}
        palette={harmonyPalette}
        onHarmonyChange={handleHarmonyChange}
      />
      <CardWrapper>
        <ImageColorExtractor onColorsExtracted={handleImageColorsExtracted} />
        {imageExtractedColors.length > 0 && (
          <>
            <PaletteContainer $isImagePalette={true}>
              {imageExtractedColors.map((color, index) => (
                <ColorCard
                  key={index}
                  color={color}
                  isLocked={false} // Colors from image are not lockable in this context
                  toggleLock={() => {}} // No lock functionality
                  colorFormat={colorFormat}
                  isCompact={true}
                />
              ))}
            </PaletteContainer>
            <Button
              onClick={handleShowImageJsonModal}
              style={{ marginTop: "20px" }}
            >
              Exportar Colores de Imagen a JSON
            </Button>
          </>
        )}
      </CardWrapper>
      <CardWrapper>
        <ColorBlender />
      </CardWrapper>
      <CardWrapper>
        <ColorPaletteGenerator />
      </CardWrapper>
      <CardWrapper>
        <ColorBlindnessSimulator />
      </CardWrapper>
      <CardWrapper>
        <AnimalColorVisionSimulator />
      </CardWrapper>
      <JsonModal
        show={showJsonModal}
        onClose={handleCloseJsonModal}
        jsonData={jsonModalData}
      />
    </AppContainer>
  );
};

export default App;
