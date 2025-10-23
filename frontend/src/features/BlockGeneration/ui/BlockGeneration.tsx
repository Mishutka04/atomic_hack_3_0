import React from "react";
import { Box, Button, Container } from "@mui/material";
import { SlidesList } from "./SlidesList/SlidesList";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { ThemeCardSelector } from "./ThemeCardSelector/ThemeCardSelector";

export const BlockGeneration = () => {
  const navigate = useNavigate();

  const handleProceed = () => navigate("/editor");
  const handleBack = () => navigate("/");

  return (
    <Container
      sx={{ p: 4, maxWidth: "1000px !important", position: "relative", pb: 12 }}
    >
      <Button
        onClick={handleBack}
        startIcon={<ArrowBackIcon />}
        sx={{
          position: "fixed",
          top: 24,
          left: 24,
          bgcolor: "#f5f5f5",
          color: "#334e68",
          borderRadius: "12px",
          textTransform: "none",
          "&:hover": { bgcolor: "#eaeaea" },
          zIndex: 10,
        }}
      >
        Назад
      </Button>

      <SlidesList />

      <Box sx={{ mt: 4 }}>
        <ThemeCardSelector />
      </Box>

      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <Button
          onClick={handleProceed}
          variant="contained"
          startIcon={<PlayArrowIcon />}
          sx={{
            height: 50,
            borderRadius: "12px",
            bgcolor: "#334e68",
            color: "white",
            px: 4,
            "&:hover": { bgcolor: "#334e68" },
          }}
        >
          Перейти к Презентации
        </Button>
      </Box>
    </Container>
  );
};
