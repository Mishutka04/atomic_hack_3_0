import { Box } from "@mui/material";
import React from "react";
import { PromptSend } from "../../features";

function PromptPage() {
  return (
    <Box sx={{height: "100%"}}>
      <PromptSend />
    </Box>
  );
}

export default PromptPage;
