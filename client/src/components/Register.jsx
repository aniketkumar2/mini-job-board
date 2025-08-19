import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Alert,
  InputAdornment,
  Divider,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";
import { API_HOST } from "../constants/config";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    user_type: "user",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      const res = await axios.post(`${API_HOST}/api/auth/register`, formData);

      setMessage({
        text: res?.data?.message,
        type: res?.data?.status ? "success" : "error",
      });
      if (res?.data?.status) {
        navigate("/login", { replace: true });
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.error || "Registration failed",
        type: "error",
      });
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          p: 4,
          bgcolor: "white",
          boxShadow: 3,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Create an Account
        </Typography>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            required
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            label="User Type"
            name="user_type"
            fullWidth
            margin="normal"
            value={formData.user_type}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.2, fontWeight: "bold" }}
          >
            Register
          </Button>
        </form>
        <Divider sx={{ mt: 2 }} />

        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          Already have an account?{" "}
          <Typography
            component="span"
            color="primary"
            sx={{
              cursor: "pointer",
              fontWeight: 500,
            }}
            onClick={() => navigate("/login", { replace: true })}
          >
            Login
          </Typography>
        </Typography>
      </Box>
    </Container>
  );
}
