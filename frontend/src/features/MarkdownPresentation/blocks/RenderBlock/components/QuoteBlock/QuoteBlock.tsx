import React from "react";
import { Typography } from "@mui/material";
import EditableWrapper from "../EditableWrapper";
import TextEditor from "../TextEditor";
import { HeadingBlockProps } from "../HeadingBlock/HeadingBlock";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../../app/store";
import {
  deleteBlock,
  pushHistory,
  updateBlock,
} from "../../../../../../app/store/slices/editorSlice";

const QuoteBlock: React.FC<HeadingBlockProps> = ({
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
    setEditingBlock({ type: "quote", id, slideId });
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
      minRows={2}
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
        variant="body2"
        sx={{
          fontStyle: "italic",
          minHeight: 20,
          minWidth: 75,
          borderLeft:
            block.justifyContent === "flex-start" || !block.justifyContent
              ? `3px solid ${theme?.colors.paragraph || "#ccc"}`
              : undefined,
          borderRight:
            block.justifyContent === "flex-end"
              ? `3px solid ${theme?.colors.paragraph || "#ccc"}`
              : undefined,
          px: 2,
          py: 1.2,
          fontFamily:
            block.style?.fontFamily || theme?.fonts.paragraph || "Arial",
          fontSize: block.style?.fontSize || 16,
          color: block.style?.color || theme?.colors.paragraph || "#000",
          textAlign: block.justifyContent === "flex-end" ? "end" : "start",
        }}
      >
        {block.text}
      </Typography>
    </EditableWrapper>
  );
};

export default QuoteBlock;
