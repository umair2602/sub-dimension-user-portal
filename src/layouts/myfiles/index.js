import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Box, Typography, Button, IconButton, Paper, Divider, Grid, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, Fade } from "@mui/material";
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Collapse from '@mui/material/Collapse';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useSnackbar } from 'notistack';
import LinearProgress from '@mui/material/LinearProgress';

const StyledCard = styled(Card)(({ theme }) => ({
  margin: 0,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  display: 'flex',
  flexDirection: 'column',
  transform: 'none !important',
  transition: 'none !important',
  animation: 'none !important',
  '&:hover': {
    transform: 'none !important',
    boxShadow: theme.shadows[3],
  }
}));

const StyledContentWrapper = styled(Box)({
  transition: 'none !important',
  animation: 'none !important',
  '& *': {
    transition: 'none !important',
    animation: 'none !important',
  }
});

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

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: theme.spacing(2),
    marginTop: theme.spacing(1),
    boxShadow: theme.shadows[3],
    '& .MuiMenuItem-root': {
      padding: theme.spacing(1.5, 2),
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 115, 230, 0.08)',
        '& .MuiListItemIcon-root': {
          color: theme.palette.primary.main,
        },
      },
      '& .MuiListItemIcon-root': {
        minWidth: 36,
        color: theme.palette.text.secondary,
      },
    },
  },
}));

const isValidFileType = (file) => {
  const validTypes = [
    'text/csv',
    'text/plain',
    'application/vnd.ms-excel', // For some CSV files
    '.csv',
    '.txt',
    '.npd',
  ];

  return validTypes.some(type =>
    file.type === type || file.name.toLowerCase().endsWith(type.toLowerCase())
  );
};

const PreviewModalDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    transition: 'none !important',
  },
  '& .MuiDialog-container': {
    transition: 'none !important',
  },
  '& .MuiDialog-paper': {
    width: '90vw',
    maxWidth: '1200px',
    height: '85vh',
    maxHeight: '900px',
    margin: '20px',
    borderRadius: theme.spacing(2),
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    transition: 'none !important',
    transform: 'none !important',
    boxShadow: theme.shadows[24],
  },
  '& *': {
    transition: 'none !important',
    animation: 'none !important',
  }
}));

const ModalTransition = styled(Fade)(({ theme }) => ({
  '& .MuiDialog-paper': {
    opacity: 0,
    transform: 'scale(0.95)',
    transition: theme.transitions.create(['opacity', 'transform'], {
      duration: theme.transitions.duration.standard,
      easing: theme.transitions.easing.easeOut,
    }),
  },
  '&.MuiModal-open .MuiDialog-paper': {
    opacity: 1,
    transform: 'scale(1)',
  },
}));

const FilesButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(1.5, 2.5),
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  minWidth: 280,
  height: 64,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transform: 'translateY(-2px)',
    '& .file-icon-wrapper': {
      transform: 'scale(1.05)',
      backgroundColor: theme.palette.primary.lighter,
    },
    '& .file-count': {
      transform: 'scale(1.1)',
    }
  },
}));

const FileIconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.lighter,
  borderRadius: theme.shape.borderRadius * 2,
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
}));

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
  const [expandedCards, setExpandedCards] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [invalidFiles, setInvalidFiles] = useState([]);
  const [invalidFilesModalOpen, setInvalidFilesModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [apiFiles, setApiFiles] = useState([]);
  const [uploadedFileMenu, setUploadedFileMenu] = useState(null);
  const [selectedUploadedFile, setSelectedUploadedFile] = useState(null);
  const [expandedUploadedFiles, setExpandedUploadedFiles] = useState({});
  const [previewUploadedFile, setPreviewUploadedFile] = useState(null);
  const [isModalContentLoading, setIsModalContentLoading] = useState(false);
  const [expandedFiles, setExpandedFiles] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);

  const { enqueueSnackbar } = useSnackbar();

  const UploadedFilePreviewModal = () => (
    <PreviewModalDialog
      open={Boolean(previewUploadedFile)}
      onClose={() => setPreviewUploadedFile(null)}
      fullWidth
      maxWidth={false}
      TransitionComponent={ModalTransition}
      TransitionProps={{
        timeout: {
          enter: 300,
          exit: 200,
        },
      }}
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'sticky',
        top: 0,
        backgroundColor: 'background.paper',
        zIndex: 1,
      }}>
        <Typography variant="h6">File Preview</Typography>
        <IconButton onClick={() => setPreviewUploadedFile(null)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {previewUploadedFile && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {previewUploadedFile.name}
            </Typography>
            {/* Add your preview content here based on file type */}
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              maxHeight: '600px',
              overflow: 'auto'
            }}>
              {/* Add file content preview here */}
              <Typography variant="body2" color="text.secondary">
                File preview content will be displayed here
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
    </PreviewModalDialog>
  );

  const handleUploadedFileMenuOpen = (event, file) => {
    event.stopPropagation();
    setSelectedUploadedFile(file);
    setUploadedFileMenu(event.currentTarget);
  };

  const handleUploadedFileMenuClose = () => {
    setUploadedFileMenu(null);
    setSelectedUploadedFile(null);
  };

  // const getUploadedFile = async (url) => {
  //   const res = await axios.get(url, { responseType: 'text' })
  //   setPreviewUploadedFile(res.data);
  // }

  const handleUploadedFilePreview = (file) => {
    setPreviewUploadedFile(file);
    handleUploadedFileMenuClose();
    // getUploadedFile(file?.file_url);
  };

  const handleUploadedFileDelete = async (file) => {
    try {
      const decodedToken = jwtDecode(storedToken);
      await axios.delete(`https://swkddnwcmm.us-east-1.awsapprunner.com/users/files/${decodedToken.sub}/${file.id}`);
      
      // Remove the file from the UI
      setApiFiles(prevFiles => prevFiles.filter(f => f.id !== file.id));
      
      // Show success message
      setUploadMessage("File deleted successfully!");
      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Error deleting file:", error);
      setUploadMessage("Failed to delete file. Please try again.");
      setSuccessModalOpen(true);
    }
    handleUploadedFileMenuClose();
  };

  const handleUploadedFileEdit = (file) => {
    // Add your edit logic here
    handleUploadedFileMenuClose();
  };

  const toggleUploadedFileExpand = (fileId) => {
    setExpandedUploadedFiles(prev => ({
      ...prev,
      [fileId]: !prev[fileId]
    }));
  };

  const handleFileExpand = (fileName) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    setExpandedFiles(prev => ({
      ...prev,
      [fileName]: !prev[fileName]
    }));
  };

  const PreviewModal = () => {
    return (
      <PreviewModalDialog
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        fullWidth
        maxWidth={false}
        closeAfterTransition={false}
        TransitionProps={{ timeout: 0 }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          backgroundColor: 'background.paper',
          zIndex: 1,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">Selected Files Preview</Typography>
            <Typography variant="body2" color="text.secondary">
              ({files.length} {files.length === 1 ? 'file' : 'files'} selected)
            </Typography>
          </Box>
          <IconButton onClick={() => setPreviewModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <StyledContentWrapper>
            {files.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 8,
                  px: 3,
                  textAlign: 'center',
                  backgroundColor: 'background.default',
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: 'divider',
                }}
              >
                <InsertDriveFileIcon 
                  sx={{ 
                    fontSize: 64, 
                    color: 'text.secondary',
                    mb: 2,
                    opacity: 0.5
                  }} 
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Files Selected
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload files by dragging & dropping them or using the upload button
                </Typography>
                <GradientButton
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mt: 3 }}
                >
                  Upload Files
                  <input
                    type="file"
                    multiple
                    accept=".csv, .txt, .npd"
                    hidden
                    onChange={handleFileUpload}
                  />
                </GradientButton>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {files.map((file, index) => (
                  <Grid item xs={12} key={`${file.name}-${index}`}>
                    <StyledCard>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box 
                          onClick={handleFileExpand(file.name)}
                          sx={{ 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          <Box 
                            sx={{ 
                              display: 'flex',
                              transform: expandedFiles[file.name] ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'none !important',
                            }}
                          >
                            <ExpandMoreIcon />
                          </Box>
                          
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                              {file.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Format: {file.type || "N/A"} | Size: {formatFileSize(file.size)}
                            </Typography>
                          </Box>
                          
                          <IconButton 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileRemove(index);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>

                        {expandedFiles[file.name] && (
                          <Box 
                            sx={{ 
                              mt: 2,
                              pt: 2,
                              borderTop: '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            {fileLoadingStates[file.name] ? (
                              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                <CircularProgress size={24} />
                              </Box>
                            ) : (
                              <Box 
                                sx={{ 
                                  maxHeight: '300px', 
                                  overflowY: 'auto',
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  borderRadius: 1,
                                  bgcolor: 'background.paper',
                                }}
                              >
                                {parsedData[index]?.data && (
                                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                      <tr style={{ 
                                        position: 'sticky', 
                                        top: 0, 
                                        backgroundColor: '#f5f5f5',
                                        zIndex: 1
                                      }}>
                                        {Object.keys(parsedData[index].data[0] || {}).map((header, headerIndex) => (
                                          <th key={headerIndex} style={{ 
                                            padding: '12px 8px', 
                                            borderBottom: '2px solid #ddd', 
                                            textAlign: 'left',
                                            fontWeight: 600,
                                          }}>
                                            {header}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {parsedData[index].data.slice(0, 5).map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                          {Object.values(row).map((cell, cellIndex) => (
                                            <td key={cellIndex} style={{ 
                                              padding: '8px', 
                                              borderBottom: '1px solid #ddd',
                                            }}>
                                              {cell}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )}
                              </Box>
                            )}
                          </Box>
                        )}
                      </CardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
            )}
          </StyledContentWrapper>
        </DialogContent>

        <DialogActions sx={{ 
          p: 2, 
          borderTop: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          bottom: 0,
          bgcolor: 'background.paper',
          zIndex: 1,
        }}>
          {files.length > 0 && (
            <GradientButton 
              onClick={handleSubmitFiles}
              disabled={isUploading || filesSubmitted || files.length === 0}
              startIcon={<CloudUploadIcon />}
            >
              Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
            </GradientButton>
          )}
        </DialogActions>
      </PreviewModalDialog>
    );
  };

  
  
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

  useEffect(() => {
    const fetchUserFiles = async () => {
      setIsLoadingFiles(true);
      try {
        const decodedToken = jwtDecode(storedToken);
        const response = await axios.get(`https://swkddnwcmm.us-east-1.awsapprunner.com/users/files/${decodedToken.sub}`);
        
        const formattedFiles = response.data.map(file => ({
          id: file.id,
          file_name: file.file_name,
          file_url: file.file_url,
          file_size: file.file_size,
          upload_date: new Date(file.upload_date),
          username: file.username
        }));
        
        setApiFiles(formattedFiles);
      } catch (error) {
        console.error("Error fetching files:", error);
        enqueueSnackbar('Error loading files. Please refresh the page.', { 
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      } finally {
        setIsLoadingFiles(false);
      }
    };

    fetchUserFiles();
  }, [storedToken]); // Re-fetch when token changes

  const handleFileUpload = (event) => {
    // console.log(event.target.files, 'event.target.files')

    const uploadedFiles = Array.from(event.target.files);
    const validFiles = [];
    const invalidFiles = [];

    uploadedFiles.forEach(file => {
      if (isValidFileType(file)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      setInvalidFiles(invalidFiles);
      setInvalidFilesModalOpen(true);
    }

    if (validFiles.length > 0) {
      setPreviewModalOpen(true);
      
      setTimeout(() => {
        setFiles(prevFiles => [...prevFiles, ...validFiles]);
        const newLoadingStates = {};
        validFiles.forEach(file => {
          newLoadingStates[file.name] = true;
        });
        setFileLoadingStates(prev => ({ ...prev, ...newLoadingStates }));
        validFiles.forEach(file => readFileContent(file));
        setFilesSubmitted(false);
      }, 100);
    }
  };

  const readFileContent = (file) => {
    setIsParsingFile(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target.result;
      try {
        const data = parseCSV(text);
        if (!data || data.length === 0) {
          setParsedData((prevData) => [...prevData, { 
            fileName: file.name, 
            data: [],
            error: 'No data found in file',
            status: 'empty'
          }]);
        } else {
          setParsedData((prevData) => [...prevData, { 
            fileName: file.name, 
            data,
            status: 'success'
          }]);
        }
      } catch (error) {
        setParsedData((prevData) => [...prevData, { 
          fileName: file.name, 
          data: [],
          error: 'File appears to be corrupted or in wrong format',
          status: 'error'
        }]);
      }
      
      setFileLoadingStates(prev => ({
        ...prev,
        [file.name]: false
      }));
      setIsParsingFile(false);
    };

    reader.onerror = () => {
      setParsedData((prevData) => [...prevData, { 
        fileName: file.name, 
        data: [],
        error: 'Failed to read file',
        status: 'error'
      }]);
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
    const droppedFiles = Array.from(event.dataTransfer.files);
    const validFiles = [];
    const invalidFiles = [];

    droppedFiles.forEach(file => {
      if (isValidFileType(file)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      setInvalidFiles(invalidFiles);
      setInvalidFilesModalOpen(true);
    }

    if (validFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...validFiles]);
      const newLoadingStates = {};
      validFiles.forEach(file => {
        newLoadingStates[file.name] = true;
      });
      setFileLoadingStates(prev => ({ ...prev, ...newLoadingStates }));
      validFiles.forEach(file => readFileContent(file));
      setFilesSubmitted(false);
      setPreviewModalOpen(true);
    }
    
    setIsDragging(false);
  };

  const handleSubmitFiles = () => {
    setConfirmModalOpen(true);
  };

  const handleConfirmedUpload = async () => {
    setIsUploading(true);
    setIsConfirming(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const decodedToken = jwtDecode(storedToken);
    
    try {
      const response = await axios.post(
        'https://swkddnwcmm.us-east-1.awsapprunner.com/users/uploadfiles', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: {
            user_name: decodedToken.sub
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      // Clear preview files and related states after successful upload
      setFiles([]);
      setParsedData([]);
      setFileLoadingStates({});
      setExpandedFiles({});
      
      // Refresh the uploaded files list
      const updatedFiles = await axios.get(
        `https://swkddnwcmm.us-east-1.awsapprunner.com/users/files/${decodedToken.sub}`
      );
      setApiFiles(updatedFiles.data);

      setUploadedFilesCount(files.length);
      setUploadMessage("Files uploaded successfully!");
      setSuccessModalOpen(true);
      setFilesSubmitted(true);
      setPreviewModalOpen(false);
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadMessage("File upload failed! Please try again.");
      setSuccessModalOpen(true);
    } finally {
      setIsUploading(false);
      setIsConfirming(false);
      setConfirmModalOpen(false);
      setUploadProgress(0);
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

  const handleCardExpand = (fileName) => {
    setExpandedCards(prev => ({
      ...prev,
      [fileName]: !prev[fileName]
    }));
  };

  const handleMenuOpen = (event, index) => {
    event.stopPropagation(); // Prevent card expansion when opening menu
    setAnchorEl(event.currentTarget);
    setSelectedFileIndex(index);
  };

  const handleMenuClose = (event) => {
    event.stopPropagation(); // Prevent card expansion when closing menu
    setAnchorEl(null);
    setSelectedFileIndex(null);
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    if (selectedFileIndex !== null) {
      handleFileRemove(selectedFileIndex);
    }
    handleMenuClose(event);
  };

  const InvalidFilesDialog = () => (
    <StyledDialog
      open={invalidFilesModalOpen}
      onClose={() => setInvalidFilesModalOpen(false)}
      TransitionProps={{ timeout: 500 }}
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
          <WarningIcon 
            sx={{ 
              fontSize: 60, 
              color: 'warning.main',
              animation: 'bounce 0.5s ease'
            }} 
          />
          <Typography variant="h6">Unsupported File Types</Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The following files are not supported:
        </Typography>
        <Box sx={{ 
          bgcolor: 'grey.100', 
          p: 2, 
          borderRadius: 1,
          maxHeight: '150px',
          overflowY: 'auto'
        }}>
          {invalidFiles.map((file, index) => (
            <Typography key={index} variant="body2" color="error" sx={{ mb: 1 }}>
              {file.name} ({file.type || 'unknown type'})
            </Typography>
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Only .csv, .txt and .npd files are supported.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ 
        justifyContent: 'center',
        gap: 2,
        pb: 3 
      }}>
        <Button 
          variant="outlined" 
          onClick={() => setInvalidFilesModalOpen(false)}
          sx={{ 
            minWidth: '120px',
            borderRadius: 2,
            color: 'error.main',
            borderColor: 'error.main',
            '&:hover': {
              borderColor: 'error.dark',
              backgroundColor: 'error.light',
            },
            transition: 'all 0.2s ease'
          }}
        >
          OK
        </Button>
      </DialogActions>
    </StyledDialog>
  );

  const handleUploadedFileExpand = (fileId) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    setExpandedUploadedFiles(prev => ({
      ...prev,
      [fileId]: !prev[fileId]
    }));
  };

  const handleDeleteDialogOpen = (file) => {
    handleUploadedFileMenuClose();
    setSelectedUploadedFile(file);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedUploadedFile(null);
  };

  const handleFileDelete = async () => {
    if (!selectedUploadedFile) return;
    
    setIsDeleting(true);
    try {
      const decodedToken = jwtDecode(storedToken);
      const response = await axios.delete(
        `https://swkddnwcmm.us-east-1.awsapprunner.com/users/files/${decodedToken.sub}/${selectedUploadedFile.id}`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        }
      );

      if (response.status === 200) {
        // Update the UI by removing the deleted file
        setApiFiles(prevFiles => 
          prevFiles.filter(file => file.id !== selectedUploadedFile.id)
        );
        handleDeleteDialogClose();
        // Show success message
        enqueueSnackbar('File deleted successfully', { 
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      enqueueSnackbar('Error deleting file. Please try again.', { 
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const DeleteConfirmationDialog = () => (
    <StyledDialog
      open={deleteDialogOpen}
      onClose={handleDeleteDialogClose}
      maxWidth="xs"
      fullWidth
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
          <WarningIcon 
            sx={{ 
              fontSize: 60, 
              color: 'error.main',
              animation: 'bounce 0.5s ease'
            }} 
          />
          <Typography variant="h6">
            Confirm Delete
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
          Are you sure you want to delete this file?
        </Typography>
        {selectedUploadedFile && (
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            bgcolor: 'error.lighter', 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'error.light'
          }}>
            <Typography variant="subtitle2" color="error.main">
              {selectedUploadedFile.file_name}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        justifyContent: 'center',
        gap: 2,
        pb: 3 
      }}>
        <Button 
          variant="outlined" 
          color="info"
          onClick={handleDeleteDialogClose}
          sx={{ 
            minWidth: '120px',
            borderRadius: 2,
            color: 'grey !important',
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="error"
          onClick={handleFileDelete}
          disabled={isDeleting}
          sx={{ 
            minWidth: '120px',
            borderRadius: 2,
            color: 'white !important',
          }}
        >
          {isDeleting ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Deleting...
            </>
          ) : (
            'Yes'
          )}
        </Button>
      </DialogActions>
    </StyledDialog>
  );

  const UploadLoadingContent = () => (
    <Box sx={{ 
      px: 3, 
      py: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 3
    }}>
      {/* Animated Upload Progress */}
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={uploadProgress}
          size={88}
          thickness={3}
          sx={{ color: 'primary.main' }}
        />
        <CircularProgress
          variant="determinate"
          value={100}
          size={88}
          thickness={3}
          sx={{
            color: (theme) => theme.palette.grey[200],
            position: 'absolute',
            left: 0,
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h6"
            component="div"
            color="primary.main"
            sx={{ fontWeight: 600 }}
          >
            {`${Math.round(uploadProgress)}%`}
          </Typography>
        </Box>
      </Box>

      {/* Status Text */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Uploading Files...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {uploadProgress < 100 
            ? 'Please wait while we process your files'
            : 'Almost done...'}
        </Typography>
      </Box>

      {/* File Progress Indicator */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ 
          width: '100%', 
          height: 4, 
          bgcolor: 'grey.100',
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative'
        }}>
          <Box
            sx={{
              width: `${uploadProgress}%`,
              height: '100%',
              bgcolor: 'primary.main',
              position: 'absolute',
              left: 0,
              top: 0,
              transition: 'width 0.5s ease-in-out',
            }}
          />
        </Box>
        
        <Box sx={{ 
          mt: 1,
          display: 'flex', 
          justifyContent: 'space-between',
          px: 1
        }}>
          <Typography variant="caption" color="text.secondary">
            {`${files.length} ${files.length === 1 ? 'file' : 'files'}`}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {uploadProgress === 100 ? 'Completing...' : 'Uploading...'}
          </Typography>
        </Box>
      </Box>

      {/* Upload Steps */}
      <Box sx={{ width: '100%', mt: 2 }}>
        {[
          { label: 'Preparing files', done: uploadProgress > 0 },
          { label: 'Uploading to server', done: uploadProgress > 30 },
          { label: 'Processing', done: uploadProgress > 70 },
          { label: 'Finalizing', done: uploadProgress === 100 }
        ].map((step, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1
            }}
          >
            {step.done ? (
              <CheckCircleOutlineIcon 
                sx={{ 
                  color: 'success.main',
                  animation: 'fadeIn 0.3s ease'
                }} 
              />
            ) : (
              <CircularProgress 
                size={20} 
                thickness={6}
                sx={{ 
                  color: 'grey.300',
                  opacity: uploadProgress >= (index * 25) ? 1 : 0.3
                }} 
              />
            )}
            <Typography
              variant="body2"
              color={step.done ? 'text.primary' : 'text.secondary'}
              sx={{ 
                transition: 'color 0.3s ease',
                fontWeight: step.done ? 500 : 400
              }}
            >
              {step.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );

  const LoadingFiles = () => (
    <Box sx={{ width: '100%', py: 4 }}>
      {[1, 2, 3].map((item) => (
        <Box
          key={item}
          sx={{
            mb: 2,
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 2,
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.5 },
              '100%': { opacity: 1 },
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                bgcolor: 'grey.200',
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  height: 20,
                  width: '60%',
                  bgcolor: 'grey.200',
                  borderRadius: 1,
                  mb: 1,
                }}
              />
              <Box
                sx={{
                  height: 16,
                  width: '40%',
                  bgcolor: 'grey.200',
                  borderRadius: 1,
                }}
              />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <DashboardLayout>
      <GlobalStyles />
      <Box sx={{ p: 3 }}>
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
              accept=".csv, .txt, .npd"
              hidden
              onChange={handleFileUpload}
            />
          </GradientButton>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Supported Formats: {supportedFormats}
          </Typography>
        </UploadSection>

        {files.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <FilesButton
              onClick={() => setPreviewModalOpen(true)}
              disableRipple
            >
              <FileIconWrapper className="file-icon-wrapper">
                <InsertDriveFileIcon 
                  sx={{ 
                    color: 'primary.main',
                    fontSize: 24
                  }} 
                />
                <Typography
                  className="file-count"
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%',
                    width: 22,
                    height: 22,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s ease-in-out',
                    border: (theme) => `2px solid ${theme.palette.background.paper}`,
                  }}
                >
                  {files.length}
                </Typography>
              </FileIconWrapper>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-start',
                flex: 1
              }}>
                <Typography 
                  variant="subtitle2" 
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem', mb: 0.5 }}
                >
                  Selected Files
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                    lineHeight: 1.2
                  }}
                >
                  {files.length} {files.length === 1 ? 'File' : 'Files'} Ready
                </Typography>
              </Box>

              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: 'primary.main'
                }}
              >
                <KeyboardArrowRightIcon />
              </Box>
            </FilesButton>

            {files.some(file => file.size > 5 * 1024 * 1024) && (
              <Tooltip title="Some files are large and may take longer to process">
                <WarningIcon 
                  color="warning" 
                  sx={{ 
                    ml: 2,
                    verticalAlign: 'middle'
                  }} 
                />
              </Tooltip>
            )}
          </Box>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3
          }}>
            <InsertDriveFileIcon sx={{ color: 'primary.main' }} />
            Uploaded Files
          </Typography>

          {isLoadingFiles ? (
            <LoadingFiles />
          ) : apiFiles.length === 0 ? (
            <Box sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: 'background.paper',
              borderRadius: 2,
              borderColor: 'divider'
            }}>
              <InsertDriveFileIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Files Uploaded Yet
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {apiFiles.map((file) => (
                <Grid item xs={12} key={file.id}>
                  <StyledCard>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box 
                        onClick={handleUploadedFileExpand(file.id)}
                        sx={{ 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Box 
                          sx={{ 
                            display: 'flex',
                            transform: expandedUploadedFiles[file.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'none !important',
                          }}
                        >
                          <ExpandMoreIcon />
                        </Box>
                        
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                            {file.file_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Uploaded on: {new Date(file.upload_date).toLocaleDateString()}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Preview File">
                            <IconButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUploadedFilePreview(file);
                              }}
                              sx={{ 
                                color: 'primary.main',
                                '&:hover': { bgcolor: 'primary.lighter' }
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUploadedFileMenuOpen(e, file);
                            }}
                            sx={{ 
                              '&:hover': { bgcolor: 'grey.100' }
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                      </Box>

                      <Collapse in={expandedUploadedFiles[file.id]} timeout={0}>
                        <Box sx={{ 
                          mt: 2,
                          pt: 2,
                          borderTop: '1px solid',
                          borderColor: 'divider'
                        }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" color="text.secondary">
                                File URL: {file.file_url}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" color="text.secondary">
                                File Size: {formatFileSize(file.file_size)}
                              </Typography>
                            </Grid>
                            {file.description && (
                              <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">
                                  Description: {file.description}
                                </Typography>
                              </Grid>
                            )}
                          </Grid>
                        </Box>
                      </Collapse>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          )}

          {/* File Actions Menu */}
          <StyledMenu
            anchorEl={uploadedFileMenu}
            open={Boolean(uploadedFileMenu)}
            onClose={handleUploadedFileMenuClose}
          >
            <MenuItem onClick={() => handleUploadedFileEdit(selectedUploadedFile)}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={() => handleDeleteDialogOpen(selectedUploadedFile)}
              sx={{ 
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.lighter',
                },
              }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText primary="Delete" />
            </MenuItem>
          </StyledMenu>
        </Box>

        <PreviewModal />

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

        <StyledMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </MenuItem>
          <MenuItem 
            onClick={handleDeleteClick}
            sx={{ 
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
              },
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </MenuItem>
        </StyledMenu>

        <StyledDialog
          open={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
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
              <WarningIcon 
                sx={{ 
                  fontSize: 60, 
                  color: 'warning.main',
                  animation: 'bounce 0.5s ease'
                }} 
              />
              <Typography variant="h6" component="div">
                Confirm Upload
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', py: 2 }}>
            {isUploading ? (
              <UploadLoadingContent />
            ) : (
              <>
                <Box sx={{ 
                  mt: 2, 
                  p: 2, 
                  bgcolor: 'rgba(0, 115, 230, 0.08)', 
                  borderRadius: 2,
                  animation: 'fadeIn 0.5s ease'
                }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {files.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {files.length === 1 ? 'File' : 'Files'} Selected for Upload
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mt: 3, color: 'text.secondary' }}>
                  Are you sure you want to upload {files.length} {files.length === 1 ? 'file' : 'files'}?
                </Typography>
                {files.some(file => file.size > 5 * 1024 * 1024) && (
                  <Typography 
                    variant="body2" 
                    color="warning.main" 
                    sx={{ 
                      mt: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1
                    }}
                  >
                    <WarningIcon fontSize="small" />
                    Some files are large and may take longer to upload
                  </Typography>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ 
            justifyContent: 'center',
            gap: 2,
            pb: 3 
          }}>
            {!isUploading && (
              <Button 
                variant="outlined" 
                onClick={() => setConfirmModalOpen(false)}
                sx={{ 
                  minWidth: '120px',
                  borderRadius: 2,
                  color: 'error.main',
                  borderColor: 'error.main',
                  '&:hover': {
                    borderColor: 'error.dark',
                    backgroundColor: 'error.lighter',
                  },
                }}
              >
                Cancel
              </Button>
            )}
            <GradientButton 
              onClick={handleConfirmedUpload}
              disabled={isUploading || isConfirming}
              sx={{ 
                minWidth: '120px',
                animation: 'fadeIn 0.5s ease'
              }}
            >
              {isUploading ? 'Uploading...' : 'Yes, Upload'}
            </GradientButton>
          </DialogActions>
        </StyledDialog>
        <InvalidFilesDialog />
        <DeleteConfirmationDialog />
      </Box>
    </DashboardLayout>
  );
}

export default Dashboard;
