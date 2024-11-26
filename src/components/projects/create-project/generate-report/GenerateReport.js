import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import ScatterChart from "components/projects/common/visual-charts/ScatterChart";
import LineChart from "components/projects/common/visual-charts/ProgressiveLineChart";

const GenerateReport = ({ inputFields, parsedData }) => {
  const { formData, inputErrors } = useSelector((state) => state.projects);

  return (
    <Box
      sx={{
        width: "80%",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        // maxHeight: "70.7vh",
        // overflow: "auto",
      }}
    >
      <Box>
        <Typography variant="h4" color="initial" paddingBottom={1}>
          Project info
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          {inputFields.map((field) => (
            <Box key={field.name}>
              <Typography variant="subtitle2" sx={{ pb: 0.5, fontWeight: 500 }}>
                {field.label}
              </Typography>

              <TextField
                label=""
                name={field.name}
                value={formData[field.name]}
                placeholder={"No data available"}
                multiline={field.multiline}
                rows={field.rows}
                required={field.required}
                error={!!inputErrors[field.name]}
                helperText={inputErrors[field.name]}
                fullWidth
                disabled
                sx={{
                  minWidth: "300px",
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box>
          <Typography variant="h4" color="initial">
            Visualization
          </Typography>
          <Box
            sx={{
              maxHeight: 400,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Typography variant="h5" color="initial" paddingBottom={1}>
              GPS1 vs GPS2
            </Typography>
            <ScatterChart data={parsedData[0]?.data} />
          </Box>
        </Box>
        <Box
          sx={{
            maxHeight: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <Typography variant="h5" color="initial" paddingBottom={1}>
            Gyro1 vs Gyro2
          </Typography>
          <LineChart data={parsedData[0]?.data} />
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", paddingTop: 2 }}>
        <Button variant="contained" sx={{ color: "white !important" }}>
          Generate report
        </Button>
      </Box>
    </Box>
  );
};

export default GenerateReport;
