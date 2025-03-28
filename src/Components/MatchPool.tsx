import { Button, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { FC } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import { Dog } from "./Dogs";
import { findIndex } from "lodash";
import axios from "axios";
import { BaseUrl } from "../App";
import { DogContainer } from "./DogContainer";
import theme from "../theme";

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
      <Grid container padding={2} direction="column" alignContent="center">
        <Grid item>
          <Typography variant="h4">Match Pool</Typography>
        </Grid>
        <Grid item>
          <Grid container justifyContent="center">
            <Button
              onClick={matchWithDog}
              disabled={selectedDogs.length === 0}
              color="secondary"
            >
              Match
            </Button>
          </Grid>
        </Grid>
      </Grid>
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
              <DogContainer>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  direction="column"
                  padding={2}
                >
                  <Grid item>
                    <Typography
                      variant="h5"
                      textAlign="center"
                      color={theme.palette.secondary.main}
                    >
                      You've been matched with...
                    </Typography>
                  </Grid>
                  <Grid item>
                    <img src={matchedDog.img} style={{ maxHeight: 170 }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="h5" color={theme.palette.primary.main}>
                      {matchedDog.name}
                    </Typography>
                    <Typography>{matchedDog.breed}</Typography>
                    <Typography>{`Age: ${
                      matchedDog.age === 0 ? "< 1" : matchedDog.age
                    } ${matchedDog.age <= 1 ? "year" : "years"}`}</Typography>
                    <Typography>{`Zip: ${matchedDog.zip_code}`}</Typography>
                  </Grid>
                </Grid>
              </DogContainer>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};
