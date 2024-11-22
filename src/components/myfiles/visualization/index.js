import { Grid } from "@mui/material";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";
import LineChart from "./charts/ProgressiveLineChart";
import ScatterChart from "./charts/ScatterChart";

const Visualization = ({ visualData }) => {
  return (
    <>
      <Grid container spacing={3} paddingTop={2}>
        <Grid item xs={12} md={6}>
          <ScatterChart data={visualData} />
        </Grid>
        <Grid item xs={12} md={6}>
          <LineChart data={visualData} />
        </Grid>
        {/* <Grid item xs={12} md={6}>
          <BarChart data={visualData} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PieChart data={visualData} />
        </Grid> */}
      </Grid>
    </>
  );
};

export default Visualization;
