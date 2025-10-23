import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <AppBar
      position="fixed"
      color="inherit"
      sx={{
        boxShadow: 0,
        borderBottom: "1px solid #ccc"
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton onClick={() => navigate("/")}>
          <AutoAwesomeIcon sx={{ color: "#334e68" }} />
        </IconButton>
        <Typography variant="h6" component="div">
          Bandito Gangsterito
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
