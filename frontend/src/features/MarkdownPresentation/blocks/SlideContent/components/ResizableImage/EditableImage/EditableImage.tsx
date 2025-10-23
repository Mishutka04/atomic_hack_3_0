import React, { useState, useRef } from "react";
import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../../../../app/store";
import { pushHistory, updateBlock } from "../../../../../../../app/store/slices/editorSlice";
import { Theme } from "../../../../../../../shared/types";

interface Props {
  slideId: string;
  blockId: string;
}

const EditableImage: React.FC<Props> = ({ slideId, blockId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const block = useSelector((state: RootState) => {
    const slide = state.editor.slides.find((s) => s.id === slideId);
    return slide?.content.find((b) => b.id === blockId);
  });

  const slide = useSelector((state: RootState) =>
    state.editor.slides.find((s) => s.id === slideId)
  );

  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState(block?.url);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const theme: Theme | undefined = useSelector((state: RootState) =>
    state.editor.availableThemes.find(
      (t) => t.id === state.editor.globalThemeId
    )
  );

  if (!block) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setTempUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") setTempUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    dispatch(
      updateBlock({ id: block.id, newBlock: { ...block, url: tempUrl } })
    );
    dispatch(pushHistory());
    setOpen(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Box
        component="img"
        src={block.url}
        alt="Image"
        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {hover && (
        <IconButton
          size="small"
          sx={{
            position: "absolute",
            top: 4,
            left:
              slide?.layout === "right-image" || slide?.layout === "top-image"
                ? 4
                : undefined,
            right:
              slide?.layout !== "right-image" && slide?.layout !== "top-image"
                ? 4
                : undefined,
            bgcolor: "white",
            boxShadow: 1,
            "&:hover": { bgcolor: "#eee" },
            color: theme?.colors.heading,
          }}
          onClick={() => setOpen(true)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Image</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Image URL"
            fullWidth
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
          />
          <Box
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              border: `2px dashed ${dragOver ? "#1976d2" : "#ccc"}`,
              borderRadius: 2,
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              textAlign: "center",
              transition: "border-color 0.2s",
              bgcolor: dragOver ? "#f0f7ff" : "transparent",
            }}
          >
            <CloudUploadIcon fontSize="large" sx={{ mb: 1 }} />
            <Typography variant="body2" color="textSecondary">
              Drag & Drop an image here, or click to select
            </Typography>
            <input
              type="file"
              hidden
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </Box>

          {tempUrl && (
            <Box sx={{ width: "100%", height: 200, mt: 2 }}>
              <Box
                component="img"
                src={tempUrl}
                alt="Preview"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  border: "1px solid #ccc",
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setTempUrl(block.url);
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditableImage;
