import React, { useRef, useState } from "react";
import ColorThief from "colorthief";
import styled from "styled-components";

interface ImageColorExtractorProps {
  onColorsExtracted: (colors: string[]) => void;
}

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 10px;
  height: 100%;
  border: 2px dashed var(--border-color);
  border-radius: 10px;
  background-color: var(--card-background);
  color: var(--text-color);
  transition: all 0.3s ease;
  margin: 15px;

  &:hover {
    border-color: var(--primary-color);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  background-color: var(--button-background);
  color: var(--button-text);
  border: none;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, color 0.3s;
  margin: 15px;

  &:hover {
    background-color: var(--button-hover-background);
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 120px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ImageColorExtractor: React.FC<ImageColorExtractorProps> = ({
  onColorsExtracted,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const colorThief = new ColorThief();
          try {
            const palette = colorThief.getPalette(img, 6); // Extract 6 dominant colors
            const hexColors = palette.map(
              (rgb: [number, number, number]) =>
                `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2])
                  .toString(16)
                  .slice(1)
                  .toUpperCase()}`
            );
            onColorsExtracted(hexColors);
            setImageSrc(img.src); // Set image source for preview
          } catch (error) {
            console.error("Error extracting colors:", error);
            alert(
              "No se pudieron extraer colores de la imagen. Asegúrate de que sea una imagen válida."
            );
          }
        };
        img.onerror = () => {
          alert(
            "No se pudo cargar la imagen. Asegúrate de que sea un archivo de imagen válido."
          );
          setImageSrc(null);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <ImageUploadContainer>
      <h3>Generar Paleta desde Imagen</h3>
      <HiddenInput
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
      />

      {imageSrc && (
        <ImagePreview src={imageSrc} alt="Vista previa de la imagen" />
      )}
      <UploadButton onClick={handleButtonClick}>
        Seleccionar Imagen
      </UploadButton>
    </ImageUploadContainer>
  );
};

export default ImageColorExtractor;
