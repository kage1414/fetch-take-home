import { Button, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { FC } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import { Dog } from "./Dogs";
import { findIndex } from "lodash";
import axios from "axios";
import { BaseUrl } from "./App";

interface MatchPoolProps {
  selectedDogs: Dog[];
  handleSetSelectedDogs: (dogs: Dog[]) => void;
  handleSetMatchedDog: (dog: Dog | null) => void;
  matchDogIdsToDogs: (dogIds: string[]) => Promise<Dog[]>;
}

export const MatchPool: FC<MatchPoolProps> = ({
  selectedDogs,
  handleSetSelectedDogs,
  handleSetMatchedDog,
  matchDogIdsToDogs,
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
      <Grid container item padding={4} gap={3} xs={1}>
        <Typography variant="h4">Match Pool</Typography>
        <Button onClick={matchWithDog} disabled={selectedDogs.length === 0}>
          Match
        </Button>
      </Grid>
      <Grid
        container
        item
        xs={5}
        padding={4}
        direction="column"
        overflow="scroll"
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
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
    </>
  );
};
