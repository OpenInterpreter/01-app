import { useThemeContext } from "../theme/Theme"

export const useTheme = () => {
  const { theme, isDarkMode, toggleTheme } = useThemeContext()
  return { theme, isDarkMode, toggleTheme }
}
