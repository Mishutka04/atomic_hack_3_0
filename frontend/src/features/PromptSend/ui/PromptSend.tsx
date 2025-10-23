import React from "react";
import UploadFileIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useGeneration } from "../../../shared/hooks";
import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "../../../shared/components";

export const PromptSend: React.FC = () => {
  const {
    inputText,
    setInputText,
    fileInputRef,
    fileStatus,
    handleFileChange,
    handleSubmit,
    loading,
    error,
    setError,
    model,
    setModel,
  } = useGeneration();

  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    const success = await handleSubmit(e);
    if (success) {
      navigate("/generate");
    }
  };

  if (loading) return <LoadingOverlay />;

  return (
    <Box
      sx={{
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        flexDirection: "column",
      }}
    >
      <Box
        mb={3}
        textAlign="center"
        sx={{
          maxWidth: 700,
          mb: 4,
        }}
      >
        <Typography
          sx={{ m: 0, color: "#334e68" }}
          variant="h3"
          fontWeight="bold"
        >
          Создавайте презентации без усилий
        </Typography>
        <Typography sx={{ margin: 0, color: "#334e68" + "cc" }} variant="h5">
          Просто напишите свои идеи и ИИ сделает все остальное
        </Typography>
      </Box>
      <form onSubmit={onSubmit} style={{ padding: "8px 8px", width: "700px" }}>
        <TextField
          fullWidth
          multiline
          minRows={5}
          maxRows={10}
          size="small"
          label="Запрос"
          placeholder="Прикрепите файл и введите в поле то, что хотите получить от ИИ в презентации."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              pr: 1,
            },
          }}
        />

        <Box
          mt={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".pdf,.docx"
            onChange={handleFileChange}
          />
          <Box>
            <Button
              onClick={() => fileInputRef.current?.click()}
              startIcon={
                fileStatus?.converted ? <CheckCircleIcon /> : <UploadFileIcon />
              }
              variant="outlined"
              sx={{
                height: 50,
                borderRadius: "12px",
                color: "#334e68",
                borderColor: "#334e68",
                maxWidth: 200,
                px: 2,
                justifyContent: "flex-start",
                textTransform: "none",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                "&:hover": { bgcolor: "#334e68" + "12" },
              }}
            >
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  verticalAlign: "middle",
                }}
              >
                {fileStatus?.name || "Прикрепить Файл"}
              </Box>
            </Button>

            <Select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              sx={{
                height: 50,
                ml: 2,
                maxWidth: 200,
                borderRadius: "12px",
                color: "#334e68",
                bgcolor: "white",
                border: "1px solid #334e68",
                textTransform: "none",
                fontSize: 15,
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  pl: 2,
                  pr: 4,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiSelect-icon": {
                  color: "#334e68",
                  right: 10,
                },
                "&:hover": {
                  bgcolor: "#334e68" + "12",
                },
                "& .MuiMenu-paper": {
                  borderRadius: "12px",
                },
              }}
            >
              <MenuItem value="google/gemma-3-12b-it">gemma-3-12b-it</MenuItem>
              <MenuItem value="moonshotai/kimi-k2-0905">kimi-k2-0905</MenuItem>
              <MenuItem value="openai/gpt-oss-120b">gpt-oss-120b</MenuItem>
            </Select>
          </Box>

          <Button
            type="submit"
            variant="contained"
            startIcon={<PlayArrowIcon />}
            sx={{
              height: 50,
              borderRadius: "12px",
              bgcolor: "#334e68",
              textTransform: "none",
              color: "white",
              "&:hover": { bgcolor: "#334e68" },
            }}
          >
            Сгенерировать
          </Button>
        </Box>
      </form>
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
