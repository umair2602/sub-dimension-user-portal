import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Box, Typography, Card, CardContent, Avatar, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { jwtDecode } from "jwt-decode";

const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  transition: "transform 0.3s ease",
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  }
}));

function Dashboard() {
  const storedToken = localStorage.getItem("token");
  const decodedToken = storedToken ? jwtDecode(storedToken) : null;

  // Mock user data - replace with actual user data from your backend
  const userData = {
    name: decodedToken?.sub || "User",
    email: decodedToken?.email || "user@example.com",
    role: "Member",
    joinDate: "January 2024",
    lastActive: "Today"
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {userData.name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 4 }}>
          Here's your profile overview
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'primary.main',
                      fontSize: '2rem',
                      mr: 2
                    }}
                  >
                    {userData.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      {userData.name}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      {userData.role}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {userData.email}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Member Since:</strong> {userData.joinDate}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Last Active:</strong> {userData.lastActive}
                  </Typography>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Add more Grid items here for additional cards/information */}
        </Grid>
      </Box>
    </DashboardLayout>
  );
}

export default Dashboard;