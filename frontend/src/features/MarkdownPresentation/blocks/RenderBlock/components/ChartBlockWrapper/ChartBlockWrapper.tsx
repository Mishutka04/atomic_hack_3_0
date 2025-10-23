import React from "react";
import { Box } from "@mui/material";
import EditableWrapper from "../EditableWrapper";
import ChartBlock from "../ChartBlock";
import ChartEditor from "../ChartEditor";
import { HeadingBlockProps } from "../HeadingBlock/HeadingBlock";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../../app/store";
import {
  deleteBlock,
  pushHistory,
  updateBlock,
} from "../../../../../../app/store/slices/editorSlice";
import { themes } from "../../../../../../shared/constants";

const ChartBlockWrapper: React.FC<HeadingBlockProps> = ({
  block,
  id,
  slideId,
  editingBlock,
  setEditingBlock,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const theme = useSelector((state: RootState) =>
    state.editor.availableThemes.find(
      (t) => t.id === state.editor.globalThemeId
    )
  );

  const isEditing = editingBlock?.id === id;

  const handleEdit = () => setEditingBlock({ type: "chart", id, slideId });

  const handleSave = (newChart: NonNullable<typeof block.chart>) => {
    const chartCopy = {
      ...newChart,
      labels: [...newChart.labels],
      values: [...newChart.values],
      colors: Array.isArray(newChart.colors)
        ? [...newChart.colors]
        : newChart.colors,
    };
    dispatch(
      updateBlock({ id: block.id, newBlock: { ...block, chart: chartCopy } })
    );
    dispatch(pushHistory());
    setEditingBlock(null);
  };

  const handleCancel = () => setEditingBlock(null);

  const handleDelete = () => {
    dispatch(deleteBlock({ slideId, blockId: block.id }));
  };

  return (
    <>
      <EditableWrapper onEdit={handleEdit} onDelete={handleDelete}>
        <Box
          sx={{
            width: "100%",
            maxWidth: 750,
            mx: "auto",
            fontFamily: theme?.fonts.paragraph || "Inter, sans-serif",
            color: theme?.colors.paragraph || "#000",
          }}
        >
          {block.chart && (
            <ChartBlock chart={block.chart} theme={theme ?? themes[0]} />
          )}
        </Box>
      </EditableWrapper>

      {block.chart && (
        <ChartEditor
          open={isEditing}
          initialChart={block.chart}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default ChartBlockWrapper;
