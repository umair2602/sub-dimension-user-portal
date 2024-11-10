import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Box, Typography, Button, IconButton, Paper, Divider, Grid, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState, useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  transition: "transform 0.3s ease",
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  display: 'flex',
  flexDirection: 'column',
}));

const UploadSection = styled(Paper)(({ theme, isDragging }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  background: isDragging ? `rgba(0, 115, 230, 0.5)` : `linear-gradient(135deg, #0073e6 0%, #004ba0 100%)`,
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

function Dashboard() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false); // State for modal
  const supportedFormats = ".csv, .txt (space or semicolon-separated)";
  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
    uploadedFiles.forEach(file => readFileContent(file));
  };

  const readFileContent = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const data = parseCSV(text);
      setParsedData((prevData) => [...prevData, { fileName: file.name, data }]);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text) => {
    const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim()));
    const headers = rows[0];
    return rows.slice(1).map(row => {
      return row.reduce((acc, curr, idx) => {
        acc[headers[idx]] = curr;
        return acc;
      }, {});
    });
  };

  const handleFileRemove = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setParsedData(parsedData.filter((_, i) => i !== index));
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
    const uploadedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
    uploadedFiles.forEach(file => readFileContent(file));
    setIsDragging(false);
  };

  const handleSubmitFiles = async () => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    const decodedToken = jwtDecode(storedToken);
    try {
      const response = await axios.post('https://swkddnwcmm.us-east-1.awsapprunner.com/users/uploadfiles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          user_name: decodedToken.sub
        }
      });
      console.log(response.data);
      setUploadMessage("Files uploaded successfully!");
      setSuccessModalOpen(true); // Open modal on success
      setFiles([]);
      setParsedData([]);
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadMessage("File upload failed! Please try again.");
    }
  };

  const handleCloseModal = () => {
    setSuccessModalOpen(false);
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Your Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 2 }}>
          Easily upload and view your datasets for analysis.
        </Typography>

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
          <GradientButton
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Upload Files
            <input
              type="file"
              multiple
              accept=".csv, .txt"
              hidden
              onChange={handleFileUpload}
            />
          </GradientButton>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Supported Formats: {supportedFormats}
          </Typography>
        </UploadSection>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>Uploaded Files</Typography>
          <Divider sx={{ mb: 2 }} />
          {files.map((file, index) => (
            <StyledCard key={index}>
              <CardContent>
                <Grid container alignItems="center">
                  <Grid item xs={10}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "left" }}>{file.name}</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: "left" }}>
                      Format: {file.type || "N/A"} | Size: {(file.size / 1024).toFixed(2)} KB
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: "right" }}>
                    <IconButton onClick={() => handleFileRemove(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>

                {/* Data Table */}
                <Box sx={{ mt: 2, maxHeight: '400px', overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f0f0f0' }}>
                        {parsedData[index]?.data.length > 0 && Object.keys(parsedData[index].data[0]).map((header, headerIndex) => (
                          <th key={headerIndex} style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData[index]?.data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {Object.values(row).map((cell, cellIndex) => (
                            <td key={cellIndex} style={{ padding: '8px', border: '1px solid #ddd' }}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </CardContent>
            </StyledCard>
          ))}
        </Box>

        {files.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Number of uploaded files: {files.length}
            </Typography>
            <GradientButton onClick={handleSubmitFiles}>
              Submit Files
            </GradientButton>
          </Box>
        )}

        {/* Success Modal */}
        <Dialog open={successModalOpen} onClose={handleCloseModal}>
          <DialogTitle>Success</DialogTitle>
          <DialogContent>
            <Typography>{uploadMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}

export default Dashboard;
