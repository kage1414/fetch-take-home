import {
  FormControl,
  Grid2,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import axios from "axios";
import { BaseUrl } from "./App";
import { useCallback, useEffect, useState } from "react";
import { SortBy } from "./Sort/Sort";
import { useDebounce } from "@uidotdev/usehooks";
import { Zip } from "./Zip";
import ClearIcon from "@mui/icons-material/Clear";

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
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const [currentZipCode, setCurrentZipCode] = useState("");
  const [ageRange, setAgeRange] = useState([0, 15]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);

  const debouncedPage = useDebounce(page, 300);
  const debouncedAgeRange = useDebounce(ageRange, 300);

  const getDogIds = useCallback(() => {
    axios
      .get(BaseUrl + "/dogs/search", {
        withCredentials: true,
        params: {
          from: (debouncedPage - 1) * PageSize,
          sort,
          size: PageSize,
          zipCodes,
          ageMin: debouncedAgeRange[0],
          ageMax: debouncedAgeRange[1],
          breeds: selectedBreeds,
        },
      })
      .then(({ data }) => {
        setDogIds(data.resultIds);
        setCount(data.total);
      });
  }, [debouncedPage, sort, zipCodes, debouncedAgeRange, selectedBreeds]);

  const matchDogIds = useCallback(() => {
    axios
      .post(BaseUrl + "/dogs", dogIds, { withCredentials: true })
      .then(({ data }) => {
        setDogs(data);
      });
  }, [dogIds]);

  const getBreeds = () => {
    axios
      .get(BaseUrl + "/dogs/breeds", { withCredentials: true })
      .then(({ data }) => {
        setBreeds(data);
      });
  };

  useEffect(() => {
    matchDogIds();
  }, [dogIds, matchDogIds]);

  useEffect(() => {
    getDogIds();
  }, [
    getDogIds,
    debouncedPage,
    sort,
    zipCodes,
    debouncedAgeRange,
    selectedBreeds,
  ]);

  useEffect(() => {
    getBreeds();
  }, []);

  return (
    <>
      <Grid2 container direction="row">
        <Grid2
          container
          maxWidth="20vw"
          direction="column"
          padding={4}
          rowSpacing={2}
        >
          <SortBy setSort={setSort} />
          <FormControl>
            <InputLabel htmlFor="breed-input">Breed</InputLabel>
            <Select
              id="breed-input"
              label="Breed"
              multiple
              fullWidth
              value={selectedBreeds}
              onChange={(e) => {
                if (Array.isArray(e.target.value)) {
                  setSelectedBreeds(e.target.value);
                }
              }}
              endAdornment={
                <IconButton
                  size="small"
                  onClick={() => {
                    setSelectedBreeds([]);
                  }}
                  sx={{ marginRight: 1 }}
                >
                  <ClearIcon />
                </IconButton>
              }
            >
              {breeds.map((breed, idx) => (
                <MenuItem value={breed} key={`${breed}-${idx}`}>
                  {breed}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography>{`Age: ${ageRange[0]} - ${ageRange[1]}`}</Typography>
          <Slider
            value={ageRange}
            min={0}
            max={15}
            size="small"
            valueLabelDisplay="auto"
            onChange={(_, range) => {
              if (Array.isArray(range)) {
                setAgeRange(range);
              }
            }}
          />
          <Zip
            currentZipCode={currentZipCode}
            zipCodes={zipCodes}
            handleSetCurrentZipCode={(zipCode) => {
              setCurrentZipCode(zipCode);
            }}
            handleSetZipCodes={(zipCodes) => {
              setZipCodes(zipCodes);
            }}
          />
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
      {Math.floor(count / PageSize) > 0 && (
        <Grid2>
          <Pagination
            page={page}
            count={Math.floor(count / PageSize)}
            onChange={(_, page) => {
              setPage(page);
            }}
          />
        </Grid2>
      )}
    </>
  );
};
