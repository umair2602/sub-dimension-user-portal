import React, { useEffect, useState } from "react";
import {
  Typography,
  Dialog,
  DialogTitle,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import ScatterChart from "components/projects/common/visual-charts/ScatterChart";
import LineChart from "components/projects/common/visual-charts/ProgressiveLineChart";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "components/Loader/Loader";

const tabsList = [{ label: "GPS1 vs GPS2" }, { label: "Gyro 1 vs Gyro 2" }];

const VisualDialog = ({
  visualDialogOpen,
  setVisualDialogOpen,
  selectedFileData,
  setSelectedFileData,
}) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (visualDialogOpen) {
      setProgress(0);
      setLoading(true);
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            setLoading(false);
            return 100;
          }
          return prevProgress + 25;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [visualDialogOpen]);

  const onDialogClose = () => {
    setSelectedFileData([]);
    setVisualDialogOpen(false);
    setTabIndex(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Dialog open={visualDialogOpen} onClose={onDialogClose} maxWidth="xl" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>Visual Preview</Box>
        <Box>
          <IconButton onClick={onDialogClose} sx={{ padding: 0 }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Box
        sx={{
          height: "80vh",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.paper",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress variant="determinate" value={progress} sx={{ color: "#007aff" }} />
            {/* Percentage text */}
            <Typography variant="h6" color="textSecondary">
              {progress}% Loaded
            </Typography>
          </Box>
        ) : selectedFileData && selectedFileData.length ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: "divider" }}
              TabIndicatorProps={{
                style: { backgroundColor: "#007aff" },
              }}
              centered
            >
              {tabsList.map((tab) => (
                <Tab
                  key={tab.label}
                  label={tab.label}
                  sx={{
                    "&.Mui-selected": {
                      color: "#007aff",
                    },
                  }}
                />
              ))}
            </Tabs>
            {/* Conditionaly render based on active tab */}
            {/* <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 2,
                maxHeight: 500,
              }}
            >
              {tabIndex === 0 && <ScatterChart data={selectedFileData} />}
              {tabIndex === 1 && <LineChart data={selectedFileData} />}
            </Box> */}

            {/* Display or hide based on active tab */}
            <Box
              sx={{
                display: tabIndex === 0 ? "flex" : "none",
                justifyContent: "center",
                alignItems: "center",
                padding: 2,
                maxHeight: 500,
              }}
            >
              <ScatterChart data={selectedFileData} />
            </Box>
            <Box
              sx={{
                display: tabIndex === 1 ? "flex" : "none",
                justifyContent: "center",
                alignItems: "center",
                padding: 2,
                maxHeight: 500,
              }}
            >
              <LineChart data={selectedFileData} />
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Loader />
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default VisualDialog;
