import React from "react";
import styled from "styled-components";

const StyledFooter = styled.footer`
  padding: 2rem 0;
  margin-top: auto;
  text-align: center;
  background-color: #1a1a1a;
  color: rgba(255, 255, 255, 0.7);
  border-top: 1px solid #333;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1.5rem 0;
  }
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const StyledLink = styled.a`
  color: #646cff;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const Footer = () => {
  return (
    <StyledFooter>
      <FooterText>
        Creado con 💙 por{" "}
        <StyledLink
          href="https://github.com/JPalacio3"
          target="_blank"
          rel="noopener noreferrer"
        >
          JPalacio
        </StyledLink>
      </FooterText>
    </StyledFooter>
  );
};

export default Footer;
