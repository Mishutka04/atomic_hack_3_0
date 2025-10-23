import React, { useState, useEffect } from "react";
import { Container, Box, Button, Paper, Typography } from "@mui/material";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useSelector, useDispatch } from "react-redux";

import { PlateSlide } from "../../../../shared/types";
import { SortableSlide } from "../SortableSlide/SortableSlide";
import { RootState, AppDispatch } from "../../../../app/store";
import {
  reorderSlides,
  updateSlideContent,
} from "../../../../app/store/slices/editorSlice";

export const SlidesList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const slides = useSelector(
    (state: RootState) => state.editor.slides
  ) as PlateSlide[];
  const [localSlides, setLocalSlides] = useState<PlateSlide[]>([]);

  useEffect(() => {
    setLocalSlides(slides);
  }, [slides]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = localSlides.findIndex((s) => s.id === active.id);
      const newIndex = localSlides.findIndex((s) => s.id === over.id);

      const newSlides = arrayMove(localSlides, oldIndex, newIndex);
      setLocalSlides(newSlides);

      dispatch(reorderSlides({ oldIndex, newIndex }));
    }
  };

  const handleEditSlide = (slideId: string, newContent: any[]) => {
    setLocalSlides((prev) =>
      prev.map((s) => (s.id === slideId ? { ...s, content: newContent } : s))
    );
    dispatch(updateSlideContent({ slideId, newContent }));
  };

  return (
    <Container
      component={Paper}
      sx={{
        maxWidth: "1000px !important",
        p: 4,
        boxShadow: "none",
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5">Первичная Настройка</Typography>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localSlides.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {localSlides.map((slide, i) => (
            <SortableSlide
              key={slide.id}
              slide={slide}
              index={i}
              onEditSlide={handleEditSlide}
            />
          ))}
        </SortableContext>
      </DndContext>
    </Container>
  );
};
