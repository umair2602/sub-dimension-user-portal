import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { Box, Button, Grid, Avatar, Typography, Tooltip } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { apiRequest } from "services/apiRequest";
import urlService from "services/urlService";
import { addExistingProjects } from "features/projects/projectsSlice";

const Projects = () => {
  const dispatch = useDispatch();
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

  const { projects } = useSelector((state) => state.projects);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    if (projects.length) {
      return;
    }
    const storedToken = localStorage.getItem("token");
    const decodedToken = jwtDecode(storedToken);

    try {
      const response = await apiRequest.get(urlService.projects, { user_name: decodedToken.sub });

      dispatch(addExistingProjects(response));
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchProjects();

    return () => {};
  }, []);

  return (
    <DashboardLayout>
      <Box sx={{ position: "absolute", right: 15, top: 15 }}>
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

      <Box
        sx={{
          height: "93vh",
          p: 3,
        }}
      >
        <Box sx={{ textAlign: "right" }}>
          <Button
            variant="contained"
            onClick={() => navigate(`/projects/create-project`)}
            color="primary"
            sx={{ color: "white !important", marginRight: 5 }}
          >
            New Project
          </Button>
        </Box>

        <Box>
          <Typography variant="h3" sx={{ marginY: 2, textAlign: "center" }}>
            Explore Your Projects
          </Typography>
          <Typography variant="h6" sx={{ marginY: 2, textAlign: "center" }}>
            How would you like to start?
          </Typography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{ maxHeight: "65vh", overflowY: "auto", marginTop: 2 }}
          >
            {/* Map existing projects */}
            {projects.map((project, index) => (
              <Grid item key={index}>
                <Box
                  sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}
                >
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      border: "2px solid #c5c9c9",
                      borderRadius: "10px",
                    }}
                    onClick={() => navigate(`/projects/${project?.id}`)}
                  >
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: "secondary.main",
                        color: "white",
                      }}
                    >
                      {project?.project_name[0]}
                    </Avatar>
                  </Box>
                  <Tooltip title={project?.project_name}>
                    <Typography
                      variant="body1"
                      fontSize={14}
                      sx={{
                        textAlign: "center",
                        width: 120,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {project?.project_name}
                    </Typography>
                  </Tooltip>
                </Box>
              </Grid>
            ))}
            {/* "Blank project" Box */}
            <Grid item>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border: "2px dashed gray",
                    borderRadius: "10px",
                  }}
                  onClick={() => navigate(`/projects/create-project`)}
                >
                  <Typography variant="h3" sx={{ color: "gray" }}>
                    +
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  fontSize={14}
                  sx={{
                    textAlign: "center",
                    width: 120,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Blank project
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default Projects;
