import React from "react";
import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";

const bounce = keyframes`
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
`;
const DottingLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        gap: "8px",
      }}
    >
      {/* Dot 1 */}
      <Box
        sx={{
          width: "15px",
          height: "15px",
          borderRadius: "50%",
          backgroundColor: "#007aff",
          animation: `${bounce} 1.5s infinite ease-in-out`,
        }}
      />
      {/* Dot 2 */}
      <Box
        sx={{
          width: "15px",
          height: "15px",
          borderRadius: "50%",
          backgroundColor: "#007aff",
          animation: `${bounce} 1.5s 0.3s infinite ease-in-out`,
        }}
      />
      {/* Dot 3 */}
      <Box
        sx={{
          width: "15px",
          height: "15px",
          borderRadius: "50%",
          backgroundColor: "#007aff",
          animation: `${bounce} 1.5s 0.6s infinite ease-in-out`,
        }}
      />
    </Box>
  );
};
export default DottingLoader;
