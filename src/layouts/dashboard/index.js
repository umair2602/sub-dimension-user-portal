import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Box, Typography, Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function Dashboard() {
  const storedToken = localStorage.getItem("token");
  const decodedToken = storedToken ? jwtDecode(storedToken) : null;

  // Mock user data - replace with actual user data from your backend
  const userData = {
    name: decodedToken?.sub || "User",
    email: decodedToken?.email || "user@example.com",
    role: "Member",
    joinDate: "January 2024",
    lastActive: "Today",
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <DashboardLayout>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <IconButton
          size="small"
          onMouseEnter={handleMouseEnter}
          aria-controls={open ? "hover-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            sx={{
              width: 50,
              height: 50,
              bgcolor: "primary.main",
              fontSize: "2rem",
            }}
          >
            {userData.name.charAt(0)}
          </Avatar>
        </IconButton>
        <Menu
          id="hover-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMouseLeave}
          MenuListProps={{
            onMouseLeave: handleMouseLeave,
          }}
        >
          <NavLink to={"/profile"}>
            <MenuItem>Profile</MenuItem>
          </NavLink>
        </Menu>
      </Box>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {userData.name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 4 }}>
          Here's your profile overview
        </Typography>
      </Box>
    </DashboardLayout>
  );
}

export default Dashboard;
