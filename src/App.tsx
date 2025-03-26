import { Grid } from "@mui/material";
import { useAuth } from "./hooks/useAuth";
import { Login } from "./Login";
import { Dogs } from "./Dogs";

export const BaseUrl = "https://frontend-take-home-service.fetch.com";

function App() {
  const { isAuthenticated, handleLogin } = useAuth();

  return (
    <Grid
      height="100vh"
      width="100vw"
      alignContent="center"
      justifyContent="center"
    >
      {isAuthenticated ? <Dogs /> : <Login handleLogin={handleLogin} />}
    </Grid>
  );
}

export default App;
