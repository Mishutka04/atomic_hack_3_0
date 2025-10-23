import React, { useState } from "react";
import { Typography } from "@mui/material";
import EditableWrapper from "../EditableWrapper";
import TextEditor from "../TextEditor";
import { SlideBlock } from "../../../../../../shared/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../../app/store";
import {
  deleteBlock,
  pushHistory,
  updateBlock,
} from "../../../../../../app/store/slices/editorSlice";

export interface HeadingBlockProps {
  block: SlideBlock;
  id: string;
  slideId: string;
  editingBlock: SlideBlock;
  editValue: string;
  setEditValue: (val: string) => void;
  setEditingBlock: (val: any) => void;
}

const HeadingBlock: React.FC<HeadingBlockProps> = ({
  block,
  id,
  slideId,
  editingBlock,
  editValue,
  setEditValue,
  setEditingBlock,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isEditing = editingBlock?.id === id;

  const theme = useSelector((state: RootState) =>
    state.editor.availableThemes.find(
      (t) => t.id === state.editor.globalThemeId
    )
  );

  const handleBlur = () => {
    dispatch(
      updateBlock({ id: block.id, newBlock: { ...block, text: editValue } })
    );
    dispatch(pushHistory());
    setEditingBlock(null);
  };

  const handleEdit = () => {
    setEditingBlock({ type: "heading", id, slideId });
    setEditValue(block.text || "");
  };

  const handleDelete = () => {
    dispatch(deleteBlock({ slideId, blockId: block.id }));
  };

  const handleSettingsChange = (settings: {
    fontFamily: string;
    fontSize: number;
  }) => {
    dispatch(
      updateBlock({
        id: block.id,
        newBlock: {
          ...block,
          style: {
            ...block.style,
            ...settings,
          },
        },
      })
    );
  };

  return isEditing ? (
    <TextEditor
      value={editValue}
      onChange={setEditValue}
      onBlur={handleBlur}
      block={block}
    />
  ) : (
    <EditableWrapper
      onEdit={handleEdit}
      onDelete={handleDelete}
      onSettingsChange={handleSettingsChange}
      block={block}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          minHeight: 40,
          minWidth: 105,
          fontFamily:
            block.style?.fontFamily || theme?.fonts.heading || "Arial",
          fontSize: block.style?.fontSize || "2rem",
          color: block.style?.color || theme?.colors.heading || "#000",
          textAlign: block.justifyContent === "flex-end" ? "end" : "start",
        }}
      >
        {block.text}
      </Typography>
    </EditableWrapper>
  );
};

export default HeadingBlock;
