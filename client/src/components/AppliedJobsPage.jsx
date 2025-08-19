import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import apiClient from "../utils/apiClient";
import { API_HOST } from "../constants/config";
import { JobInfoCard } from "./HomePage";

const AppliedJobsPage = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppliedJobs = async () => {
    try {
      const res = await apiClient.get(`${API_HOST}/api/applications/applied`);
      setAppliedJobs(res.data);
    } catch (err) {
      console.error("Error fetching applied jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  if (loading) return <CircularProgress sx={{ m: 4 }} />;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Applied Jobs
      </Typography>
      {appliedJobs.length === 0 ? (
        <Typography>You haven't applied to any jobs yet.</Typography>
      ) : (
        appliedJobs.map(({ job, status }) => (
          <JobInfoCard key={job._id} job={job} status={status} />
        ))
      )}
    </Container>
  );
};

export default AppliedJobsPage;
