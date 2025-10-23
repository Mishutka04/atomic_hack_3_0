import React from "react";
import { Box, Typography, Paper, Container } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../app/store";
import { setGlobalTheme } from "../../../../app/store/slices/editorSlice";
import { themes } from "../../../../shared/constants";

export const ThemeCardSelector = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentThemeId = useSelector(
    (state: RootState) => state.editor.globalThemeId
  );

  return (
    <Container
      component={Paper}
      sx={{
        maxWidth: "1000px !important",
        p: 4,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: "none",
      }}
    >
      <Typography variant="h5">Выбор Темы</Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mt: 4,
          justifyContent: "center",
        }}
      >
        {themes.map((theme) => (
          <Paper
            key={theme.id}
            onClick={() => dispatch(setGlobalTheme(theme.id))}
            sx={{
              cursor: "pointer",
              width: 250,
              p: 2,
              border: "1px solid #ccc",
              boxShadow:
                currentThemeId === theme.id
                  ? "inset 0 0 0 2px #334e68"
                  : "1px 1px 3px rgba(0,0,0,0.1)",
              "&:hover": {
                boxShadow:
                  currentThemeId === theme.id
                    ? "inset 0 0 0 2px #334e68"
                    : "0 4px 8px rgba(0,0,0,0.15)",
              },
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
              {theme.name}
            </Typography>

            <Box sx={{ display: "flex", mb: 1, gap: 1 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: theme.colors.background,
                  border: "1px solid #ccc",
                }}
              />
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: theme.colors.heading,
                  border: "1px solid #ccc",
                }}
              />
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: theme.colors.paragraph,
                  border: "1px solid #ccc",
                }}
              />
            </Box>

            <Box
              sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 0.5 }}
            >
              <Typography
                variant="caption"
                sx={{ fontFamily: theme.fonts.heading }}
              >
                <span style={{ fontFamily: "Arial" }}>Heading: </span>{" "}
                {theme.fonts.heading.split(",")[0].trim()}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontFamily: theme.fonts.paragraph }}
              >
                <span style={{ fontFamily: "Arial" }}>Paragraph: </span>
                {theme.fonts.paragraph.split(",")[0].trim()}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};
