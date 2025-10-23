import React from "react";
import { Box } from "@mui/material";
import EditableWrapper from "../EditableWrapper";
import TextEditor from "../TextEditor";
import { HeadingBlockProps } from "../HeadingBlock/HeadingBlock";
import {
  deleteBlock,
  pushHistory,
  updateBlock,
} from "../../../../../../app/store/slices/editorSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../../app/store";

const CodeBlock: React.FC<HeadingBlockProps> = ({
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
      updateBlock({
        id: block.id,
        newBlock: { ...block, text: editValue },
      })
    );
    dispatch(pushHistory());
    setEditingBlock(null);
  };

  const handleEdit = () => {
    setEditingBlock({ type: "code", id, slideId });
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
            ...(block.style || {}),
            fontFamily: settings.fontFamily,
            fontSize: settings.fontSize,
          },
        },
      })
    );
  };

  return isEditing ? (
    <TextEditor
      minRows={4}
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
    >
      <Box
        component="pre"
        sx={{
          backgroundColor: theme?.colors.paragraph + "20" || "#f5f5f5",
          p: 2,
          minHeight: 40,
          minWidth: 105,
          lineHeight: 1,
          borderRadius: 1,
          overflowX: "auto",
          fontFamily:
            block.style?.fontFamily || theme?.fonts.paragraph || "Arial",
          fontSize: block.style?.fontSize || 14,
          color: block.style?.color || theme?.colors.paragraph || "#000",
        }}
      >
        <code>{block.text}</code>
      </Box>
    </EditableWrapper>
  );
};

export default CodeBlock;
