import { Grid2, List, ListItem, Paper, Typography } from "@mui/material";
import axios from "axios";
import { BaseUrl } from "./App";
import { useCallback, useEffect, useState } from "react";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export const Dogs = () => {
  const [dogIds, setDogIds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);

  const getDogIds = () => {
    axios
      .get(BaseUrl + "/dogs/search", { withCredentials: true })
      .then(({ data }) => {
        console.log(data);
        setDogIds(data.resultIds);
      });
  };
  const matchDogIds = useCallback(() => {
    axios
      .post(BaseUrl + "/dogs", dogIds, { withCredentials: true })
      .then(({ data }) => {
        setDogs(data);
      });
  }, [dogIds]);

  useEffect(() => {
    matchDogIds();
  }, [dogIds, matchDogIds]);

  useEffect(() => {
    getDogIds();
  }, []);

  return (
    <Grid2 container height="80%" overflow="scroll" width="100%">
      <List>
        {dogs.map((dog, idx) => (
          <ListItem key={`${dog.id}-${idx}`}>
            <Paper style={{ padding: 4 }}>
              <Grid2 container direction="row" columnSpacing={8}>
                <Grid2 container>
                  <img src={dog.img} style={{ maxWidth: 80 }} />
                </Grid2>
                <Grid2 container size={6} alignItems="center">
                  <Typography variant="h5">{dog.name}</Typography>
                  <Typography>{`Age: ${dog.age}`}</Typography>
                  <Typography>{dog.breed}</Typography>
                  <Typography>{dog.zip_code}</Typography>
                </Grid2>
              </Grid2>
            </Paper>
          </ListItem>
        ))}
      </List>
    </Grid2>
  );
};
