import React from "react";
import { Box, Typography } from "@mui/material";
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

const ListBlock: React.FC<HeadingBlockProps> = ({
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
    const newItems = editValue
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    dispatch(
      updateBlock({
        id: block.id,
        newBlock: { ...block, items: newItems },
      })
    );

    dispatch(pushHistory());

    setEditingBlock(null);
  };

  const handleEdit = () => {
    setEditingBlock({ type: "list", id, slideId });
    setEditValue(block.items?.join("\n") || "");
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
      minRows={block.items?.length || 3}
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
      <Box
        component={block.type === "ordered-list" ? "ol" : "ul"}
        sx={{ pl: 4, m: 0, minHeight: 40, minWidth: 75 }}
      >
        {block.items?.map((item, i) => (
          <Box
            key={i}
            component="li"
            sx={{
              textAlign: block.justifyContent === "flex-end" ? "end" : "start",
              "&::marker": { color: theme?.colors.heading || "#000" },
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontFamily:
                  block.style?.fontFamily || theme?.fonts.paragraph || "Arial",
                fontSize: block.style?.fontSize || 16,
                color: block.style?.color || theme?.colors.paragraph || "#000",
              }}
            >
              {item}
            </Typography>
          </Box>
        ))}
      </Box>
    </EditableWrapper>
  );
};

export default ListBlock;
