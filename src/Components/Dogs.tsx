import { Grid, Typography } from "@mui/material";
import axios from "axios";
import { BaseUrl } from "../App";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { MatchPool } from "./MatchPool";
import { DogList } from "./DogList";
import { Filters } from "./Filters";

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

const PageSize = 25;

export const Dogs = () => {
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
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

  const debouncedPage = useDebounce(page, 300);
  const debouncedAgeRange = useDebounce(ageRange, 300);

  const matchDogIdsToDogs = useCallback(
    async (dogIds: string[]): Promise<Dog[]> => {
      const dogs = await axios
        .post(BaseUrl + "/dogs", dogIds, { withCredentials: true })
        .then(({ data }) => {
          return data;
        });
      return dogs;
    },
    []
  );
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
      .then(async ({ data }) => {
        const dogs = await matchDogIdsToDogs(data.resultIds);
        setDogs(dogs);
        setCount(data.total);
      });
  }, [
    debouncedPage,
    sort,
    zipCodes,
    debouncedAgeRange,
    selectedBreeds,
    matchDogIdsToDogs,
  ]);

  const getBreeds = () => {
    axios
      .get(BaseUrl + "/dogs/breeds", { withCredentials: true })
      .then(({ data }) => {
        setBreeds(data);
      });
  };

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

  useEffect(() => {
    console.log(matchedDog);
  }, [matchedDog]);

  return (
    <>
      <Grid
        container
        item
        justifyContent="center"
        alignContent="center"
        textAlign="center"
        padding={2}
      >
        <Typography variant="h3">Dog Matcher 6000</Typography>
      </Grid>
      <Grid container item direction="row" height="calc(100vh - 200px)" xs={1}>
        <Grid container item direction="column" padding={4} xs={2}>
          <Filters
            setSort={setSort}
            breeds={breeds}
            selectedBreeds={selectedBreeds}
            setSelectedBreeds={setSelectedBreeds}
            ageRange={ageRange}
            setAgeRange={setAgeRange}
            setZipCodes={setZipCodes}
            setCurrentZipCode={setCurrentZipCode}
            zipCodes={zipCodes}
            currentZipCode={currentZipCode}
          />
        </Grid>
        <Grid container item direction="column" xs={5}>
          <DogList
            dogs={dogs}
            selectedDogs={selectedDogs}
            handleSetSelectedDogs={(dogs) => {
              setSelectedDogs(dogs);
            }}
            handleSetPage={(page) => {
              setPage(page);
            }}
            count={count}
            pageSize={PageSize}
            page={page}
          />
        </Grid>
        <Grid item xs={5}>
          <Grid container direction="column">
            <MatchPool
              selectedDogs={selectedDogs}
              handleSetMatchedDog={(dog) => {
                setMatchedDog(dog);
              }}
              handleSetSelectedDogs={(dogs) => {
                setSelectedDogs(dogs);
              }}
              matchDogIdsToDogs={matchDogIdsToDogs}
              matchedDog={matchedDog}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
