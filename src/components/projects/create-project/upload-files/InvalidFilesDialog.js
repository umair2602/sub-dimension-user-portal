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
    maxWidth: "500px",
    width: "100%",
  },
}));

const InvalidFilesDialog = ({
  invalidFilesModalOpen,
  checkNotPassedFiles,
  setInvalidFilesModalOpen,
  invalidFiles,
}) => {
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

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
            alignItems: "center",
            justifyContent: "center",
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
          <Typography variant="h6">Files Not Meeting Requirements</Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center", py: 2 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The following files do not meet the required criteria:
        </Typography>
        <Box
          sx={{
            bgcolor: "grey.100",
            p: 2,
            borderRadius: 1,
            maxHeight: "300px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box>
            {invalidFiles.map((file, index) => (
              <Typography key={index} variant="body2" color="error" sx={{ mb: 1 }}>
                {truncateText(file.name, 22)} ({file.type || "unknown type"}) - Unsupported File
                Type
              </Typography>
            ))}
            {/* Additional text for unsupported files */}
            {invalidFiles.length > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Unsupported files cannot be processed. Please upload files in the correct format.
              </Typography>
            )}
          </Box>

          <Box>
            {checkNotPassedFiles.map((file, index) => (
              <Typography key={index} variant="body2" color="error" sx={{ mb: 1 }}>
                {truncateText(file.name, 22)} ({file.type || "unknown type"}) - Failed Validation
              </Typography>
            ))}
            {/* Additional text for validation-failed files */}
            {checkNotPassedFiles.length > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Files that failed validation may contain incorrect or missing data. Please review
                and re-upload.
              </Typography>
            )}
          </Box>
        </Box>
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
          Close
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default InvalidFilesDialog;
