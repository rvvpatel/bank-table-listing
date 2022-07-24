import { Button, IconButton, Tooltip } from "@mui/material";
import ViewIcon from '@mui/icons-material/RemoveRedEye';
import React from "react";

const ViewAction = ({ title, onClick }) => {
  return (
    <Tooltip title={title || "View"} >
      <Button startIcon={<ViewIcon />} variant='outlined' size="inherit" onClick={() => onClick()}>
        View
      </Button>
    </Tooltip>
  );
};

export default ViewAction;
