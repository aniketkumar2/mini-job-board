// pages/OAuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { handleSocialLogin } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const provider = params.get("provider");

    if (provider && token) {
      handleSocialLogin(provider, token).then(() => {
        navigate("/", { replace: true });
      });
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  return <div>Logging in...</div>;
}
