import {
  Box,
  CardContent,
  Grid,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  Card,
  Collapse,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { apiRequest } from "services/apiRequest";
import urlService from "services/urlService";
import { ExpandMore, Visibility, QueryStats, Summarize } from "@mui/icons-material";

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
  else return (bytes / 1048576).toFixed(2) + " MB";
};

const ViewProject = () => {
  const { id } = useParams();

  const { projects } = useSelector((state) => state.projects);
  const [project, setProject] = useState({});
  const [expandedUploadedFiles, setExpandedUploadedFiles] = useState({});

  const fetchProjectDetail = useCallback(async () => {
    const storedToken = localStorage.getItem("token");
    const decodedToken = jwtDecode(storedToken);

    try {
      const response = await apiRequest.get(`${urlService.projects}/${id}`, {
        user_name: decodedToken.sub,
      });

      setProject(response);
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  }, [id]);

  useEffect(() => {
    if (projects.length) {
      setProject(projects.find((project) => project.id == id));
    } else {
      fetchProjectDetail();
    }
  }, [id, projects, fetchProjectDetail]);

  const inputFields = [
    {
      label: "Project Name",
      name: "project_name",
      value: project?.project_name,
      placeholder: "Enter project name",
      multiline: false,
      rows: "1",
      required: true,
    },
    {
      label: "Company Name",
      name: "company_name",
      value: project?.company_name,
      placeholder: "Enter company name",
      multiline: false,
      rows: "1",
      required: false,
    },
    {
      label: "Client",
      name: "client",
      value: project?.client,
      placeholder: "Enter client name",
      multiline: true,
      rows: "1",
      required: false,
    },
    {
      label: "Vessel",
      name: "vessel",
      value: project?.vessel,
      placeholder: "Enter vessel name",
      multiline: false,
      rows: "1",
      required: false,
    },
    {
      label: "Details",
      name: "details",
      value: project?.details,
      placeholder: "Enter additional details",
      multiline: true,
      rows: "2",
      required: false,
    },
  ];

  const handleUploadedFileExpand = (fileUrl) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    setExpandedUploadedFiles((prev) => ({
      ...prev,
      [fileUrl]: !prev[fileUrl],
    }));
  };

  return (
    <DashboardLayout>
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box>
          <Typography variant="h4" color="initial" paddingBottom={1}>
            Project info
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            {inputFields.map((field) => (
              <Box key={field.name}>
                <Typography variant="subtitle2" sx={{ pb: 0.5, fontWeight: 500 }}>
                  {field.label}
                </Typography>

                <TextField
                  label=""
                  name={field.name}
                  value={field.value || ""}
                  placeholder={"No data available"}
                  multiline={field.multiline}
                  rows={field.rows}
                  required={field.required}
                  fullWidth
                  inputProps={{ readOnly: true }}
                  sx={{
                    minWidth: "280px",
                    backgroundColor: "white !important",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
        <Box>
          <Typography variant="h4" color="initial" paddingBottom={1}>
            Files
          </Typography>
          <Grid container spacing={2}>
            {project?.files?.map((file) => (
              <Grid item xs={12} key={file?.file_url}>
                <Card>
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Box
                      onClick={handleUploadedFileExpand(file?.file_url)}
                      sx={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          transform: expandedUploadedFiles[file?.file_url]
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "none !important",
                        }}
                      >
                        <ExpandMore />
                      </Box>

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                          {file?.file_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Uploaded on: {new Date(file?.upload_date).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Preview file">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              // handleUploadedFilePreview(file);
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Visualize file">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              // handleUploadedFilePreview(file);
                            }}
                          >
                            <QueryStats />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Generate report">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              // handleUploadedFilePreview(file);
                            }}
                          >
                            <Summarize />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Collapse in={expandedUploadedFiles[file?.file_url]} timeout={0}>
                      <Box
                        sx={{
                          mt: 2,
                          pt: 2,
                          borderTop: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                              File URL: {file?.file_url}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                              File Size: {formatFileSize(file?.file_size)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default ViewProject;
