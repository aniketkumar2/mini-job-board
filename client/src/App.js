import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";

import JobsRoutes from "./components/JobRoutes";
import HeaderBar from "./components/Pages/HeaderBar";
import { UserProvider } from "./context/UserContext";
import { AlertProvider } from "./context/AlertContext";

function AppRoute() {
  return (
    <>
      <HeaderBar />
      <JobsRoutes />
    </>
  );
}
export default function App() {
  return (
    <AlertProvider>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <UserProvider>
            <AppRoute />
          </UserProvider>
        </BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </GoogleOAuthProvider>
    </AlertProvider>
  );
}
