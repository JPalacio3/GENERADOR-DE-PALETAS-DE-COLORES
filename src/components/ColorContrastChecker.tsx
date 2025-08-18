import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getContrastRatio, checkWCAGCompliance } from "../utils/colorUtils";
import ColorPicker from "./ColorPicker";

const ContrastCheckerContainer = styled.div`
  background-color: var(--card-background);
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin: 10px 0;
  display: flex;
  gap: 3px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%;
  max-width: 600px;
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ColorInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const ColorBox = styled.div<{ $bgColor: string; $textColor: string }>`
  width: 94%;
  padding: 40px 20px;
  border-radius: 10px;
  background-color: ${(props) => props.$bgColor};
  color: ${(props) => props.$textColor};
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  border: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
`;

const ResultDisplay = styled.div`
  font-size: 1.1rem;
  text-align: center;
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid var(--input-border);
  border-radius: 25px;
  font-size: 1rem;
  text-align: center;
  background-color: var(--input-background);
  color: var(--text-color);
  transition: border-color 0.3s ease, background-color 0.3s ease,
    color 0.3s ease;
`;

const ColorContrastChecker: React.FC = () => {
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#33e450");
  const [contrastRatio, setContrastRatio] = useState(0);
  const [compliance, setCompliance] = useState({ level: "", description: "" });

  const isValidHex = (hex: string) =>
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);

  useEffect(() => {
    if (isValidHex(foregroundColor) && isValidHex(backgroundColor)) {
      const ratio = getContrastRatio(foregroundColor, backgroundColor);
      setContrastRatio(ratio);
      setCompliance(checkWCAGCompliance(ratio));
    } else {
      setContrastRatio(0);
      setCompliance({
        level: "Inválido",
        description: "Por favor, introduce códigos hexadecimales válidos.",
      });
    }
  }, [foregroundColor, backgroundColor]);

  return (
    <ContrastCheckerContainer>
      <h2>Verificador de Contraste de Colores</h2>
      <InputGroup>
        <ColorInputWrapper>
          <label htmlFor="foregroundColor">Color de Fuente:</label>
          <ColorPicker value={foregroundColor} onChange={setForegroundColor} />
          <StyledInput
            type="text"
            id="foregroundColorText"
            value={foregroundColor}
            onChange={(e) => setForegroundColor(e.target.value)}
          />
        </ColorInputWrapper>
        <ColorInputWrapper>
          <label htmlFor="backgroundColor">Color de Fondo:</label>
          <ColorPicker value={backgroundColor} onChange={setBackgroundColor} />
          <StyledInput
            type="text"
            id="backgroundColorText"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </ColorInputWrapper>
      </InputGroup>
      <ColorBox $bgColor={backgroundColor} $textColor={foregroundColor}>
        Texto de Ejemplo
      </ColorBox>
      <ResultDisplay>
        <p>Relación de Contraste: {contrastRatio.toFixed(2)}</p>
        <p>Cumplimiento WCAG: {compliance.level}</p>
        <p>{compliance.description}</p>
      </ResultDisplay>
    </ContrastCheckerContainer>
  );
};

export default ColorContrastChecker;
