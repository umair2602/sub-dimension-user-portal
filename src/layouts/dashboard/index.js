import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";

function Dashboard() {
  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Your Dashboard
        </Typography>

      </Box>
    </DashboardLayout>
  );
}

export default Dashboard;
