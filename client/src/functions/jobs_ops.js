import axios from "axios";
import { API_HOST } from "../constants/config";

// Fetch all locations
export const fetchAllLocations = async () => {
  try {
    const res = await axios.get(`${API_HOST}/api/locations`);
    return res.data; // { status, message, data }
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || "Failed to fetch locations",
    };
  }
};

// Fetch all jobs
export const fetchAllJobs = async () => {
  try {
    const res = await axios.get(`${API_HOST}/api/jobs`);
    return res.data; // { status, message, data }
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || "Failed to fetch jobs",
    };
  }
};

// Fetch job by ID
export const fetchJobById = async (id) => {
  try {
    const res = await axios.get(`${API_HOST}/api/jobs/${id}`);
    return res.data; // { status, message, data }
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || "Failed to fetch job details",
    };
  }
};

// Post new job
export const postNewJob = async (jobData) => {
  try {
    const res = await axios.post(`${API_HOST}/api/jobs`, jobData);
    return res.data; // { status, message, data }
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || "Failed to submit job",
    };
  }
};

// Put new job
export const updateJob = async (jobData) => {
  try {
    const res = await axios.put(`${API_HOST}/api/jobs`, jobData);
    return res.data; // { status, message, data }
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message || "Failed to update job",
    };
  }
};
