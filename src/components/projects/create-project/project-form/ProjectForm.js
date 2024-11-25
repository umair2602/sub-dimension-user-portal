import React from "react";
import { TextField, Box, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { updateFormData, setInputError, clearInputError } from "features/projects/projectsSlice";

const ProjectForm = ({ inputFields }) => {
  const { formData, inputErrors } = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    dispatch(updateFormData({ name, value }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const field = inputFields.find((field) => field.name === name);
    if (!value.trim() && field?.required) {
      dispatch(setInputError({ name, error: `${field.label} is required` }));
    } else {
      dispatch(clearInputError({ name }));
    }
  };

  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="h5" sx={{ pb: 1 }}>
        Define project
      </Typography>
      {inputFields.map((field) => (
        <Box>
          <Typography variant="subtitle2" sx={{ pb: 0.5, fontWeight: 500 }}>
            {field.label}
          </Typography>

          <TextField
            key={field.name}
            label=""
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={field.placeholder}
            multiline={field.multiline}
            rows={field.rows}
            required={field.required}
            error={!!inputErrors[field.name]}
            helperText={inputErrors[field.name] || " "}
            fullWidth
          />
        </Box>
      ))}
    </Box>
  );
};

export default ProjectForm;