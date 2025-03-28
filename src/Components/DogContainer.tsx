import { Box } from "@mui/material";
import { FC, ReactNode } from "react";
import theme from "../theme";

interface DogContainerProps {
  children?: ReactNode;
}

export const DogContainer: FC<DogContainerProps> = ({ children }) => (
  <Box
    sx={{
      borderRadius: 4,
      borderWidth: 1,
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        borderRadius: 4,
        padding: "4px",
        background: `linear-gradient(to right, ${theme.palette.secondary.main}, rgb(9, 3, 37))`,
        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        maskComposite: "exclude",
        WebkitMaskComposite: "xor",
      },
    }}
  >
    <Box
      sx={{
        borderRadius: 4,
        borderWidth: 1,
        backgroundColor: "#fff",
      }}
    >
      {children}
    </Box>
  </Box>
);
