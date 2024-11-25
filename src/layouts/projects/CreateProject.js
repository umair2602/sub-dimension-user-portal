import React, { useState } from "react";
import {
  Button,
  Stepper,
  Typography,
  Step,
  Box,
  Card,
  CardContent,
  StepLabel,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ProjectForm from "components/projects/create-project/project-form/ProjectForm";
import UploadFiles from "components/projects/create-project/upload-files/UploadFiles";
import { useSelector, useDispatch } from "react-redux";
import { setInputError, resetExceptProjects } from "features/projects/projectsSlice";
import { useNavigate } from "react-router-dom";
import Visualization from "components/projects/create-project/visualization/Visualization";

const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];

const CreateProject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { formData } = useSelector((state) => state.projects);
  const [activeStep, setActiveStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [parsedData, setParsedData] = useState([]);

  const inputFields = [
    {
      label: "Project Name",
      name: "projectName",
      value: formData.projectName,
      placeholder: "Enter project name",
      multiline: false,
      rows: "1",
      required: true,
    },
    {
      label: "Company Name",
      name: "companyName",
      value: formData.companyName,
      placeholder: "Enter company name",
      multiline: false,
      rows: "1",
      required: false,
    },
    {
      label: "Client",
      name: "client",
      value: formData.client,
      placeholder: "Enter client name",
      multiline: true,
      rows: "1",
      required: false,
    },
    {
      label: "Vessel",
      name: "vessel",
      value: formData.vessel,
      placeholder: "Enter vessel name",
      multiline: false,
      rows: "1",
      required: false,
    },
    {
      label: "Details",
      name: "details",
      value: formData.details,
      placeholder: "Enter additional details",
      multiline: true,
      rows: "4",
      required: false,
    },
  ];

  const validateFormData = () => {
    let isValid = true;
    inputFields.forEach((field) => {
      if (field.required && !formData[field.name]?.trim()) {
        dispatch(setInputError({ name: field.name, error: `${field.label} is required` }));
        isValid = false;
      }
    });
    return isValid;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateFormData()) {
      return; // return if form validation fails
    }
    if (activeStep === 1 && files.length === 0) {
      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Handle back button
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle close button
  const handleClose = () => {
    navigate(`/projects`);
    resetStates();
  };

  const resetStates = () => {
    dispatch(resetExceptProjects());
    setActiveStep(0);
    setFiles([]);
    setParsedData([]);
  };

  // Render content based on active step
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <ProjectForm inputFields={inputFields} />;
      case 1:
        return (
          <UploadFiles
            files={files}
            setFiles={setFiles}
            parsedData={parsedData}
            setParsedData={setParsedData}
          />
        );
      case 2:
        return <Visualization files={files} parsedData={parsedData} />;
      case 3:
        return <Typography>Generate Report</Typography>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <Box
        sx={{
          height: "93vh",
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card>
          <CardContent
            sx={{
              pt: 3,
              width: { sm: "auto", md: 500, lg: 650 },
              height: 591,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Box
                sx={{
                  pb: 3,
                }}
              >
                <Stepper linear="true" activeStep={activeStep}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel
                        disabled
                        StepIconProps={{
                          sx: {
                            "&.Mui-active": {
                              color: "#007aff",
                            },
                            "&.Mui-completed": {
                              color: "#007aff",
                            },
                          },
                        }}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              {renderStepContent(activeStep)}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                pt: 2,
              }}
            >
              <Button disabled={activeStep === 0 || activeStep === 2} onClick={handleBack}>
                Back
              </Button>
              <Box sx={{ display: "flex", gap: 1 }}>
                {activeStep === 1 && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    sx={{ color: "white !important" }}
                  >
                    Save and Next
                  </Button>
                )}
                {activeStep < steps.length - 1 && activeStep !== 1 && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    sx={{ color: "white !important" }}
                  >
                    Next
                  </Button>
                )}
                {activeStep >= 2 && (
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ color: "white !important" }}
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default CreateProject;