import React, { useState } from "react";
import { Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../../../app/store";
import {
  pushHistory,
  updateBlock,
} from "../../../../../../app/store/slices/editorSlice";
import EditableImage from "./EditableImage";

interface Props {
  slideId: string;
  blockId: string;
  horizontal?: boolean;
  inverted?: boolean;
}

const ResizableImage: React.FC<Props> = ({
  slideId,
  blockId,
  horizontal = false,
  inverted = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const block = useSelector((state: RootState) => {
    const slide = state.editor.slides.find((s) => s.id === slideId);
    return slide?.content.find((b) => b.id === blockId);
  });

  const theme = useSelector((state: RootState) =>
    state.editor.availableThemes.find(
      (t) => t.id === state.editor.globalThemeId
    )
  );

  const [dragging, setDragging] = useState(false);

  if (!block) return null;

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    const startPos = horizontal ? e.clientX : e.clientY;
    const startSize = horizontal
      ? block.widthPercent ?? 45
      : block.heightPercent ?? 20;
    const sensitivity = horizontal ? 0.11 : 0.2;

    const onMouseMove = (eMove: MouseEvent) => {
      let delta = (horizontal ? eMove.clientX : eMove.clientY) - startPos;
      if (inverted) delta = -delta;
      const newSize = Math.min(
        Math.max(startSize + delta * sensitivity, 10),
        90
      );
      dispatch(
        updateBlock({
          id: block.id,
          newBlock: horizontal
            ? { ...block, widthPercent: newSize }
            : { ...block, heightPercent: newSize },
        })
      );
    };

    const onMouseUp = () => {
      setDragging(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dispatch(pushHistory());
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const sizeValue = horizontal
    ? block.widthPercent ?? 45
    : block.heightPercent ?? 20;
  const sliderStyle = horizontal
    ? inverted
      ? { top: 0, left: 0, width: 6, height: "100%" }
      : { top: 0, right: 0, width: 6, height: "100%" }
    : inverted
    ? { top: 0, left: 0, width: "100%", height: 6 }
    : { bottom: 0, left: 0, width: "100%", height: 6 };

  return (
    <Box
      sx={{
        position: "relative",
        flex: horizontal ? `0 0 ${sizeValue}%` : undefined,
        width: horizontal ? undefined : "100%",
        height: horizontal ? "100%" : `${sizeValue}%`,
        userSelect: dragging ? "none" : undefined,
        overflow: "hidden",
        border: `1px solid ${theme?.colors.heading}`,
      }}
    >
      <EditableImage blockId={block.id} slideId={slideId} />
      <Box
        sx={{
          cursor: horizontal ? "col-resize" : "row-resize",
          position: "absolute",
          zIndex: 10,
          bgcolor: "rgba(0, 0, 0, 0)",
          transition: "all 0.2s",
          "&:hover": { bgcolor: theme?.colors.heading },
          ...sliderStyle,
        }}
        onMouseDown={startResize}
      />
    </Box>
  );
};

export default ResizableImage;
