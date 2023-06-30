import React from "react";
import { Container, Typography } from "@mui/material";

const Footer = () => {
  return (
    <footer
      style={{
        marginTop: "auto",
        backgroundColor: "#f5f5f5",
        padding: "20px 0",
        width: "100%",
      }}
    >
      <Container maxWidth="md">
        <Typography variant="body2" align="center" color="textSecondary">
          &copy; 2023 Sertis. All rights reserved.
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;
