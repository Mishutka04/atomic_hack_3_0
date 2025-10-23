import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export const LoadingOverlay: React.FC = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        justifyContent: "center",
        alignItems: "center",
        color: "#334e68",
        bgcolor: "rgba(255, 255, 255, 1)",
      }}
    >
      <CircularProgress sx={{ color: "#334e68" }} />
      <Typography>Генерация{dots}</Typography>
    </Box>
  );
};
