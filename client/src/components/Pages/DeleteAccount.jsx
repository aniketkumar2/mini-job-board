import React, { useState } from "react";
import { Box, Button, Paper, Typography, Alert } from "@mui/material";
import { useUser } from "../../context/UserContext";

export default function DeleteAccount() {
  const { logout } = useUser(); // For now, just log out
  const [deleted, setDeleted] = useState(false);

  const handleDelete = () => {
    // Here you can call backend API to delete the user
    // For testing, we just simulate account deletion
    setDeleted(true);
    logout(); // clear tokens and redirect to login
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        bgcolor: "#f7f8fa",
      }}
    >
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          maxWidth: 500,
          width: "100%",
          textAlign: "center",
        }}
        elevation={3}
      >
        <Typography variant="h4" gutterBottom>
          Delete Account
        </Typography>

        {deleted ? (
          <Alert severity="success">
            Your account has been deleted successfully.
          </Alert>
        ) : (
          <>
            <Typography variant="body1" paragraph>
              By clicking the button below, your account and all associated data
              will be permanently deleted.
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              sx={{ mt: 2 }}
            >
              Delete My Account
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}
