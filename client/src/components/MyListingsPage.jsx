import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Box,
} from "@mui/material";
import apiClient from "../utils/apiClient";
import { useUser } from "../context/UserContext";
import { API_HOST } from "../constants/config";
import JobFormModal, { initJobObj } from "./JobFormModal";
import { useAlertDialog } from "../context/AlertContext";
import { JobInfoCard } from "./HomePage";

const MyListingsPage = () => {
  const { user } = useUser();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobToUpdate, setJobToUpdate] = useState(null);
  const { showAlert } = useAlertDialog();

  const fetchMyListings = async () => {
    try {
      const res = await apiClient.get(`${API_HOST}/api/jobs/my-listings`);
      if (res?.data?.status) {
        setListings(res?.data?.data);
      }
    } catch (err) {
      console.error("Error fetching listings", err);
    } finally {
      setLoading(false);
    }
  };

  function handleDelete(job) {
    showAlert({
      type: "warning",
      title: "Delete Listing!",
      message: `Are you sure to delete, ${job?.title}`,
      buttons: [
        {
          label: "Cancel",
          onClick: () => console.log("Cancelled"),
          variant: "outlined",
        },
        {
          label: "Delete",
          onClick: () => onConfirmDeleteJob(job._id),
          variant: "contained",
        },
      ],
    });
  }

  const onConfirmDeleteJob = async (id) => {
    try {
      let res = await apiClient.delete(`${API_HOST}/api/jobs/${id}`);
      if (res?.data?.status) {
        setListings(listings.filter((job) => job._id !== id));
      }
    } catch (err) {
      console.error("Error deleting job", err);
    }
  };

  useEffect(() => {
    if (user?.user_type === "admin") {
      fetchMyListings();
    }
  }, [user]);

  if (loading) return <CircularProgress sx={{ m: 4 }} />;

  return (
    <Container sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
      >
        <Typography variant="h4" gutterBottom>
          My Job Listings
        </Typography>
        {user?.user_type === "admin" && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setJobToUpdate(initJobObj)}
            sx={{ mb: 3 }}
          >
            Create New Job
          </Button>
        )}
      </Box>
      {jobToUpdate && (
        <JobFormModal
          open={jobToUpdate}
          onClose={() => setJobToUpdate(null)}
          job={jobToUpdate} // pass a job object here for edit mode
          onRefresh={fetchMyListings}
        />
      )}

      {listings.length === 0 ? (
        <Typography>No listings yet.</Typography>
      ) : (
        listings.map((job) => (
          <JobInfoCard key={job._id}>
            <CardActions>
              <Button size="small" onClick={() => setJobToUpdate(job)}>
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => handleDelete(job)}
              >
                Delete
              </Button>
            </CardActions>
          </JobInfoCard>
        ))
      )}
    </Container>
  );
};

export default MyListingsPage;
