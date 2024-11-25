import React from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Grid,
} from "@mui/material";
import ScatterChart from "components/projects/common/visual-charts/ScatterChart";
import LineChart from "components/projects/common/visual-charts/ProgressiveLineChart";

const VisualDialog = ({ visualDialogOpen, setVisualDialogOpen, selectedFileData }) => {
  return (
    <Dialog
      open={visualDialogOpen}
      onClose={() => setVisualDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Visual Preview</DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            maxHeight: "500px",
            overflowY: "auto",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            bgcolor: "background.paper",
          }}
        >
          {selectedFileData && selectedFileData.length ? (
            <Grid container spacing={3} paddingTop={2}>
              <Grid item xs={12} md={6}>
                <ScatterChart data={selectedFileData} />
              </Grid>
              <Grid item xs={12} md={6}>
                <LineChart data={selectedFileData} />
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No visuals available to display.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setVisualDialogOpen(false)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VisualDialog;
