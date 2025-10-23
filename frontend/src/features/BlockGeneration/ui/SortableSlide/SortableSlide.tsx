import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { Paper, Box, IconButton, Typography } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { RenderBlock } from "../RenderBlock/RenderBlock";
import { PlateSlide } from "../../../../shared/types";

interface Props {
  slide: PlateSlide;
  index: number;
  onEditSlide: (slideId: string, newContent: any[]) => void;
}

export const SortableSlide: React.FC<Props> = ({
  slide,
  index,
  onEditSlide,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: slide.id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fafafa",
    display: "flex",
    alignItems: "flex-start",
  };

  const handleEdit = (blockId: string, textOrItems: string | string[]) => {
    const newContent = slide.content.map((b) =>
      b.id === blockId
        ? {
            ...b,
            ...(Array.isArray(textOrItems)
              ? { items: textOrItems }
              : { text: textOrItems }),
          }
        : b
    );
    onEditSlide(slide.id, newContent);
  };

  return (
    <Paper ref={setNodeRef} style={style} sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
        <IconButton
          {...listeners}
          {...attributes}
          sx={{ cursor: "grab" }}
          size="small"
        >
          <DragIndicatorIcon />
        </IconButton>
        <Typography sx={{ ml: 1, fontWeight: "bold" }}>{index + 1}</Typography>
      </Box>
      <Box sx={{ flex: 1 }}>
        {slide.content.map((block) => (
          <RenderBlock key={block.id} block={block} onEdit={handleEdit} />
        ))}
      </Box>
    </Paper>
  );
};
