import { Box, Typography } from "@mui/material";
import React from "react";

export default function TextContent({ content }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Typography textAlign={'justify'}>{content}</Typography>
    </Box>
  );
}
