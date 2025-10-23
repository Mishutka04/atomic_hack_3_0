import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import CodeIcon from "@mui/icons-material/Code";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import TableChartIcon from "@mui/icons-material/TableChart";
import ListIcon from "@mui/icons-material/List";
import BarChartIcon from "@mui/icons-material/BarChart";
import TitleIcon from "@mui/icons-material/Title";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import VerticalAlignCenterIcon from "@mui/icons-material/VerticalAlignCenter";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import ThemeSelector from "../ThemeSelector";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../app/store";
import {
  pushHistory,
  updateSlideContent,
} from "../../../../app/store/slices/editorSlice";
import { SlideBlock } from "../../../../shared/types";
import { v4 as uuidv4 } from "uuid";

interface Props {
  slideId: string;
}

const SlideToolbar: React.FC<Props> = ({ slideId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const slide = useSelector((state: RootState) =>
    state.editor.slides.find((s) => s.id === slideId)
  );

  const theme = useSelector((state: RootState) =>
    state.editor.availableThemes.find(
      (t) => t.id === state.editor.globalThemeId
    )
  );

  if (!slide) return null;

  const addBlock = (type: SlideBlock["type"]) => {
    const newBlock: SlideBlock = {
      id: uuidv4(),
      type,
      text:
        type === "heading"
          ? "Заголовок"
          : type === "paragraph"
          ? "Текст"
          : type === "code"
          ? "// Ваш код"
          : type === "quote"
          ? "Цитата"
          : undefined,
      items: type === "list" ? ["Элемент 1", "Элемент 2"] : undefined,
      table:
        type === "table"
          ? {
              headers: ["Header 1", "Header 2"],
              rows: [
                ["", ""],
                ["", ""],
              ],
            }
          : undefined,
      chart:
        type === "chart"
          ? {
              type: "bar",
              labels: ["Label 1"],
              values: [0],
              colors: ["#4bc0c0"],
            }
          : undefined,
      style:
        type === "heading"
          ? { fontWeight: 700, fontSize: 28, color: theme?.colors.heading }
          : { fontWeight: 400, fontSize: 16, color: theme?.colors.paragraph },
    };
    dispatch(
      updateSlideContent({
        slideId: slide.id,
        newContent: [...slide.content, newBlock],
      })
    );
  };

  const setJustifyContent = (align: "flex-start" | "flex-end") => {
    if (!slide) return;
    const newContent = slide.content.map((b) => ({
      ...b,
      justifyContent: align,
    }));

    dispatch(
      updateSlideContent({
        slideId: slide.id,
        newContent,
      })
    );
    dispatch(pushHistory());
  };

  const setSlideAlignItems = (align: "flex-start" | "flex-end" | "center") => {
    if (!slide) return;
    dispatch(
      updateSlideContent({
        slideId: slide.id,
        newContent: slide.content,
        alignItems: align,
      })
    );
    dispatch(pushHistory());
  };

  return (
    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
      <Tooltip title="Добавить заголовок">
        <IconButton onClick={() => addBlock("heading")}>
          <TitleIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Добавить текст">
        <IconButton onClick={() => addBlock("paragraph")}>
          <TextFieldsIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Добавить код">
        <IconButton onClick={() => addBlock("code")}>
          <CodeIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Добавить цитату">
        <IconButton onClick={() => addBlock("quote")}>
          <FormatQuoteIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Добавить таблицу">
        <IconButton onClick={() => addBlock("table")}>
          <TableChartIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Добавить список">
        <IconButton onClick={() => addBlock("list")}>
          <ListIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Добавить график">
        <IconButton onClick={() => addBlock("chart")}>
          <BarChartIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Выравнивание влево">
        <IconButton onClick={() => setJustifyContent("flex-start")}>
          <FormatAlignLeftIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Выравнивание вправо">
        <IconButton onClick={() => setJustifyContent("flex-end")}>
          <FormatAlignRightIcon />
        </IconButton>
      </Tooltip>

      <ThemeSelector />

      <Tooltip title="Сверху">
        <IconButton onClick={() => setSlideAlignItems("flex-start")}>
          <VerticalAlignTopIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="По центру">
        <IconButton onClick={() => setSlideAlignItems("center")}>
          <VerticalAlignCenterIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Снизу">
        <IconButton onClick={() => setSlideAlignItems("flex-end")}>
          <VerticalAlignBottomIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default SlideToolbar;
