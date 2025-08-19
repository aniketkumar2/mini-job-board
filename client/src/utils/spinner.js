import { CircularProgress, Box } from "@mui/material";

const Spinner = () => (
  <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
    <CircularProgress />
  </Box>
);

export default Spinner;
