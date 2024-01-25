import { extendTheme } from "@chakra-ui/react";
import './Color'
import { secondary_color } from "./Color";

// Universal project theme
const DTCTheme = extendTheme ({
    styles: {
      global: {
        body: {
          bg: secondary_color
        }
      }
    }
  })

export default DTCTheme