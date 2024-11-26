import React, { useState } from "react";
import { Box, Typography, Card, CardContent, IconButton, Tooltip } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import VisualDialog from "./VisualDialog";

const Visualization = ({ files, parsedData }) => {
  const [visualDialogOpen, setVisualDialogOpen] = useState(false);
  const [selectedFileData, setSelectedFileData] = useState(null);

  const openVisualPreview = (index) => () => {
    setVisualDialogOpen(true);
    setSelectedFileData([]);
    setTimeout(() => {
      setSelectedFileData(parsedData[index]?.data || []);
    }, 0);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };

  return (
    <Box sx={{ width: "70%", margin: "auto" }}>
      <Typography variant="h5" sx={{ pb: 1, display: "flex", justifyContent: "center" }}>
        View visuals
      </Typography>
      <Box sx={{ overflowY: "auto", height: 480 }}>
        {files.map((file, index) => (
          <Card key={`${file.name}-${index}`} sx={{ marginY: 2 }}>
            <CardContent sx={{ p: 1, paddingLeft: 2, "&:last-child": { pb: 1 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "500" }}>
                    {file.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Format: {file.type || "N/A"} | Size: {formatFileSize(file.size)}
                  </Typography>
                </Box>
                <Box>
                  <Tooltip title="Preview">
                    <IconButton onClick={openVisualPreview(index)}>
                      <Visibility color="blue" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      <VisualDialog
        visualDialogOpen={visualDialogOpen}
        setVisualDialogOpen={setVisualDialogOpen}
        selectedFileData={selectedFileData}
        setSelectedFileData={setSelectedFileData}
      />
    </Box>
  );
};

export default Visualization;
