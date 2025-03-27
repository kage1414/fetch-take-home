import { Grid } from "@mui/material";
import { useAuth } from "./hooks/useAuth";
import { Login } from "./Components/Login";
import { Dogs } from "./Components/Dogs";

export const BaseUrl = "https://frontend-take-home-service.fetch.com";

function App() {
  const { isAuthenticated, handleLogin } = useAuth();

  return (
    <Grid
      container
      height="100vh"
      width="100vw"
      alignContent="center"
      justifyContent="center"
      direction="column"
    >
      {isAuthenticated ? <Dogs /> : <Login handleLogin={handleLogin} />}
    </Grid>
  );
}

export default App;
