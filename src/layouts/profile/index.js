import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Box, Typography, CardContent, Avatar } from "@mui/material";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
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

  return (
    <>
      <DashboardLayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "primary.main",
                    fontSize: "2rem",
                    mr: 2,
                  }}
                >
                  {userData.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {userData.name}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {userData.role}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Email:</strong> {userData.email}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Member Since:</strong> {userData.joinDate}
                </Typography>
                <Typography variant="body1">
                  <strong>Last Active:</strong> {userData.lastActive}
                </Typography>
              </Box>
            </CardContent>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Profile;
