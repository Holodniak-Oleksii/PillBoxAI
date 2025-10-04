import outline from "@/app/providers/theme/buttons/outline";
import solid from "@/app/providers/theme/buttons/solid";
import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
} from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";

const buttonRecipe = defineRecipe({
  base: {
    borderRadius: "lg",
  },
  variants: {
    variant: {
      solid,
      outline,
    },
  },
  defaultVariants: {
    variant: "solid",
  },
});

const config = defineConfig({
  cssVarsPrefix: "ck",
  strictTokens: true,
  theme: {
    recipes: {
      button: buttonRecipe,
    },
  },
  globalCss: {
    html: {
      colorPalette: "white",
      background: "blackAlpha.50",
      fontFamily: `'Roboto', sans-serif`,
    },
  },
});

const system = createSystem(defaultConfig, config);

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => (
  <ChakraProvider value={system}>{children}</ChakraProvider>
);
