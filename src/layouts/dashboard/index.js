import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Box, Typography, Button, IconButton, Paper, Divider, Grid, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState, useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  transition: "transform 0.3s ease",
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  }
}));

const UploadSection = styled(Paper)(({ theme, isDragging }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  background: isDragging ? 
    `rgba(0, 115, 230, 0.5)` : 
    `linear-gradient(135deg, #0073e6 0%, #004ba0 100%)`,
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

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    maxWidth: '400px',
    width: '100%',
  },
}));

const GlobalStyles = styled('div')({
  '@keyframes bounce': {
    '0%': {
      transform: 'scale(0)',
    },
    '50%': {
      transform: 'scale(1.2)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
});

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
  else return (bytes / 1048576).toFixed(2) + ' MB';
};

function Dashboard() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false); // State for modal
  const supportedFormats = ".csv, .txt (space or semicolon-separated)";
  const storedToken = localStorage.getItem("token");
  const [isUploading, setIsUploading] = useState(false);
  const [filesSubmitted, setFilesSubmitted] = useState(false);
  const [fileLoadingStates, setFileLoadingStates] = useState({});
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (files.length > 0 && !filesSubmitted) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [files, filesSubmitted]);

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
    
    const newLoadingStates = {};
    uploadedFiles.forEach(file => {
      newLoadingStates[file.name] = true;
    });
    setFileLoadingStates(prev => ({ ...prev, ...newLoadingStates }));
    
    uploadedFiles.forEach(file => readFileContent(file));
    setFilesSubmitted(false);
  };

  const readFileContent = (file) => {
    setIsParsingFile(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target.result;
      const data = parseCSV(text);
      setParsedData((prevData) => [...prevData, { fileName: file.name, data }]);
      
      setFileLoadingStates(prev => ({
        ...prev,
        [file.name]: false
      }));
      setIsParsingFile(false);
    };

    reader.onerror = () => {
      setFileLoadingStates(prev => ({
        ...prev,
        [file.name]: false
      }));
      setIsParsingFile(false);
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
    setFilesSubmitted(false);
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
    setIsUploading(true);
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
      setUploadedFilesCount(files.length);
      setUploadMessage("Files uploaded successfully!");
      setSuccessModalOpen(true);
      setFilesSubmitted(true);
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadMessage("File upload failed! Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseModal = () => {
    setSuccessModalOpen(false);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Delete' && document.activeElement.closest('.file-card')) {
        const index = parseInt(document.activeElement.closest('.file-card').dataset.index);
        handleFileRemove(index);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <DashboardLayout>
      <GlobalStyles />
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
            <StyledCard key={index} sx={{ position: 'relative' }}>
              {(isUploading || fileLoadingStates[file.name]) && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    zIndex: 1,
                  }}
                >
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                    {isUploading ? 'Uploading...' : 'Parsing file...'}
                  </Typography>
                </Box>
              )}
              <CardContent>
                <Grid container alignItems="center">
                  <Grid item xs={10}>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: "bold", 
                      textAlign: "left",
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      {file.name}
                      {filesSubmitted && (
                        <CheckCircleOutlineIcon 
                          sx={{ 
                            color: 'success.main',
                            fontSize: 20 
                          }} 
                        />
                      )}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: "left" }}>
                      Format: {file.type || "N/A"} | Size: {formatFileSize(file.size)}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: "right" }}>
                    <IconButton 
                      onClick={() => handleFileRemove(index)} 
                      color="error"
                      sx={{
                        '&:hover': {
                          transform: 'scale(1.1)',
                          backgroundColor: 'error.light',
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>

                {/* Data Table with Loading State */}
                <Box sx={{ mt: 2, maxHeight: '400px', overflowY: 'auto' }}>
                  {fileLoadingStates[file.name] ? (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      height: '200px',
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      borderRadius: 1
                    }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <CircularProgress size={30} />
                        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                          Preparing preview...
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
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
                  )}
                </Box>
              </CardContent>
            </StyledCard>
          ))}
        </Box>

        {isParsingFile && files.length > 0 && (
          <Box sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24, 
            zIndex: 2000,
            backgroundColor: 'background.paper',
            padding: 2,
            borderRadius: 2,
            boxShadow: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <CircularProgress size={24} />
            <Typography variant="body2">Processing files...</Typography>
          </Box>
        )}

        {files.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Number of uploaded files: {files.length}
            </Typography>
            <GradientButton 
              onClick={handleSubmitFiles}
              disabled={isUploading || filesSubmitted}
              startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isUploading ? 'Uploading...' : filesSubmitted ? 'Files Processed' : 'Submit Files'}
            </GradientButton>
          </Box>
        )}

        {files.some(file => file.size > 5 * 1024 * 1024) && (
          <Typography 
            variant="body2" 
            color="warning.main" 
            sx={{ 
              mt: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <WarningIcon fontSize="small" />
            Some files are large and may take longer to process
          </Typography>
        )}

        {/* Success Modal */}
        <StyledDialog 
          open={successModalOpen} 
          onClose={handleCloseModal}
          TransitionProps={{
            timeout: 500
          }}
        >
          <DialogTitle sx={{ 
            textAlign: 'center', 
            pb: 1,
            pt: 3
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 2 
            }}>
              {uploadMessage.includes('success') ? (
                <CheckCircleOutlineIcon 
                  sx={{ 
                    fontSize: 60, 
                    color: 'success.main',
                    animation: 'bounce 0.5s ease'
                  }} 
                />
              ) : (
                <ErrorOutlineIcon 
                  sx={{ 
                    fontSize: 60, 
                    color: 'error.main',
                    animation: 'bounce 0.5s ease'
                  }} 
                />
              )}
              <Typography variant="h6" component="div">
                {uploadMessage.includes('success') ? 'Success!' : 'Error'}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" color="text.secondary">
              {uploadMessage}
            </Typography>
            {uploadMessage.includes('success') && (
              <>
                <Box sx={{ 
                  mt: 3, 
                  p: 2, 
                  bgcolor: 'rgba(0, 115, 230, 0.08)', 
                  borderRadius: 2,
                  animation: 'fadeIn 0.5s ease'
                }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {uploadedFilesCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {uploadedFilesCount === 1 ? 'File' : 'Files'} Successfully Processed
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  mt: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}>
                  <InfoIcon sx={{ fontSize: 16 }} />
                  Your files are now ready for analysis
                </Typography>
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ 
            justifyContent: 'center',
            pb: 3 
          }}>
            <GradientButton 
              onClick={handleCloseModal}
              sx={{ 
                minWidth: '120px',
                animation: 'fadeIn 0.5s ease'
              }}
            >
              {uploadMessage.includes('success') ? 'Continue' : 'Try Again'}
            </GradientButton>
          </DialogActions>
        </StyledDialog>
      </Box>
    </DashboardLayout>
  );
}

export default Dashboard;
