import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function PrivacyPolicy() {
  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: 2,
        bgcolor: "#f7f8fa",
      }}
    >
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          maxWidth: 800,
          width: "100%",
        }}
        elevation={3}
      >
        <Typography variant="h4" gutterBottom>
          Privacy Policy
        </Typography>

        <Typography variant="body1" paragraph>
          We value your privacy and are committed to protecting your personal
          information. This Privacy Policy explains what data we collect, how we
          use it, and your rights regarding your data.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Data We Collect
        </Typography>
        <Typography variant="body1" paragraph>
          - Name, email address, and profile information when you sign in using
          social login (Google, Facebook). <br />- Any data you voluntarily
          provide while using our services.
        </Typography>

        <Typography variant="h6" gutterBottom>
          How We Use Your Data
        </Typography>
        <Typography variant="body1" paragraph>
          We use your data to:
          <ul>
            <li>Authenticate your account and provide login functionality.</li>
            <li>Personalize your experience on our platform.</li>
            <li>Communicate important updates or notifications.</li>
          </ul>
        </Typography>

        <Typography variant="h6" gutterBottom>
          Your Rights
        </Typography>
        <Typography variant="body1" paragraph>
          You can request to view, update, or delete your personal data at any
          time. To delete your account, please visit our{" "}
          <a href="/delete-account">Delete Account</a> page.
        </Typography>

        <Typography variant="body1" paragraph>
          For any questions about this Privacy Policy, contact us at:
          support@yourapp.com
        </Typography>
      </Paper>
    </Box>
  );
}
