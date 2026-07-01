// src/context/ThemeContext.jsx
import React, { createContext, useContext } from "react";
import { ThemeProvider, Global, css } from "@emotion/react";

const mindVaultTheme = {
  colors: {
    background: "#0d0e12",
    surface: "#16171f",
    textPrimary: "#f1f2f6",
    textSecondary: "#8a8f9d",
    border: "#242631",
    accent: "#5a4afc",
    categories: {
      moment: "#ffb020",
      vibe: "#9b51e0",
      spark: "#00e676",
      reminder: "#ff5252",
    },
  },
  fonts: {
    heading: '"Inter", "SF Pro Display", system-ui, sans-serif',
    body: '"Inter", "SF Pro Text", system-ui, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },
  radii: {
    card: "16px",
    button: "10px",
    input: "12px",
  },
};

const GlobalStyles = () => (
  <Global
    styles={css`
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        background-color: ${mindVaultTheme.colors.background};
        color: ${mindVaultTheme.colors.textPrimary};
        font-family: ${mindVaultTheme.fonts.body};
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
      }
    `}
  />
);

const CustomThemeContext = createContext(null);

export const MindVaultThemeProvider = ({ children }) => {
  return (
    <CustomThemeContext.Provider value={mindVaultTheme}>
      <ThemeProvider theme={mindVaultTheme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </CustomThemeContext.Provider>
  );
};

export const useMindVaultTheme = () => useContext(CustomThemeContext);
