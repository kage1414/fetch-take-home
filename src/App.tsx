import { Grid2 } from "@mui/material";
import { useAuth } from "./hooks/useAuth";
import { Login } from "./Login";

export const BaseUrl = "https://frontend-take-home-service.fetch.com";

function App() {
  const { isAuthenticated, handleLogin } = useAuth();

  return (
    <Grid2
      container
      height="100vh"
      width="100vw"
      alignContent="center"
      justifyContent="center"
      size={12}
      direction="column"
    >
      {isAuthenticated ? <>Placeholder</> : <Login handleLogin={handleLogin} />}
    </Grid2>
  );
}

export default App;
