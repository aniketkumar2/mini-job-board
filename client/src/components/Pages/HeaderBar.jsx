import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useUser } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

const HeaderBar = () => {
  const { user, logout } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleMobileMenuOpen = (event) =>
    setMobileMenuAnchor(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMenuAnchor(null);

  const handleNavigate = (path, closeMenuFn) => {
    closeMenuFn();
    navigate(path);
  };

  const displayName = user?.name || user?.email || "";

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Mobile Menu Button */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={handleMobileMenuOpen}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            textAlign: { xs: "center", md: "left" },
            fontWeight: "bold",
          }}
        >
          Mini Job Board
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          {user && user.user_type === "user" && (
            <Button color="inherit" component={Link} to="/applied-jobs">
              Applied Jobs
            </Button>
          )}
          {user?.user_type === "admin" && (
            <>
              <Button color="inherit" component={Link} to="/add-job">
                Add Job
              </Button>
              <Button color="inherit" component={Link} to="/my-listings">
                My Listings
              </Button>
            </>
          )}
        </Box>

        {/* User Info / Login */}
        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Display welcome message first */}
            {displayName && (
              <Typography variant="subtitle2" sx={{ ml: 1 }}>
                Welcome, {displayName}
              </Typography>
            )}
            {/* Account Icon */}
            <IconButton size="large" color="inherit" onClick={handleMenuOpen}>
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() =>
                  handleNavigate("/privacy-policy", handleMenuClose)
                }
              >
                Privacy & Policy
              </MenuItem>
              <MenuItem
                onClick={() =>
                  handleNavigate("/delete-account", handleMenuClose)
                }
              >
                Delete Account
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  logout();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>

      {/* Mobile Navigation Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
      >
        {user && displayName && (
          <Box px={2} py={1}>
            <Typography variant="subtitle2">Welcome, {displayName}</Typography>
          </Box>
        )}
        <Divider />
        <MenuItem component={Link} to="/" onClick={handleMobileMenuClose}>
          Home
        </MenuItem>
        {user && user.user_type === "user" && (
          <MenuItem
            component={Link}
            to="/applied-jobs"
            onClick={handleMobileMenuClose}
          >
            Applied Jobs
          </MenuItem>
        )}
        {user?.user_type === "admin" && (
          <>
            <MenuItem
              component={Link}
              to="/add-job"
              onClick={handleMobileMenuClose}
            >
              Add Job
            </MenuItem>
            <MenuItem
              component={Link}
              to="/my-listings"
              onClick={handleMobileMenuClose}
            >
              My Listings
            </MenuItem>
          </>
        )}
      </Menu>
    </AppBar>
  );
};

export default HeaderBar;
