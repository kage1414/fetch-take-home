import { Chip, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { FC } from "react";

interface ZipProps {
  currentZipCode: string;
  zipCodes: string[];
  handleSetZipCodes: (zipCodes: string[]) => void;
  handleSetCurrentZipCode: (zipCode: string) => void;
}

const Numbers = "1234567890";

export const Zip: FC<ZipProps> = ({
  currentZipCode,
  zipCodes,
  handleSetZipCodes,
  handleSetCurrentZipCode,
}) => {
  return (
    <>
      <TextField
        label="Zip Code"
        value={currentZipCode}
        slotProps={{
          input: {
            endAdornment: (
              <IconButton
                disabled={
                  currentZipCode.length !== 5 ||
                  zipCodes.includes(currentZipCode)
                }
                onClick={() => {
                  handleSetZipCodes([...zipCodes, currentZipCode]);
                  handleSetCurrentZipCode("");
                }}
              >
                <AddIcon />
              </IconButton>
            ),
          },
        }}
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            currentZipCode.length === 5 &&
            !zipCodes.includes(currentZipCode)
          ) {
            handleSetZipCodes([...zipCodes, currentZipCode]);
            handleSetCurrentZipCode("");
          }
        }}
        onChange={(e) => {
          const chars = e.target.value.split("");
          if (
            chars.every((char) => Numbers.includes(char)) &&
            chars.length >= 0 &&
            chars.length <= 5
          ) {
            handleSetCurrentZipCode(e.target.value);
          }
        }}
      />
      {zipCodes.map((zip, idx) => (
        <Chip
          key={`${zip}-${idx}`}
          label={zip}
          onDelete={() => {
            const index = zipCodes.indexOf(zip);
            handleSetZipCodes([
              ...zipCodes.slice(0, index),
              ...zipCodes.slice(index + 1),
            ]);
          }}
        />
      ))}
    </>
  );
};
