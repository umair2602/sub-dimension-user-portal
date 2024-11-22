import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addProjects } from "../../features/projects/projectsSlice";

const CreateOrgDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();

  const initialFormData = {
    projectName: "",
    companyName: "",
    client: "",
    vessel: "",
    details: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const [errors, setErrors] = useState({});

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
      required: true,
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

  const validateField = (name, value) => {
    let error = "";
    const field = inputFields.find((field) => field.name === name);
    if (!value.trim() && field?.required) {
      error = `${field.label} is required`;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    validateField(name, value);
  };

  const handleSubmit = () => {
    const newErrors = {};
    inputFields.forEach((field) => {
      if (field.required && !formData[field.name].trim()) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    if (Object.values(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(addProjects(formData));
    handleClose();
  };

  // Clear and close dialog
  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>Create New Project</DialogTitle>
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          paddingTop={2}
          paddingX={{ xs: 1, sm: 6 }}
        >
          {inputFields.map((field) => (
            <TextField
              key={field.name}
              label={field.label}
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder={field.placeholder}
              multiline={field.multiline}
              rows={field.rows}
              required={field.required}
              error={!!errors[field.name]}
              helperText={errors[field.name] || ""}
              fullWidth
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ color: "white !important" }}
        >
          Submit
        </Button>
        <Button onClick={handleClose} color="info">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateOrgDialog;
