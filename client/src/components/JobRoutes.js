// JobsRoutes.jsx
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
// import AddJobPage from "./AddJobPage";
import JobDetailsPage from "./JobDetailsPage";
import LoginPage from "./LoginPage";
import AppliedJobsPage from "./AppliedJobsPage";
import MyListingsPage from "./MyListingsPage";
import ProtectedRoute from "./ProtectedRoute";
import Register from "./Register";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import DeleteAccount from "./Pages/DeleteAccount";

const JobsRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/job/:id" element={<JobDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/delete-account" element={<DeleteAccount />} />

      {/* Protected Routes */}
      {/* <Route
        path="/add-job"
        element={
          <ProtectedRoute adminOnly>
            <AddJobPage />
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/applied-jobs"
        element={
          <ProtectedRoute>
            <AppliedJobsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-listings"
        element={
          <ProtectedRoute adminOnly>
            <MyListingsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default JobsRoutes;
