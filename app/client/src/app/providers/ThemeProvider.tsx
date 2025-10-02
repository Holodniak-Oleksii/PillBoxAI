import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {},
    },
  },
})

const system = createSystem(defaultConfig, config)

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => (
  <ChakraProvider value={system}>

      {children}
  </ChakraProvider>
);
