import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface JsonModalProps {
  show: boolean;
  onClose: () => void;
  jsonData: unknown;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: rgba(199, 199, 212, 0.94);
  padding: 10px;

  border-radius: 10px;
  position: relative;
  width: auto;
  max-width: none;
  max-height: 80%;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0rem;
  right: 0rem;

  text-align: center;
  border: none;
  font-size: 2rem;
  &:hover {
    font-size: 2.2rem;
  }
  cursor: pointer;
  color: #ff4646ff;

  border-radius: 0 0 10px 10px;
`;

const JsonPre = styled.pre`
  background: #f5eee3;
  padding: 20px;
  border-radius: 10px;
  white-space: pre-wrap;
  word-wrap: break-word;
  text-align: left;
  font-family: "Courier New", Courier, monospace;
  font-size: 0.9rem;
  color: #333;
`;

const CopyButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 10px;
  &:hover {
    background-color: #45a049;
  }
`;

const CopyStatus = styled.span`
  margin-left: 10px;
  color: #333;
  font-size: 0.9rem;
`;

const JsonModal: React.FC<JsonModalProps> = ({ show, onClose, jsonData }) => {
  const [copyStatus, setCopyStatus] = useState("");

  const formatJsonData = (data: unknown) => {
    try {
      // If data is already a string, try to parse it
      if (typeof data === "string") {
        const parsedData = JSON.parse(data);
        return JSON.stringify(parsedData, null, 2);
      }
      // Otherwise, stringify the data directly
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error("Error formatting JSON data:", error);
      // Fallback to original data if parsing/stringifying fails
      return String(data);
    }
  };

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  if (!show) {
    return null;
  }

  const handleCopy = () => {
    const jsonString = JSON.stringify(jsonData, null, 2);
    navigator.clipboard
      .writeText(jsonString)
      .then(() => {
        setCopyStatus("¡Copiado!");
        setTimeout(() => setCopyStatus(""), 2000);
      })
      .catch((err) => {
        console.error("Error al copiar: ", err);
        setCopyStatus("Error al copiar");
      });
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <div>
          <CopyButton onClick={handleCopy}>Copiar al Portapapeles</CopyButton>
          {copyStatus && <CopyStatus>{copyStatus}</CopyStatus>}
        </div>
        <JsonPre>{formatJsonData(jsonData)}</JsonPre>
      </ModalContent>
    </ModalOverlay>
  );
};

export default JsonModal;
