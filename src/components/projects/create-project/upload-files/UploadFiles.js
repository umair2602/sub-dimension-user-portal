import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Delete, Visibility, CloudUpload } from "@mui/icons-material";
import InvalidFilesDialog from "./InvalidFilesDialog";
import PreviewDialog from "./PreviewDialog";

const UploadSection = styled(Paper)(({ theme, isDragging }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  background: isDragging
    ? `rgba(0, 115, 230, 0.5)`
    : `linear-gradient(135deg, #0073e6 0%, #004ba0 100%)`,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  color: theme.palette.common.white,
  cursor: "pointer",
  transition: "background 0.3s ease",
}));

const GradientButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontSize: "1rem",
  fontWeight: "bold",
  borderRadius: theme.shape.borderRadius * 2,
  background: `linear-gradient(45deg, #0073e6 30%, #004ba0 90%)`,
  color: theme.palette.common.white,
  boxShadow: theme.shadows[2],
  transition: "all 0.3s ease",
  "&:hover": {
    background: `linear-gradient(45deg, #005bb5 30%, #003d73 90%)`,
    color: theme.palette.common.white,
    boxShadow: theme.shadows[6],
  },
}));

const UploadFiles = ({ files, setFiles, parsedData, setParsedData }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [invalidFiles, setInvalidFiles] = useState([]);
  const [checkNotPassedFiles, setCheckNotPassedFiles] = useState([]);
  const [invalidFilesModalOpen, setInvalidFilesModalOpen] = useState(false);
  const [fileLoadingStates, setFileLoadingStates] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFileData, setSelectedFileData] = useState(null);
  const supportedFormats = ".csv, .txt (space or semicolon-separated), .npd";

  const isValidFileType = (file) => {
    const validTypes = [
      "text/csv",
      "text/plain",
      "application/vnd.ms-excel", // For some CSV files
      ".csv",
      ".txt",
      ".npd",
    ];
    return validTypes.some(
      (type) => file.type === type || file.name.toLowerCase().endsWith(type.toLowerCase())
    );
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const droppedFiles = Array.from(event.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    processFiles(uploadedFiles);
  };

  const processFiles = (uploadedFiles) => {
    const validFiles = [];
    const invalidFiles = [];
    const checkNotPassedFiles = [];

    // Create an array of promises for all FileReader operations
    const filePromises = uploadedFiles.map((file) => {
      return new Promise((resolve) => {
        if (isValidFileType(file)) {
          const reader = new FileReader();

          reader.onload = (e) => {
            const text = e.target.result;
            const validate = validateCSV(text);

            if (validate) {
              validFiles.push(file);
            } else {
              checkNotPassedFiles.push(file);
            }

            resolve(); // Resolve the promise once reading is done
          };

          reader.readAsText(file);
        } else {
          invalidFiles.push(file);
          resolve(); // Resolve the promise for invalid files
        }
      });
    });

    // Wait for all file reading operations to complete
    Promise.all(filePromises).then(() => {
      if (invalidFiles.length > 0 || checkNotPassedFiles.length > 0) {
        setInvalidFiles(invalidFiles);
        setCheckNotPassedFiles(checkNotPassedFiles);
        setInvalidFilesModalOpen(true);
      }

      if (validFiles.length > 0) {
        setFiles((prevFiles) => [...prevFiles, ...validFiles]);
        const newLoadingStates = {};
        validFiles.forEach((file) => {
          newLoadingStates[file.name] = true;
        });
        setFileLoadingStates((prev) => ({ ...prev, ...newLoadingStates }));
        validFiles.forEach((file) => readFileContent(file));
      }
    });
  };

  const readFileContent = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      try {
        const data = parseCSV(text);
        if (!data || data.length === 0) {
          setParsedData((prevData) => [
            ...prevData,
            { fileName: file.name, data: [], error: "No data found in file", status: "empty" },
          ]);
        } else {
          setParsedData((prevData) => [
            ...prevData,
            { fileName: file.name, data, status: "success" },
          ]);
        }
      } catch (error) {
        setParsedData((prevData) => [
          ...prevData,
          {
            fileName: file.name,
            data: [],
            error: "File appears to be corrupted or in wrong format",
            status: "error",
          },
        ]);
      }

      setFileLoadingStates((prev) => ({
        ...prev,
        [file.name]: false,
      }));
    };

    reader.onerror = () => {
      setParsedData((prevData) => [
        ...prevData,
        { fileName: file.name, data: [], error: "Failed to read file", status: "error" },
      ]);
      setFileLoadingStates((prev) => ({
        ...prev,
        [file.name]: false,
      }));
    };

    reader.readAsText(file);
  };

  const parseCSV = (text) => {
    const rows = text.split("\n").map((row) => row.split(",").map((cell) => cell.trim()));
    const headers = rows[0];

    // Create unique headers by appending a counter to duplicates
    const uniqueHeaders = headers.map((header, idx, self) => {
      let count = 0;
      return self.slice(0, idx).filter((h) => h === header).length > 0
        ? `${header} (${++count + self.slice(0, idx).filter((h) => h === header).length})`
        : header;
    });

    return rows.slice(1).map((row) =>
      row.reduce((acc, curr, idx) => {
        acc[uniqueHeaders[idx]] = curr;
        return acc;
      }, {})
    );
  };

  const validateCSV = (text) => {
    const rows = text
      .split("\n")
      .map((row) => row.trim().replace(/,+$/, "")) // Remove trailing commas
      .map((row) => row.split(",").map((cell) => cell.trim())) // Split into cells and trim
      .filter((row) => row.length > 1 || row.some((cell) => cell !== "")); // Skip empty rows

    if (rows.length === 0) {
      return false;
    }

    const headers = rows[0];

    let isValid = true;

    for (let i = 1; i < rows.length; i++) {
      if (rows[i].length !== headers.length) {
        isValid = false;
      }
    }

    return isValid;
  };

  const openFilePreview = (index) => () => {
    setDialogOpen(true);
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

  const handleFileRemove = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setParsedData(parsedData.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ width: "70%", margin: "auto" }}>
      <UploadSection
        elevation={3}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        isDragging={isDragging}
      >
        <Typography variant="h6" gutterBottom>
          {isDragging ? "Drop your files here!" : "Drag & Drop or Upload Your Files"}
        </Typography>
        <GradientButton component="label" startIcon={<CloudUpload />}>
          Upload Files
          <input
            type="file"
            multiple
            accept=".csv, .txt, .npd"
            hidden
            onChange={handleFileUpload}
          />
        </GradientButton>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Supported Formats: {supportedFormats}
        </Typography>
      </UploadSection>

      <Box sx={{ overflowY: "auto", height: 323, mt: 1 }}>
        {files.length === 0 && (
          <Box
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}
          >
            <Typography>No files to show</Typography>
          </Box>
        )}

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
                    <IconButton onClick={openFilePreview(index)}>
                      <Visibility color="blue" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileRemove(index);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <InvalidFilesDialog
        invalidFilesModalOpen={invalidFilesModalOpen}
        setInvalidFilesModalOpen={setInvalidFilesModalOpen}
        checkNotPassedFiles={checkNotPassedFiles}
        invalidFiles={invalidFiles}
      />

      <PreviewDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        selectedFileData={selectedFileData}
        setSelectedFileData={setSelectedFileData}
      />
    </Box>
  );
};

export default UploadFiles;
