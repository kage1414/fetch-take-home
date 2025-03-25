import {
  Grid2,
  List,
  ListItem,
  Pagination,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import { BaseUrl } from "./App";
import { useCallback, useEffect, useState } from "react";
import { SortBy } from "./Sort/Sort";
import { useDebounce } from "@uidotdev/usehooks";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

const PageSize = 25;

export const Dogs = () => {
  const [dogIds, setDogIds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [sort, setSort] = useState<string>("breed:asc");
  const debouncedPage = useDebounce(page, 300);

  const getDogIds = useCallback(() => {
    axios
      .get(BaseUrl + "/dogs/search", {
        withCredentials: true,
        params: { from: (debouncedPage - 1) * PageSize, sort, size: PageSize },
      })
      .then(({ data }) => {
        setDogIds(data.resultIds);
        setCount(data.total);
      });
  }, [debouncedPage, sort]);

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
  }, [getDogIds, debouncedPage, sort]);

  return (
    <>
      <Grid2 container direction="row">
        <Grid2 container width="20vw">
          <SortBy setSort={setSort} />
        </Grid2>
        <Grid2
          container
          overflow="scroll"
          width="70vw"
          height="80vh"
          direction="column"
        >
          <Grid2 container direction="row">
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
        </Grid2>
      </Grid2>
      <Grid2>
        <Pagination
          page={page}
          count={Math.floor(count / PageSize)}
          onChange={(_, page) => {
            setPage(page);
          }}
        />
      </Grid2>
    </>
  );
};
