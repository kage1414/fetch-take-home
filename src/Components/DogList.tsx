import { FC } from "react";
import {
  Grid,
  IconButton,
  List,
  ListItem,
  Pagination,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Dog } from "./Dogs";
import { findIndex } from "lodash";
import PetsIcon from "@mui/icons-material/Pets";
import theme from "../theme";
import { DogContainer } from "./DogContainer";
interface DogListProps {
  dogs: Dog[];
  selectedDogs: Dog[];
  handleSetSelectedDogs: (dogs: Dog[]) => void;
  count: number;
  pageSize: number;
  page: number;
  handleSetPage: (page: number) => void;
}

export const DogList: FC<DogListProps> = ({
  dogs,
  selectedDogs,
  handleSetSelectedDogs,
  count,
  pageSize,
  page,
  handleSetPage,
}) => {
  const showPagination = Math.floor(count / pageSize) > 0;
  return (
    <>
      <Grid
        container
        direction="row"
        overflow="scroll"
        height="80vh"
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <List style={{ width: "100%" }}>
          {dogs.map((dog, idx) => {
            const selectedDogIdx = findIndex(
              selectedDogs,
              (selectedDog) => selectedDog.id === dog.id
            );
            return (
              <ListItem key={`${dog.id}-${idx}`} style={{ width: "100%" }}>
                <Grid item xs={12}>
                  <DogContainer>
                    <Grid container padding={2}>
                      <Grid
                        container
                        item
                        xs={9}
                        direction="row"
                        columnSpacing={8}
                      >
                        <Grid item xs={1}>
                          <PetsIcon
                            sx={{ color: theme.palette.primary.main }}
                          />
                        </Grid>
                        <Grid
                          item
                          container
                          alignContent="center"
                          justifyContent="center"
                          xs={3}
                        >
                          <img src={dog.img} style={{ maxWidth: 80 }} />
                        </Grid>
                        <Grid
                          container
                          item
                          xs={6}
                          direction="column"
                          justifyContent="center"
                        >
                          <Typography
                            variant="h6"
                            color={theme.palette.primary.main}
                          >
                            {dog.name}
                          </Typography>
                          <Typography>{dog.breed}</Typography>
                          <Typography>{`Age: ${
                            dog.age === 0 ? "< 1" : dog.age
                          } ${dog.age <= 1 ? "year" : "years"}`}</Typography>
                          <Typography>{`Zip: ${dog.zip_code}`}</Typography>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        item
                        xs={3}
                        justifyContent="center"
                        alignContent="center"
                      >
                        <IconButton
                          sx={{ height: "34px", width: "34px" }}
                          size="small"
                          onClick={() => {
                            if (selectedDogIdx === -1) {
                              handleSetSelectedDogs([dog, ...selectedDogs]);
                            } else {
                              selectedDogs.splice(selectedDogIdx, 1);
                              handleSetSelectedDogs([...selectedDogs]);
                            }
                          }}
                        >
                          {selectedDogIdx === -1 ? (
                            <Tooltip title="Add to match pool">
                              <AddIcon />
                            </Tooltip>
                          ) : (
                            <Tooltip title="Remove from match pool">
                              <RemoveIcon />
                            </Tooltip>
                          )}
                        </IconButton>
                      </Grid>
                    </Grid>
                  </DogContainer>
                </Grid>
              </ListItem>
            );
          })}
        </List>
      </Grid>
      {showPagination && (
        <Grid item padding={1}>
          <Pagination
            color="secondary"
            page={page}
            count={Math.floor(count / pageSize)}
            onChange={(_, page) => {
              handleSetPage(page);
            }}
          />
        </Grid>
      )}
    </>
  );
};
