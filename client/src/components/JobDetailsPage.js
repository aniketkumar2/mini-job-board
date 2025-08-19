import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import moment from "moment";

import { toast } from "react-toastify";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import { fetchJobById } from "../functions/jobs_ops";
import { useUser } from "../context/UserContext";
import { API_HOST } from "../constants/config";
import JobFormModal from "./JobFormModal";
import apiClient from "../utils/apiClient";

function JobDetailsPage() {
  const { user } = useUser();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const applyToJob = async (jobId) => {
    try {
      const { data } = await apiClient.post(
        `${API_HOST}/api/applications/apply`,
        {
          jobId,
        }
      );
      if (data?.status) {
        toast.success(data?.message || `Application submitted`);
      } else {
        toast.error(data.message || "Something went wrong while applying");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong while applying");
    }
  };
  const loadJob = async () => {
    setLoading(true);
    const res = await fetchJobById(id);

    if (res.status) {
      setJob(res.data);
      setError("");
    } else {
      setError(res.message || "Failed to load job details");
      setJob(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadJob();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4} textAlign="center">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!job) return null;

  return (
    <Box
      mt={5}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap="20px"
      px={{ xs: 2, sm: 3, md: 4 }} // Padding for small to medium screens
    >
      {modalOpen && (
        <JobFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          job={job} // pass a job object here for edit mode
          onRefresh={loadJob}
        />
      )}
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 2, sm: 3, md: 4 },
          width: "100%",
          maxWidth: { xs: "95%", sm: "90%", md: "80%" },
        }}
      >
        <Typography variant="h5" gutterBottom>
          {job.title}
        </Typography>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {job?.company}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ fontWeight: "bold" }}
          >
            {moment(job?.createdAt).fromNow()}
          </Typography>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box mt={2}>
            <Chip label={job.type} color="primary" />
          </Box>
          {job?.is_admin ? (
            <Button
              onClick={() => {
                setModalOpen(true);
              }}
            >
              Edit Job
            </Button>
          ) : user ? (
            job.is_applied ? (
              <Box mt={2}>
                <Chip label={"Applied"} color="primary" />
              </Box>
            ) : (
              <Button onClick={() => applyToJob(job._id)}>Apply</Button>
            )
          ) : (
            <Button onClick={() => navigate("/login")}>Login to Apply</Button>
          )}
        </div>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
          {job.description}
        </Typography>
      </Paper>

      <Link to="/" style={{ textDecoration: "none" }}>
        <Button variant="contained" color="primary">
          Back To Home
        </Button>
      </Link>
    </Box>
  );
}

export default JobDetailsPage;
