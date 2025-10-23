import React, { ChangeEvent, useState } from "react";
import {
  Box,
  IconButton,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { PlateSlide, Theme } from "../../../../shared/types/markdownTypes";
import { motion, AnimatePresence } from "framer-motion";
import SlideContent from "../../blocks/SlideContent";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../app/store";
import { updateSlideContent } from "../../../../app/store/slices/editorSlice";
import { markdownToSlides } from "../../../../shared/utils/markdownToSlides";
import { LoadingOverlay } from "../../../../shared/components";
import { buttonAttributes } from "../../../../shared/constants/buttonAttributes";

const API_URL = process.env.REACT_APP_API_URL;

interface SlideWithEditorProps {
  currentSlide: PlateSlide;
  theme?: Theme;
  slideHeight: number;
  setSlideContent: (content: any) => void;
  renderBlock: (block: any) => React.ReactNode;
}

const SlideEditPrompt: React.FC<SlideWithEditorProps> = ({
  currentSlide,
  theme,
  slideHeight,
  setSlideContent,
  renderBlock,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [editing, setEditing] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBtn, setSelectedBtn] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/presentation/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textValue || undefined,
          action: "custom",
          slide: {
            slide_id: currentSlide.id,
            title: currentSlide.title || "",
            content: currentSlide.content || "",
          },
        }),
      });

      if (!response.ok) throw new Error("Ошибка при отправке данных");

      const markdownString = await response.text();
      const parsedSlides = markdownToSlides(markdownString);
      const updatedBlocks = parsedSlides[0]?.content || [];

      dispatch(
        updateSlideContent({
          slideId: currentSlide.id,
          newContent: updatedBlocks,
        })
      );

      setEditing(false);
    } catch (err) {
      setError("Ошибка отправки запроса");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (attribute: string) => {
    setSelectedBtn(attribute);
    setTextValue(attribute);
  };

  if (loading) return <LoadingOverlay />;
  return (
    <Box
      id={currentSlide.id}
      sx={{
        position: "relative",
        height: "100%",
        border: `1px solid #ccc`,
        borderRadius: 2,
        overflow: "hidden",
        flexShrink: 0,
        transition: "all 0.2s",
        "&:hover": {
          border: `1px solid ${theme?.colors.heading}`,
          "& .hoverIcon": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AnimatePresence mode="popLayout">
        {editing ? (
          <motion.div
            key="editor-open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <Box sx={{ p: 2, height: "100%", boxSizing: "border-box" }}>
              <TextField
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                multiline
                label="Редактировать"
                minRows={5}
                maxRows={10}
                placeholder="Введите промпт или текст..."
                sx={{
                  width: "100%",

                  boxSizing: "border-box",
                  fontFamily: "Arial",
                  fontSize: 16,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 4,
                    color: "#a5a5a5ff",
                    resize: "none",
                  },
                  "& .MuiFormLabel-root": {
                    color: "#777777ff",
                  },
                }}
              />
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
                {buttonAttributes.map((btn) => {
                  const isSelected = selectedBtn === btn.dataAttr;

                  return (
                    <Button
                      key={btn.id}
                      variant={isSelected ? "contained" : "outlined"}
                      size="small"
                      sx={{
                        borderRadius: 2,
                        minWidth: 100,
                        minHeight: 20,
                        mt: 1,
                        px: 0,
                        bgcolor: isSelected ? "#334e68" : "rgba(0,0,0,0)",
                        color: isSelected ? "#fff" : "#334e68",
                        "&:hover": {
                          bgcolor: isSelected ? "#334e68" : "#334e68",
                          color: "#fff",
                        },
                      }}
                      data-attribute={btn.dataAttr}
                      title={btn.tooltip}
                      onClick={() => handleChange(btn.dataAttr)}
                    >
                      {btn.label}
                    </Button>
                  );
                })}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: 1,
                  mt: 1,
                }}
              >
                <Button
                  onClick={() => setEditing(false)}
                  variant="outlined"
                  sx={{
                    height: 50,
                    borderRadius: "12px",
                    color: "#334e68",
                    borderColor: "#334e68",
                    px: 2,
                    justifyContent: "flex-start",
                    textTransform: "none",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    "&:hover": { bgcolor: "#334e68" + "12" },
                  }}
                >
                  Отмена
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  startIcon={<PlayArrowIcon />}
                  disabled={loading}
                  sx={{
                    height: 50,
                    borderRadius: "12px",
                    bgcolor: "#334e68",
                    textTransform: "none",
                    color: "white",
                    "&:hover": { bgcolor: "#334e68" },
                  }}
                >
                  {"Сгенерировать"}
                </Button>
              </Box>
            </Box>
          </motion.div>
        ) : (
          <motion.div
            key="editor-closed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ height: "100%" }}
          >
            <SlideContent
              slide={currentSlide}
              setSlideContent={setSlideContent}
              renderBlock={renderBlock}
            />

            <IconButton
              className="hoverIcon"
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "rgba(255,255,255,0.8)",
                boxShadow: 1,
                opacity: 0,
                transform: "translateY(-5px)",
                transition: "all 0.2s ease",
                zIndex: 10,
                "&:hover": { bgcolor: "rgba(255,255,255,1)" },
              }}
              onClick={() => setEditing(true)}
            >
              <AutoAwesomeIcon sx={{ color: theme?.colors.heading }} />
            </IconButton>
          </motion.div>
        )}
      </AnimatePresence>
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SlideEditPrompt;
