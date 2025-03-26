import {
  FormControl,
  Grid,
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
import AddIcon from "@mui/icons-material/Add";
import { findIndex } from "lodash";

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
  const [selectedDogs, setSelectedDogs] = useState<Dog[]>([]);

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
    <Grid container direction="row">
      <Grid
        container
        item
        direction="column"
        padding={4}
        rowSpacing={2}
        columnSpacing={2}
        xs={2}
      >
        <SortBy setSort={setSort} />
        <FormControl style={{ width: "100%" }}>
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
      </Grid>
      <Grid container item direction="column" xs={5}>
        <Grid container direction="row" overflow="scroll" height="80vh">
          <List style={{ width: "100%" }}>
            {dogs.map((dog, idx) => (
              <ListItem key={`${dog.id}-${idx}`} style={{ width: "100%" }}>
                <Paper style={{ padding: 4 }} sx={{ width: "100%" }}>
                  <Grid container xs={12}>
                    <Grid
                      container
                      item
                      xs={11}
                      direction="row"
                      columnSpacing={8}
                    >
                      <Grid
                        item
                        container
                        alignContent="center"
                        justifyContent="center"
                        xs={4}
                      >
                        <img src={dog.img} style={{ maxWidth: 80 }} />
                      </Grid>
                      <Grid
                        container
                        item
                        xs={7}
                        direction="column"
                        justifyContent="center"
                      >
                        <Typography variant="h5">{dog.name}</Typography>
                        <Typography>{dog.breed}</Typography>
                        <Typography>{`Age: ${dog.age === 0 ? "< 1" : dog.age} ${
                          dog.age <= 1 ? "year" : "years"
                        }`}</Typography>
                        <Typography>{`Zip: ${dog.zip_code}`}</Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      item
                      xs={1}
                      justifyContent="center"
                      alignContent="center"
                    >
                      <IconButton
                        sx={{ height: "34px", width: "34px" }}
                        size="small"
                        onClick={() => {
                          const selectedDogIdx = findIndex(
                            selectedDogs,
                            (selectedDog) => selectedDog.id === dog.id
                          );
                          if (selectedDogIdx === -1) {
                            setSelectedDogs([dog, ...selectedDogs]);
                          } else {
                            setSelectedDogs([
                              ...selectedDogs.splice(selectedDogIdx),
                            ]);
                          }
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              </ListItem>
            ))}
          </List>
        </Grid>

        {Math.floor(count / PageSize) > 0 && (
          <Grid item>
            <Pagination
              page={page}
              count={Math.floor(count / PageSize)}
              onChange={(_, page) => {
                setPage(page);
              }}
            />
          </Grid>
        )}
      </Grid>
      <Grid container item xs={5}></Grid>
    </Grid>
  );
};
