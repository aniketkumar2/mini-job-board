import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useGoogleLogin } from "@react-oauth/google";
import { useFacebookSDK } from "../hook/useFacebookSDK";

const socialLoginBtnStyle = {
  flex: 1,
  display: "flex",
  gap: "10px",
};
const socialLoginIconStyle = {
  flex: 1,
  display: "flex",
  justifyContent: "flex-end",
};
const socialLoginLabelStyle = {
  flex: 1,
  display: "flex",
};

function GoogleLoginButton() {
  const { socialLogin } = useUser();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (tokenResponse?.access_token) {
        await socialLogin("google", tokenResponse.access_token);
      }
    },
    onError: () => console.error("Google login failed"),
    flow: "implicit",
  });

  return (
    <Button
      variant="outlined"
      onClick={() => {
        console.log("GoogleLoginButton clicked login");
        login();
      }}
    >
      <div style={socialLoginBtnStyle}>
        <span style={socialLoginIconStyle}>
          <GoogleIcon />
        </span>
        <span style={socialLoginLabelStyle}>Google</span>
      </div>
    </Button>
  );
}

export default function LoginPage() {
  const { login, socialLogin } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const fbLoaded = useFacebookSDK();

  const navigate = useNavigate();

  const handleEmailLogin = async () => {
    try {
      setMessage(null);
      await login(email, password);
      // redirect after login
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    }
  };
  const handleFacebookClick = () => {
    if (!fbLoaded) return;

    window.FB.login(
      (response) => {
        // wrap async call in a normal function
        handleFacebookLogin(response);
      },
      { scope: "email,public_profile" }
    );
  };

  const handleFacebookLogin = async (response) => {
    if (response.accessToken) {
      try {
        await socialLogin("facebook", response.accessToken);
        console.log("Facebook login success");
      } catch (err) {
        console.error("Facebook login failed:", err.message);
      }
    } else {
      console.error("Facebook login failed: No access token");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // bgcolor: "#f7f8fa",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          maxWidth: 400,
          width: "100%",
          bgcolor: "#ffffff",
          boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
        }}
      >
        {message?.text && (
          <Alert severity={message?.type} sx={{ mb: 2 }}>
            {message?.text}
          </Alert>
        )}
        <Stack spacing={3}>
          <Typography
            variant="h5"
            align="center"
            fontWeight={600}
            color="primary"
          >
            Welcome Back
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            Log in to continue your journey
          </Typography>

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ bgcolor: "#fafafa", borderRadius: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ bgcolor: "#fafafa", borderRadius: 2 }}
          />

          <Button
            variant="contained"
            size="large"
            onClick={handleEmailLogin}
            sx={{
              bgcolor: "#6C63FF",
              "&:hover": { bgcolor: "#5a52d6" },
              borderRadius: 2,
              py: 1.2,
            }}
          >
            Login
          </Button>

          <Divider>or continue with</Divider>

          <Stack spacing={1}>
            <GoogleLoginButton
              onError={() =>
                setMessage({ text: "Google login failed", type: "error" })
              }
            />

            <Button
              variant="outlined"
              disabled={!fbLoaded}
              onClick={() => {
                handleFacebookClick();
              }}
            >
              <div style={socialLoginBtnStyle}>
                <span style={socialLoginIconStyle}>
                  <FacebookIcon />
                </span>
                <span style={socialLoginLabelStyle}>Facebook</span>
              </div>
            </Button>
          </Stack>

          <Divider />

          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            Don’t have an account?{" "}
            <Typography
              component="span"
              color="primary"
              sx={{
                cursor: "pointer",
                fontWeight: 500,
              }}
              onClick={() => navigate("/register")}
            >
              Create one
            </Typography>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
