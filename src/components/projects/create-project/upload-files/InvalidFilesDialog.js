import React from "react";
import styled from "@emotion/styled";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    maxWidth: "400px",
    width: "100%",
  },
}));

const InvalidFilesDialog = ({ invalidFilesModalOpen, setInvalidFilesModalOpen, invalidFiles }) => {
  return (
    <StyledDialog
      open={invalidFilesModalOpen}
      onClose={() => setInvalidFilesModalOpen(false)}
      TransitionProps={{ timeout: 500 }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          pb: 1,
          pt: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <WarningIcon
            sx={{
              fontSize: 60,
              color: "warning.main",
              animation: "bounce 0.5s ease",
            }}
          />
          <Typography variant="h6">Unsupported File Types</Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center", py: 2 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The following files are not supported:
        </Typography>
        <Box
          sx={{
            bgcolor: "grey.100",
            p: 2,
            borderRadius: 1,
            maxHeight: "150px",
            overflowY: "auto",
          }}
        >
          {invalidFiles.map((file, index) => (
            <Typography key={index} variant="body2" color="error" sx={{ mb: 1 }}>
              {file.name} ({file.type || "unknown type"})
            </Typography>
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Only .csv, .txt and .npd files are supported.
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 2,
          pb: 3,
        }}
      >
        <Button
          variant="outlined"
          onClick={() => setInvalidFilesModalOpen(false)}
          sx={{
            minWidth: "120px",
            borderRadius: 2,
            color: "error.main",
            borderColor: "error.main",
            "&:hover": {
              borderColor: "error.dark",
              backgroundColor: "error.light",
            },
            transition: "all 0.2s ease",
          }}
        >
          OK
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default InvalidFilesDialog;
