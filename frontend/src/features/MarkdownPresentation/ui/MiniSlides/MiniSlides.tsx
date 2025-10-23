import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentIndex,
  updateBlock,
} from "../../../../app/store/slices/editorSlice";
import {
  PlateSlide,
  SlideBlock,
  Theme,
} from "../../../../shared/types";
import { Box, Typography } from "@mui/material";
import SlideContent from "../../blocks/SlideContent";
import { RenderBlock } from "../../blocks/RenderBlock";
import { RootState } from "../../../../app/store";
import { motion } from "framer-motion";

const slideWidth = 900;
const slideHeight = 500;

const MiniSlides: React.FC<{ slides: PlateSlide[] }> = ({ slides }) => {
  const dispatch = useDispatch();
  const { currentIndex, revision } = useSelector(
    (state: RootState) => state.editor
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const theme: Theme | undefined = useSelector((state: RootState) =>
    state.editor.availableThemes.find(
      (t) => t.id === state.editor.globalThemeId
    )
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const updateAllBlocks = () => {
      slides.forEach((slide) => {
        const slideEl = document.getElementById(`mini-${slide.id}`);
        if (!slideEl) {
          return;
        }

        slide.content.forEach((block) => {
          const blockEl = slideEl.querySelector(
            `[data-block-id="${block.id}"]`
          );
          if (!blockEl) return;

          const blockRect = blockEl.getBoundingClientRect();
          const slideRect = slideEl.getBoundingClientRect();

          const xPercent =
            ((blockRect.left - slideRect.left) / slideRect.width) * 100;
          const yPercent =
            ((blockRect.top - slideRect.top) / slideRect.height) * 100;
          const widthPercent = (blockRect.width / slideRect.width) * 100;
          const heightPercent = (blockRect.height / slideRect.height) * 100;

          if (
            block.xPercent !== xPercent ||
            block.yPercent !== yPercent ||
            block.widthPercent !== widthPercent ||
            block.heightPercent !== heightPercent
          ) {
            dispatch(
              updateBlock({
                id: block.id,
                newBlock: {
                  ...block,
                  xPercent,
                  yPercent,
                  widthPercent,
                  heightPercent,
                },
              })
            );
          }
        });
      });
    };

    updateAllBlocks();
  }, [dispatch, revision]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        justifyContent: "center",
        flexWrap: "wrap",
        userSelect: "none",
      }}
    >
      {slides.map((slide, i) => (
        <Box
          component={motion.div}
          key={slide.id}
          onClick={() => dispatch(setCurrentIndex(i))}
          layout
          initial={false}
          animate={{
            borderColor: i === currentIndex ? theme?.colors.heading : "#ccc",
          }}
          whileHover={{ borderColor: theme?.colors.paragraph }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          sx={{
            width: "100%",
            boxSizing: "border-box",
            height: 130,
            borderRadius: 1,
            overflow: "hidden",
            borderStyle: "solid",
            borderWidth: 1,
            cursor: "pointer",
            position: "relative",
            transition: "all 0.2s",
            background: theme?.colors.background || "#fff",
          }}
        >
          {/* Содержимое миниатюры */}
          <Box
            id={`mini-${slide.id}`}
            sx={{
              transform: "scale(0.2)",
              transformOrigin: "top left",
              width: slideWidth,
              height: slideHeight,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            <SlideContent
              slide={slide}
              setSlideContent={() => {}}
              renderBlock={(block: SlideBlock) => (
                <Box
                  data-block-id={block.id}
                  sx={{
                    width: "100%",
                    height: block.type === "chart" ? 270 : "auto",
                    backgroundColor:
                      block.type === "chart" ? "#ccc" : "transparent",
                    borderRadius: block.type === "chart" ? 1 : 0,
                  }}
                >
                  {block.type !== "chart" && (
                    <RenderBlock
                      key={block.id}
                      block={block}
                      id={block.id}
                      slideId={slide.id}
                      editingBlock={null}
                      editValue=""
                      setEditValue={() => {}}
                      setEditingBlock={() => {}}
                    />
                  )}
                </Box>
              )}
            />
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 4,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid lightgray",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: theme?.colors.heading,
                fontFamily: theme?.fonts.heading,
                fontWeight: "bold",
                backgroundColor: "rgba(255, 255, 255, 0)",
                px: 1,
                py: 0.35,
                borderRadius: "4px",
                maxWidth: "70%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {slide.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme?.colors.heading,
                fontFamily: theme?.fonts.heading,
                fontWeight: "bold",
                backgroundColor: "rgba(255, 255, 255, 0)",
                px: 1,
                borderRadius: "4px",
              }}
            >
              {i + 1}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default MiniSlides;
