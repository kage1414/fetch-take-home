import { Dispatch, FC, useEffect, useState } from "react";
import { Sort } from "./constants";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface SortProps {
  setSort: Dispatch<string>;
}

export const SortBy: FC<SortProps> = ({ setSort }) => {
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<Sort>(Sort.BREED);

  useEffect(() => {
    setSort(`${sortBy}:${direction}`);
  });
  return (
    <Box
      padding={1}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <FormControl>
        <InputLabel htmlFor="sort-by">Sort By</InputLabel>
        <Select
          id="sort-by"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value as Sort);
          }}
          label="Sort By"
        >
          <MenuItem value={Sort.BREED}>Breed</MenuItem>
          <MenuItem value={Sort.NAME}>Name</MenuItem>
          <MenuItem value={Sort.AGE}>Age</MenuItem>
        </Select>
      </FormControl>
      <IconButton
        onClick={() => {
          setDirection(direction === "asc" ? "desc" : "asc");
        }}
      >
        {direction === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
      </IconButton>
    </Box>
  );
};
