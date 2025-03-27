import { Grid, Typography } from "@mui/material";
import { FC } from "react";
import { Dog } from "./Dogs";

interface MatchProps {
  matchedDog: Dog;
}

export const Match: FC<MatchProps> = ({ matchedDog }) => (
  <Grid
    container
    item
    xs={6}
    padding={4}
    direction="column"
    alignItems="center"
  >
    <Grid container item xs={2} justifyContent="center">
      <Typography variant="h4">You've been matched with...</Typography>
    </Grid>
    <Grid
      container
      item
      justifyContent="space-around"
      alignContent="center"
      direction="column"
      xs={10}
    >
      <Grid item>
        <img src={matchedDog.img} style={{ maxWidth: 150 }} />
      </Grid>
      <Grid item>
        <Typography variant="h5">{matchedDog.name}</Typography>
        <Typography>{matchedDog.breed}</Typography>
        <Typography>{`Age: ${matchedDog.age === 0 ? "< 1" : matchedDog.age} ${
          matchedDog.age <= 1 ? "year" : "years"
        }`}</Typography>
        <Typography>{`Zip: ${matchedDog.zip_code}`}</Typography>
      </Grid>
    </Grid>
  </Grid>
);
