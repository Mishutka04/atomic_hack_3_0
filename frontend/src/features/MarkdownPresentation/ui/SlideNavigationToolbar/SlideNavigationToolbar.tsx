import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ArrowBack from "@mui/icons-material/ArrowBackIos";
import ArrowForward from "@mui/icons-material/ArrowForwardIos";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../app/store";
import {
  markSlideVisited,
  pushHistory,
  redo,
  resetVisitedSlides,
  setCurrentIndex,
  setSlides,
  undo,
} from "../../../../app/store/slices/editorSlice";
import { PlateSlide } from "../../../../shared/types";
import { v4 as uuidv4 } from "uuid";
import { exportToPptx } from "../../lib";

const layoutOptions: PlateSlide["layout"][] = [
  "left-image",
  "right-image",
  "text-only",
  "top-image",
  "bottom-image",
];

const SlideNavigationToolbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const slides = useSelector((state: RootState) => state.editor.slides);
  const theme = useSelector((state: RootState) =>
    state.editor.availableThemes.find(
      (t) => t.id === state.editor.globalThemeId
    )
  );
  const currentIndex = useSelector(
    (state: RootState) => state.editor.currentIndex
  );

  const visitedSlides = useSelector(
    (state: RootState) => state.editor.visitedSlides
  );

  const visitedAll = visitedSlides.length === slides.length;

  const historyIndex = useSelector(
    (state: RootState) => state.editor.historyIndex
  );
  const historyLength = useSelector(
    (state: RootState) => state.editor.history.length
  );

  useEffect(() => {
    const currentSlide = slides[currentIndex];
    if (currentSlide && !visitedSlides.includes(currentSlide.id)) {
      dispatch(markSlideVisited(currentIndex));
    }
  }, [currentIndex, slides, visitedSlides, dispatch]);

  useEffect(() => {
    if (slides.length && historyIndex === -1) {
      dispatch(pushHistory());
    }
  }, [slides, historyIndex, dispatch]);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedLayout, setSelectedLayout] =
    useState<PlateSlide["layout"]>("text-only");

  const handleAddSlide = () => {
    const newSlide: PlateSlide = {
      id: uuidv4(),
      title: "Новый слайд",
      layout: selectedLayout!,
      markdownText: "",
      content: [],
    };

    if (
      ["left-image", "right-image", "top-image", "bottom-image"].includes(
        selectedLayout!
      )
    ) {
      let imgCoords = {
        xPercent: 0,
        yPercent: 0,
        widthPercent: 50,
        heightPercent: 50,
      };
      switch (selectedLayout) {
        case "left-image":
          imgCoords = {
            xPercent: 0,
            yPercent: 0,
            widthPercent: 50,
            heightPercent: 100,
          };
          break;
        case "right-image":
          imgCoords = {
            xPercent: 50,
            yPercent: 0,
            widthPercent: 50,
            heightPercent: 100,
          };
          break;
        case "top-image":
          imgCoords = {
            xPercent: 0,
            yPercent: 0,
            widthPercent: 100,
            heightPercent: 25,
          };
          break;
        case "bottom-image":
          imgCoords = {
            xPercent: 0,
            yPercent: 75,
            widthPercent: 100,
            heightPercent: 25,
          };
          break;
      }

      newSlide.content = [
        {
          id: uuidv4(),
          type: "image",
          url: "https://via.placeholder.com/400x300?text=Image",
          ...imgCoords,
        },
        {
          id: uuidv4(),
          type: "heading",
          text: "Заголовок",
          xPercent: 0,
          yPercent: imgCoords.yPercent + imgCoords.heightPercent,
          widthPercent: 100,
          heightPercent: 20,
          style: {
            fontSize: 28,
            fontWeight: 700,
          },
        },
      ];
    } else {
      newSlide.content = [
        {
          id: uuidv4(),
          type: "heading",
          text: "Заголовок",
          xPercent: 0,
          yPercent: 0,
          widthPercent: 100,
          heightPercent: 20,
          style: {
            fontSize: 28,
            fontWeight: 700,
          },
        },
      ];
    }

    console.log("Блоки нового слайда:", newSlide.content);

    const updatedSlides = [...slides, newSlide];
    dispatch(setSlides(updatedSlides));
    dispatch(setCurrentIndex(updatedSlides.length - 1));
    setAddDialogOpen(false);
  };

  const handleDeleteSlide = () => {
    if (!slides[currentIndex]) return;

    const deletedSlideId = slides[currentIndex].id;

    // Удаляем слайд
    const newSlides = slides.filter((_, i) => i !== currentIndex);

    // Обновляем visitedSlides, убирая удалённый слайд
    const newVisitedSlides = visitedSlides.filter(
      (id) => id !== deletedSlideId
    );

    dispatch(setSlides(newSlides));
    dispatch(setCurrentIndex(Math.max(currentIndex - 1, 0)));
    dispatch(resetVisitedSlides());
    newVisitedSlides.forEach((id, index) => {
      const slideIndex = newSlides.findIndex((s) => s.id === id);
      if (slideIndex !== -1) dispatch(markSlideVisited(slideIndex));
    });
    dispatch(pushHistory());
  };

  return (
    <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
      <IconButton
        onClick={() => dispatch(setCurrentIndex(Math.max(currentIndex - 1, 0)))}
        disabled={currentIndex === 0}
      >
        <ArrowBack />
      </IconButton>
      <IconButton
        onClick={() =>
          dispatch(
            setCurrentIndex(Math.min(currentIndex + 1, slides.length - 1))
          )
        }
        disabled={currentIndex === slides.length - 1}
      >
        <ArrowForward />
      </IconButton>

      <IconButton
        onClick={() => setAddDialogOpen(true)}
        sx={{ ml: "auto", color: "#334e68" }}
      >
        <AddIcon />
      </IconButton>

      <IconButton color="error" onClick={handleDeleteSlide}>
        <DeleteIcon />
      </IconButton>

      <IconButton
        color="default"
        onClick={() => dispatch(undo())}
        disabled={historyIndex <= 0}
      >
        <UndoIcon />
      </IconButton>
      <IconButton
        color="default"
        onClick={() => dispatch(redo())}
        disabled={historyIndex >= historyLength - 1}
      >
        <RedoIcon />
      </IconButton>

      <Button
        onClick={() => {
          exportToPptx(slides, theme!);
        }}
        sx={{
          ml: 1,
          color: "#334e68",
          bgcolor: "rgba(0,0,0,0)",
          border: `1px solid #334e68`,
          transition: "all 0.2s",
          "&:hover": {
            bgcolor: "#334e6812",
            color: "#334e68",
          },
        }}
      >
        Export PPTX
      </Button>

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle sx={{ width: "fit-content" }}>
          Выберите шаблон слайда
        </DialogTitle>
        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            width: "fit-content",
          }}
        >
          {layoutOptions.map((layout) => {
            const isSelected = selectedLayout === layout;

            const renderMiniLayout = () => {
              switch (layout) {
                case "left-image":
                  return (
                    <Box sx={{ display: "flex", height: "100%" }}>
                      <Box sx={{ flex: 1, bgcolor: "grey.400", mr: 0.5 }} />
                      <Box sx={{ flex: 1, bgcolor: "grey.200" }} />
                    </Box>
                  );
                case "right-image":
                  return (
                    <Box sx={{ display: "flex", height: "100%" }}>
                      <Box sx={{ flex: 1, bgcolor: "grey.200", mr: 0.5 }} />
                      <Box sx={{ flex: 1, bgcolor: "grey.400" }} />
                    </Box>
                  );
                case "top-image":
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <Box sx={{ flex: 1, bgcolor: "grey.400", mb: 0.5 }} />
                      <Box sx={{ flex: 1, bgcolor: "grey.200" }} />
                    </Box>
                  );
                case "bottom-image":
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <Box sx={{ flex: 1, bgcolor: "grey.200", mb: 0.5 }} />
                      <Box sx={{ flex: 1, bgcolor: "grey.400" }} />
                    </Box>
                  );
                case "center":
                case "text-only":
                default:
                  return (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        bgcolor: "grey.200",
                      }}
                    />
                  );
              }
            };

            return (
              <Box
                key={layout}
                onClick={() => setSelectedLayout(layout)}
                sx={{
                  width: 100,
                  height: 60,
                  border: 2,
                  borderColor: isSelected ? "primary.main" : "grey.400",
                  borderRadius: 1,
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "all 0.1s",
                  "&:hover": { borderColor: "primary.main" },
                }}
              >
                {renderMiniLayout()}
              </Box>
            );
          })}
        </Box>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleAddSlide}>
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SlideNavigationToolbar;
