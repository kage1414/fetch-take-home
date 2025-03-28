import { Grid, lighten } from "@mui/material";
import { useAuth } from "./hooks/useAuth";
import { Login } from "./Components/Login";
import { Dogs } from "./Components/Dogs";
import theme from "./theme";

export const BaseUrl = "https://frontend-take-home-service.fetch.com";

function App() {
  const { isAuthenticated, handleLogin } = useAuth();

  return (
    <Grid
      container
      height="100vh"
      width="100vw"
      direction="column"
      sx={{ background: lighten(theme.palette.primary.main, 0.9) }}
      justifyContent={isAuthenticated ? "normal" : "center"}
      alignContent={isAuthenticated ? "normal" : "center"}
    >
      {isAuthenticated ? <Dogs /> : <Login handleLogin={handleLogin} />}
    </Grid>
  );
}

export default App;
