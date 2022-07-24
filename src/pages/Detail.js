import { Box, Card, CardContent, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, Stack, Typography } from "@mui/material";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getAccountDetails } from "../redux/action/actions";
import LeftArrowIcon from '@mui/icons-material/ArrowBackIosNew';

const Detail = ({ date }) => {
  const { id } = useParams()
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [details, setDetails] = useState({})

  const getDetails = (id) => {
    setLoading(true)
    try {
      fetch(
        "https://api.sampleapis.com/fakebank/accounts")
        .then(res => res.json())
        .then((json) => {
          const details = json.find((item) => {
            return item.id === parseInt(id)
          })
          setDetails(details)
          setLoading(false)
        })
    } catch (error) {
    }
  }
  React.useEffect(() => {
    if (id) {
      getDetails(id)
    }
  }, [id])
  return (
    <>
      <Stack flexDirection="row" alignItems="center" mb={2} gap={2}>
        <IconButton onClick={() => history.goBack()}><LeftArrowIcon /></IconButton>
        <Typography variant="h4">Account Details</Typography>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      {!loading ? <Grid container spacing={2}>
        <Grid item lg={12}>
          <Stack>
            <Typography variant="h6">{details?.category}</Typography>
            <Typography variant="caption">{details?.transactionDate}</Typography>
          </Stack>
        </Grid>
        <Grid item lg={6}>
          <Card elevation={0} sx={{ background: (theme) => theme.palette.grey[200], }}>
            <CardContent>
              <Typography variant="h5" mb={1}>
                {details?.debit !== null ? details?.debit : '-'}
              </Typography>
              <Typography variant="body2">
                Debit Amount
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item lg={6}>
          <Card elevation={0} sx={{ background: (theme) => theme.palette.grey[200], }}>
            <CardContent>
              <Typography variant="h5" mb={1}>
                {details?.credit !== null ? details?.credit : '-'}
              </Typography>
              <Typography variant="body2">
                Credit Amount
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item lg={6}>
          <Stack>
            <Typography variant="caption">Description</Typography>
            <Typography > {details?.description}</Typography>
          </Stack>
        </Grid>
      </Grid>
        :
        <Box sx={{
          wdith: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <CircularProgress sx={{ mr: 2 }} /> Loading...
        </Box>
      }
    </>
  );
};

export default Detail;
