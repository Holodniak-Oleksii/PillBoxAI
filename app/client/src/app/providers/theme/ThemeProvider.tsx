import outline from "@/app/providers/theme/buttons/outline";
import solid from "@/app/providers/theme/buttons/solid";
import subtle from "@/app/providers/theme/buttons/subtle";

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
      subtle,
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
      background: "whiteAlpha.50",
      fontFamily: `'Roboto', sans-serif`,
      color: "blackAlpha.700",
    },
  },
});

const system = createSystem(defaultConfig, config);

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => (
  <ChakraProvider value={system}>{children}</ChakraProvider>
);
