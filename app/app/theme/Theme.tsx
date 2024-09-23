import React, { FC, createContext, useContext, useState, ReactNode } from "react"
import { themes } from "./colors"

export type Theme = typeof themes.light | typeof themes.dark

interface ThemeContextProps {
  theme: Theme
  isDarkMode: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: themes.dark,
  isDarkMode: true,
  toggleTheme: () => {
    throw new Error("toggleTheme must be used within a ThemeProvider");
  },
})

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true)

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev)
  }

  const theme = isDarkMode ? themes.dark : themes.light

  return <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useThemeContext = () => useContext(ThemeContext)
