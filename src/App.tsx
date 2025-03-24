import { Button, Grid2, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";

export const BaseUrl = "https://frontend-take-home-service.fetch.com";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    axios
      .post(BaseUrl + "/auth/login", { name, email }, { withCredentials: true })
      .then((res) => {
        console.log(res);
      });
  };

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
      <Grid2>
        <TextField
          label="Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </Grid2>
      <Grid2>
        <TextField
          label="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </Grid2>
      <Grid2>
        <Button onClick={handleLogin}>Log In</Button>
      </Grid2>
    </Grid2>
  );
}

export default App;
