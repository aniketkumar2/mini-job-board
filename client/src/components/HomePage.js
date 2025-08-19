import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Alert,
  Button,
  InputAdornment,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Select from "react-select";
import debounce from "lodash.debounce";

import { fetchAllJobs, fetchAllLocations } from "../functions/jobs_ops";
import Spinner from "../utils/spinner";
import { useUser } from "../context/UserContext";
import JobFormModal, { initJobObj } from "./JobFormModal";
import moment from "moment";

export function JobInfoCard({ job, children, status }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
      style={{ marginTop: 20 }}
    >
      <Link to={`/job/${job._id}`} style={{ textDecoration: "none" }}>
        <Card sx={{ height: "100%", cursor: "pointer" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {job?.title}
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
            <Typography variant="body2">
              {job?.location} &bull; {job?.type}
            </Typography>
            {status && (
              <Box mt={1}>
                <Chip label={status} color="primary" />
              </Box>
            )}
          </CardContent>
        </Card>
      </Link>
      {children}
    </motion.div>
  );
}
const HomePage = () => {
  const { user } = useUser();

  const [modalOpen, setModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const jobRes = await fetchAllJobs();
    const locRes = await fetchAllLocations();
    if (jobRes?.status) {
      setJobs(jobRes.data);
      setFilteredJobs(jobRes.data);
    }
    if (locRes?.status) {
      const options = locRes.data.map((loc) => ({
        label: loc.name,
        value: loc.name,
      }));
      setCityOptions(options);
    }

    setLoading(false);
  };

  // Fetch jobs and cities
  useEffect(() => {
    loadData();
  }, [user]);

  // Debounced title filter
  const debouncedFilter = useMemo(
    () =>
      debounce((title, city) => {
        let result = jobs;

        if (title) {
          result = result.filter((job) =>
            job.title.toLowerCase().includes(title.toLowerCase())
          );
        }

        if (city) {
          result = result.filter((job) =>
            job.location.toLowerCase().includes(city.value.toLowerCase())
          );
        }

        setFilteredJobs(result);
      }, 300),
    [jobs]
  );

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setSearchTitle(value);
    debouncedFilter(value, selectedCity);
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    debouncedFilter(searchTitle, city);
  };

  return (
    <Box p={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
      >
        <Typography variant="h4">Job Listings</Typography>
        {modalOpen && (
          <JobFormModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            job={initJobObj}
            onRefresh={loadData}
          />
        )}

        {user?.user_type === "admin" && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModalOpen(true)}
          >
            + Add Job
          </Button>
        )}
      </Box>
      <Box display="flex" gap={2} mb={3} flexWrap="wrap" alignItems="center">
        <TextField
          label="Search by Title"
          variant="outlined"
          value={searchTitle}
          onChange={handleTitleChange}
          fullWidth
          sx={{ minWidth: { xs: "100%", sm: "300px" }, maxWidth: "300px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box
          sx={{ width: { xs: "100%", sm: "200px" } }} // xs: full, sm+: fixed
        >
          <Select
            placeholder="Filter by City"
            options={cityOptions}
            value={selectedCity}
            onChange={handleCityChange}
            isClearable
          />
        </Box>
      </Box>

      {loading ? (
        <Spinner />
      ) : filteredJobs.length === 0 ? (
        <Alert severity="info">No jobs found matching your criteria.</Alert>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          gap={2}
        >
          {filteredJobs.map((job) => (
            <JobInfoCard
              key={job._id}
              job={job}
              status={
                job?.is_applied ? "Applied" : job?.is_admin ? "Posted" : null
              }
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
