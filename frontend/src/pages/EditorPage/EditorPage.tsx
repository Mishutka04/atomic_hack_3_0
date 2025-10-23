import { Box, Container } from "@mui/material";
import { AiChat, MarkdownPresentation } from "../../features";
import { Theme } from "../../shared/types";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { AnimatePresence, motion } from "framer-motion";

function EditorPage() {
  const theme: Theme | undefined = useSelector((state: RootState) =>
    state.editor.availableThemes.find(
      (t) => t.id === state.editor.globalThemeId
    )
  );
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        style={{height: "100%"}}
      >
        <Container
          sx={{
            maxWidth: "3000px !important",
            maxHeight: "100% !important",
            px: "0 !important",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            bgcolor: "rgba(240, 240, 240, 0.36)",
          }}
        >
          <AiChat />
          <MarkdownPresentation />
        </Container>
      </motion.div>
    </AnimatePresence>
  );
}

export default EditorPage;
