import { createTheme } from "@mui/material";

const theme = createTheme({
  shape: { borderRadius: 8 },
  palette: {
    primary: { main: "#fba919" },
    secondary: { main: "#5c2d6b" },
  },
  components: {
    MuiTextField: { defaultProps: { style: { backgroundColor: "white" } } },
    MuiSelect: { defaultProps: { style: { backgroundColor: "white" } } },
  },
});

export default theme;
