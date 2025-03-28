import {
  Button,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { FC } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import { Dog } from "./Dogs";
import { findIndex } from "lodash";
import axios from "axios";
import { BaseUrl } from "../App";

interface MatchPoolProps {
  selectedDogs: Dog[];
  handleSetSelectedDogs: (dogs: Dog[]) => void;
  handleSetMatchedDog: (dog: Dog | null) => void;
  matchDogIdsToDogs: (dogIds: string[]) => Promise<Dog[]>;
  matchedDog: Dog | null;
}

export const MatchPool: FC<MatchPoolProps> = ({
  selectedDogs,
  handleSetSelectedDogs,
  handleSetMatchedDog,
  matchDogIdsToDogs,
  matchedDog,
}) => {
  const matchWithDog = () => {
    const dogIds = selectedDogs.map((dog) => dog.id);
    axios
      .post(BaseUrl + "/dogs/match", dogIds, { withCredentials: true })
      .then(async ({ data }) => {
        const dog = await matchDogIdsToDogs([data.match]);
        handleSetMatchedDog(dog[0] ?? null);
      });
  };
  return (
    <>
      <Grid container padding={4} gap={3} direction="row">
        <Grid item>
          <Typography variant="h4">Match Pool</Typography>
        </Grid>
        <Grid item>
          <Button onClick={matchWithDog} disabled={selectedDogs.length === 0}>
            Match
          </Button>
        </Grid>
      </Grid>
      <Divider />
      <Grid item xs={11} padding={1}>
        <Grid container>
          <Grid item xs={5} padding={4} direction="column">
            {selectedDogs.map((dog, idx) => {
              const selectedDogIdx = findIndex(
                selectedDogs,
                (selectedDog) => selectedDog.id === dog.id
              );
              return (
                <Grid item key={`${dog.id}-${idx}`} xs={1}>
                  <Grid container>
                    <IconButton
                      sx={{ height: "34px", width: "34px" }}
                      size="small"
                      onClick={() => {
                        selectedDogs.splice(selectedDogIdx, 1);
                        handleSetSelectedDogs([...selectedDogs]);
                      }}
                    >
                      <Tooltip title="Remove from match pool">
                        <RemoveIcon />
                      </Tooltip>
                    </IconButton>
                    <Typography variant="h6">{dog.name}</Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
          {matchedDog && (
            <Grid item xs={7}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                direction="column"
              >
                <Grid item>
                  <Typography variant="h4" textAlign="center">
                    You've been matched with...
                  </Typography>
                </Grid>
                <Grid item>
                  <img src={matchedDog.img} style={{ maxHeight: 170 }} />
                </Grid>
                <Grid item>
                  <Typography variant="h5">{matchedDog.name}</Typography>
                  <Typography>{matchedDog.breed}</Typography>
                  <Typography>{`Age: ${
                    matchedDog.age === 0 ? "< 1" : matchedDog.age
                  } ${matchedDog.age <= 1 ? "year" : "years"}`}</Typography>
                  <Typography>{`Zip: ${matchedDog.zip_code}`}</Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};
