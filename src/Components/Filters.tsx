import { Dispatch, FC, SetStateAction } from "react";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  lighten,
  MenuItem,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import { SortBy } from "./Sort/Sort";
import ClearIcon from "@mui/icons-material/Clear";
import { Zip } from "./Zip";
import theme from "../theme";

interface FiltersProps {
  setSort: Dispatch<SetStateAction<string>>;
  breeds: string[];
  selectedBreeds: string[];
  setSelectedBreeds: Dispatch<SetStateAction<string[]>>;
  ageRange: number[];
  setAgeRange: Dispatch<SetStateAction<number[]>>;
  setZipCodes: Dispatch<SetStateAction<string[]>>;
  setCurrentZipCode: Dispatch<SetStateAction<string>>;
  zipCodes: string[];
  currentZipCode: string;
}

export const Filters: FC<FiltersProps> = ({
  setSort,
  selectedBreeds,
  setSelectedBreeds,
  breeds,
  ageRange,
  setAgeRange,
  setCurrentZipCode,
  setZipCodes,
  zipCodes,
  currentZipCode,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: lighten(theme.palette.primary.main, 0.95),
        borderRadius: 2,
        margin: 1,
        borderColor: theme.palette.secondary.main,
        borderStyle: "solid",
        padding: 2,
      }}
    >
      <Box marginBottom={2}>
        <Typography variant="h6">Filters</Typography>
      </Box>
      <SortBy setSort={setSort} />
      <Box padding={1}>
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
      </Box>
      <Box padding={1}>
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
          color="secondary"
        />
      </Box>
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
    </Box>
  );
};
