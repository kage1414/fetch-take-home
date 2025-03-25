import { Dispatch, FC, useEffect, useState } from "react";
import { Sort } from "./constants";
import { IconButton, MenuItem, Select } from "@mui/material";
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
    <div>
      <Select
        value={sortBy}
        onChange={(e) => {
          setSortBy(e.target.value as Sort);
        }}
      >
        <MenuItem value={Sort.BREED}>Breed</MenuItem>
        <MenuItem value={Sort.NAME}>Name</MenuItem>
        <MenuItem value={Sort.AGE}>Age</MenuItem>
      </Select>
      <IconButton
        onClick={() => {
          setDirection(direction === "asc" ? "desc" : "asc");
        }}
      >
        {direction === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
      </IconButton>
    </div>
  );
};
