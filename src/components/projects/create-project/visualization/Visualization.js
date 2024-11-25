import React, { useState } from "react";
import { Box, Typography, Card, CardContent, IconButton, Tooltip } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import VisualDialog from "./VisualDialog";

const Visualization = ({ files, parsedData }) => {
  const [visualDialogOpen, setVisualDialogOpen] = useState(false);
  const [selectedFileData, setSelectedFileData] = useState(null);

  const openVisualPreview = (index) => () => {
    setSelectedFileData(parsedData[index]?.data || []);
    setVisualDialogOpen(true);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };

  return (
    <>
      <Typography variant="h5" sx={{ pb: 1 }}>
        View visuals
      </Typography>
      <Box sx={{ overflowY: "auto", height: 400 }}>
        {files.map((file, index) => (
          <Card key={`${file.name}-${index}`} sx={{ marginY: 2 }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
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
      />
    </>
  );
};

export default Visualization;
