import { Box, Button, Grid, Avatar, Typography, Tooltip } from "@mui/material";
import CreateProjectDialog from "components/projects/CreateProjectDialog";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Projects = () => {
  const projectData = useSelector((state) => state.projects);
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpen = () => setDialogOpen(true);
  const handleClose = () => setDialogOpen(false);

  return (
    <DashboardLayout>
      <Box
        sx={{
          height: "93vh",
          p: 3,
        }}
      >
        <Box sx={{ textAlign: "right" }}>
          <Button
            variant="contained"
            onClick={handleOpen}
            color="primary"
            sx={{ color: "white !important" }}
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
            {projectData.map((project, index) => (
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
                    onClick={() => navigate(`/projects/${project._id}`)}
                  >
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: "primary.main",
                        color: "white",
                      }}
                    >
                      {project.projectName[0]}
                    </Avatar>
                  </Box>
                  <Tooltip title={project.projectName}>
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
                      {project.projectName}
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
                  onClick={handleOpen}
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

        <CreateProjectDialog open={dialogOpen} onClose={handleClose} />
      </Box>
    </DashboardLayout>
  );
};

export default Projects;
