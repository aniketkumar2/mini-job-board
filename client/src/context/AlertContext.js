import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Error, Info } from "@mui/icons-material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const AlertContext = createContext(null);
const iconStyle = { fontSize: "45px" };

const typeConfig = {
  success: {
    icon: <CheckCircleOutlineIcon color="success" sx={iconStyle} />,
    color: "success",
    defaultTitle: "Success",
  },
  error: {
    icon: <ErrorOutlineIcon color="error" sx={iconStyle} />,
    color: "error",
    defaultTitle: "Error",
  },
  warning: {
    icon: <ErrorOutlineIcon color="warning" sx={iconStyle} />,
    color: "warning",
    defaultTitle: "Warning",
  },
  info: {
    icon: <Info color="info" sx={iconStyle} />,
    color: "info",
    defaultTitle: "Information",
  },
};

export const AlertProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState({
    type: "info",
    title: "",
    message: "",
    buttons: [{ label: "OK", onClick: () => {} }],
  });

  const showAlert = useCallback(
    ({ type = "info", title, message, buttons = [{ label: "OK" }] }) => {
      setOptions({
        type,
        title: title || typeConfig[type].defaultTitle,
        message,
        buttons,
      });
      setOpen(true);
    },
    []
  );

  const handleClose = () => setOpen(false);

  const config = typeConfig[options.type] || typeConfig.info;

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            flexDirection="column"
            gap={1}
          >
            {config.icon}
            <Typography variant="h6">{options.title}</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography>{options.message}</Typography>
        </DialogContent>

        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1, // <-- spacing between buttons
          }}
        >
          {options.buttons.map((btn, i) => (
            <Button
              key={i}
              onClick={() => {
                setOpen(false);
                btn.onClick && btn.onClick();
              }}
              color={config.color}
              variant={btn.variant || "contained"}
            >
              {btn.label}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
    </AlertContext.Provider>
  );
};

export const useAlertDialog = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error("useAlertDialog must be used inside <AlertProvider>");
  }
  return ctx;
};
