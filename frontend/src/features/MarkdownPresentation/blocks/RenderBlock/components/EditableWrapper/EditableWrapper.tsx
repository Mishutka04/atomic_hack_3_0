import React from "react";
import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import { defaultFonts } from "../../../../../../shared/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../../app/store";
import { pushHistory } from "../../../../../../app/store/slices/editorSlice";
import { SlideBlock } from "../../../../../../shared/types";

interface EditableWrapperProps {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete?: () => void;
  onSettingsChange?: (settings: {
    fontFamily: string;
    fontSize: number;
  }) => void;
  block?: SlideBlock;
}

const EditableWrapper: React.FC<EditableWrapperProps> = ({
  children,
  onEdit,
  onDelete,
  onSettingsChange,
  block,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [hovered, setHovered] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [fontFamily, setFontFamily] = React.useState("Arial");
  const [fontSize, setFontSize] = React.useState(16);

  const theme = useSelector((state: RootState) =>
    state.editor.availableThemes.find(
      (t) => t.id === state.editor.globalThemeId
    )
  );
  const openSettings = () => {
    setFontFamily((block?.style?.fontFamily || "Arial").split(",")[0].trim());
    setFontSize(block?.style?.fontSize || 16);
    setSettingsOpen(true);
  };

  const handleSettingsSave = () => {
    onSettingsChange?.({ fontFamily, fontSize });
    setSettingsOpen(false);
  };

  return (
    <Box
      sx={{
        position: "relative",
        border: hovered ? "1px dashed #bbb" : "1px solid transparent",
        borderRadius: 1,
        transition: "all 0.2s",
        "&:hover": {
          borderColor: "#999",
          backgroundColor: theme?.colors.background || "#fff",
        },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}

      {hovered && (
        <Box
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
            display: "flex",
            gap: 0.5,
          }}
        >
          <IconButton
            size="small"
            sx={{
              bgcolor: "white",
              boxShadow: 1,
              "&:hover": { bgcolor: "#eee" },
              color: theme?.colors.heading,
            }}
            onClick={onEdit}
          >
            <EditIcon fontSize="small" />
          </IconButton>

          {onSettingsChange && (
            <IconButton
              size="small"
              sx={{
                bgcolor: "white",
                boxShadow: 1,
                "&:hover": { bgcolor: "#eee" },
                color: theme?.colors.heading,
              }}
              onClick={openSettings}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          )}

          {onDelete && (
            <IconButton
              size="small"
              sx={{
                bgcolor: "white",
                boxShadow: 1,
                "&:hover": { bgcolor: "#eee" },
                color: theme?.colors.heading,
              }}
              onClick={() => {
                onDelete();
                dispatch(pushHistory());
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}

      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Настройки текста</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            select
            label="Шрифт"
            variant="standard"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
          >
            {defaultFonts.map((font) => (
              <MenuItem key={font} value={font}>
                {font}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Размер"
            variant="standard"
            value={block?.style?.fontSize || fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          >
            {[12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
              <MenuItem key={size} value={size}>
                {size}px
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Отмена</Button>
          <Button
            variant="contained"
            onClick={() => {
              handleSettingsSave();
              dispatch(pushHistory());
            }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditableWrapper;
