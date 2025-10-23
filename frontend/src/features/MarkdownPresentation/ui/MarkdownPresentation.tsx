import React, { useEffect, useState } from "react";
import { SlideBlock, Theme } from "../../../shared/types/markdownTypes";
import { Box, darken, IconButton, Typography } from "@mui/material";
import { RenderBlock } from "../blocks/RenderBlock";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../app/store";
import { updateBlock } from "../../../app/store/slices/editorSlice";
import SlideToolbar from "./SlideToolbar";
import SlideNavigationToolbar from "./SlideNavigationToolbar";
import MiniSlides from "./MiniSlides/MiniSlides";
import { motion, AnimatePresence } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import SlideEditPrompt from "./SlideEditPrompt";

const slideWidth = 900;
const slideHeight = 518;

export const MarkdownPresentation: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [editingBlock, setEditingBlock] = useState<{
    type: string;
    id: string;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const slides = useSelector((state: RootState) => state.editor.slides);
  const currentIndex = useSelector(
    (state: RootState) => state.editor.currentIndex
  );

  const theme: Theme | undefined = useSelector((state: RootState) =>
    state.editor.availableThemes.find(
      (t) => t.id === state.editor.globalThemeId
    )
  );

  const safeIndex = Math.min(currentIndex, slides.length - 1);
  const currentSlide = slides[safeIndex];

  const setSlideContent = (blocks: SlideBlock[]) => {
    blocks.forEach((b) => dispatch(updateBlock({ id: b.id, newBlock: b })));
  };

  const bgImages = theme?.colors.backgroundImages;
  let bgImage = bgImages ? bgImages[0] : theme?.colors.background || "#fff";

  if (bgImages) {
    if ((currentIndex + 1) % 5 === 0 && bgImages[2]) {
      bgImage = bgImages[2];
    } else if ((currentIndex + 1) % 3 === 0 && bgImages[1]) {
      bgImage = bgImages[1];
    }
  }

  const renderBlock = (block: SlideBlock) => (
    <RenderBlock
      key={block.id}
      block={block}
      id={block.id}
      slideId={currentSlide.id}
      editingBlock={editingBlock}
      editValue={editValue}
      setEditValue={setEditValue}
      setEditingBlock={setEditingBlock}
    />
  );

  return (
    <Box
      sx={{
        m: 1,
        p: 2,
        border: `1px solid #334e684a`,
        borderRadius: 4,
        bgcolor: "white",
        width: "100%",
      }}
    >
      <AnimatePresence mode="wait">
        {!currentSlide ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ height: "89vh", boxSizing: "border-box", width: "100%" }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid #ccc`,
                borderRadius: 2,
                overflow: "hidden",
                background: `linear-gradient(135deg, ${
                  theme?.colors.background || "#fff"
                } 0%, ${theme?.colors.paragraph + "22" || "#eee"} 100%)`,
                color: theme?.colors.heading,
                textAlign: "center",
                p: 2,
                transition: "all 0.2s",
              }}
            >
              <Box
                sx={{
                  boxSizing: "border-box",
                }}
              >
                <Typography variant="h3" sx={{ mb: 1 }}>
                  Добро пожаловать!
                </Typography>
                <Typography variant="body1">
                  Здесь будут отображаться ваши слайды.
                  <br />
                  Прикрепите файл и отправьте нашему ИИ сообщение с описанием
                  презентации!
                </Typography>
              </Box>
            </Box>
          </motion.div>
        ) : (
          <motion.div
            key="slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ height: "72vh", boxSizing: "border-box" }}
          >
            <SlideNavigationToolbar />
            <SlideToolbar slideId={currentSlide.id} />

            <Box
              sx={{
                display: "flex",
                gap: 2,
                height: "100%",
                overflow: "hidden",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentSlide.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  style={{
                    height: "100%",
                    width: "100%",
                    boxSizing: "border-box",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    id={currentSlide.id}
                    sx={{
                      position: "relative",
                      width: "100%",
                      maxWidth: "100%",
                      aspectRatio: "16/9",
                      boxSizing: "border-box",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      border: `1px solid #ccc`,
                      borderRadius: 2,
                      overflow: "hidden",
                      background: bgImage,

                      flexShrink: 1,
                      transition: "all 0.2s",
                      "&:hover": {
                        border: `1px solid ${theme?.colors.heading}`,
                        "& .hoverIcon": {
                          opacity: 1,
                          transform: "translateY(0)",
                        },
                      },
                    }}
                  >
                    <SlideEditPrompt
                      currentSlide={currentSlide}
                      renderBlock={renderBlock}
                      setSlideContent={(blocks) => setSlideContent(blocks)}
                      slideHeight={slideHeight}
                      theme={theme}
                    />
                  </Box>
                </motion.div>
              </AnimatePresence>
              <Box
                sx={{
                  flexShrink: 0,
                  height: "100%",
                  boxSizing: "border-box",
                  maxWidth: 200,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  border: `1px solid ${theme?.colors.paragraph + "4a"}`,
                  borderRadius: 2,
                  p: 1,
                }}
              >
                <MiniSlides slides={slides} />
              </Box>
            </Box>

            <Typography
              sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}
            >
              Slide {currentIndex + 1} of {slides.length}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};
