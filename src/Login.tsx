import { Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { HandleLogin } from "./hooks/useAuth";

interface LoginProps {
  handleLogin: HandleLogin;
}

export const Login: React.FC<LoginProps> = ({ handleLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <Grid container item direction="column" alignContent="center">
      <Grid item>
        <TextField
          label="Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </Grid>
      <Grid item>
        <TextField
          label="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </Grid>
      <Grid item>
        <Button
          onClick={() => {
            handleLogin({ name, email });
          }}
        >
          Log In
        </Button>
      </Grid>
    </Grid>
  );
};
