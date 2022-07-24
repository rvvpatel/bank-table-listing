import { createTheme, adaptV4Theme } from "@mui/material/styles";

const theme = createTheme(adaptV4Theme({
  palette: {
    primary: {
      main: "#00ab55",
      light: "#EBF8F2",
    },
    secondary: {
      main: "#637381",
    }
  }
}));

export default theme;
