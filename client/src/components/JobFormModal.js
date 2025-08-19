import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Modal,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { postNewJob, updateJob } from "../functions/jobs_ops";

export const initJobObj = {
  title: "",
  company: "",
  type: "",
  location: "",
  description: "",
};
export default function JobFormModal({ open, onClose, job, onRefresh }) {
  const [form, setForm] = useState(initJobObj);

  const isEditMode = job?._id;
  useEffect(() => {
    if (job) {
      setForm(job);
    }
  }, [job]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;

    if (isEditMode) {
      res = await updateJob({ ...form, job_id: job._id });
      if (res?.status) {
        onRefresh();
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } else {
      res = await postNewJob(form);
      if (res?.status) {
        onRefresh();
      } else {
        toast.error(res.message || "Something went wrong");
      }
    }

    if (res.status) {
      toast.success(
        res.message || `Job ${isEditMode ? "updated" : "posted"} successfully!`
      );
      onClose(true); // pass true to trigger parent refresh
    } else {
      toast.error(res.message || "Something went wrong");
    }
  };

  return (
    <Modal open={open} onClose={() => onClose(false)}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          p: 2,
        }}
      >
        <Paper
          sx={{
            p: 3,
            width: "100%",
            maxWidth: 600,
            position: "relative",
          }}
        >
          <HighlightOffIcon
            onClick={() => onClose(false)}
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "40px",
              cursor: "pointer",
              color: "gray",
            }}
          />
          <Typography variant="h6" mb={2}>
            {isEditMode ? "Edit Job" : "Add New Job"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Job Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              label="Company Name"
              name="company"
              value={form.company}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              label="Job Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
              variant="outlined"
              required
            >
              <MenuItem value="Full-time">Full-time</MenuItem>
              <MenuItem value="Part-time">Part-time</MenuItem>
              <MenuItem value="Internship">Internship</MenuItem>
            </TextField>
            <TextField
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              variant="outlined"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              fullWidth
            >
              {isEditMode ? "Update Job" : "Submit Job"}
            </Button>
          </form>
        </Paper>
      </Box>
    </Modal>
  );
}
