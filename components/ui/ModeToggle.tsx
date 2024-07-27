'use client'

import { useTheme } from "next-themes"
import { Button } from "./button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";


export default function ModeToggle() {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    theme == 'light' ? setTheme('dark') : setTheme('light')
  }

  return (
  <>
    {domLoaded && (
    <Button onClick={() => toggleTheme()} variant="outline" size="icon">
        {theme == 'light' ?
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            :
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        }
        <span className="sr-only">Toggle theme</span>
    </Button>
    )}
  </>
  )
}
