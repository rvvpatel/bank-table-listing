import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { CircularProgress, InputBase, Stack, TextField } from '@mui/material';
import { handleFilterTwoDates, handleSearch } from './functions';
import { styled } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  maxHeight: '45px !important',
  backgroundColor: theme.palette.grey[200],
  borderRadius: 6,
  '&:hover': {
    backgroundColor: theme.palette.grey[300],
  },
  marginLeft: 0,
  width: 'auto',

}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(1.5),
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.grey[500],
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5),
    paddingLeft: theme.spacing(5),
    transition: theme.transitions.create('width'),
    width: '100%',
    height: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const range = {
  Today: [moment(), moment()],
  Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
  "Last 7 Days": [moment().subtract(6, "days"), moment()],
  "Last 30 Days": [moment().subtract(29, "days"), moment()],
  "This Month": [moment().startOf("month"), moment().endOf("month")],
  "Last Month": [
    moment()
      .subtract(1, "month")
      .startOf("month"),
    moment()
      .subtract(1, "month")
      .endOf("month")
  ],
  "Last Year": [
    moment()
      .subtract(1, "year")
      .startOf("year"),
    moment()
      .subtract(1, "year")
      .endOf("year")
  ]
};

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, tableHeaders, showActions } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        {tableHeaders?.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {showActions && <TableCell>Action</TableCell>}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, title } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >

      {title && <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {title}
      </Typography>}



    </Toolbar >
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable(props) {
  const { tableHeaders, perPageRows, loading, title, actions, searchByLabel, paginated,
    searchByField = [], tableData, dateFileterField } = props
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState();
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchQuery, setSearchQuery] = React.useState();
  const [rows, setRows] = React.useState(tableData || []);
  const [state, setState] = React.useState({
    start: moment(),
    end: moment(),
  });
  const { start, end } = state;

  const handleCallback = (start, end) => {
    setState({ start, end });
    setRows(handleFilterTwoDates(tableData, dateFileterField, start, end))
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  React.useEffect(() => {
    if (!searchQuery) {
      setRows(tableData);
    } else {
      setRows(handleSearch(tableData, searchByField, searchQuery));
    }

    if (!paginated) {
      setRowsPerPage(perPageRows || tableData.length);
    }
  }, [tableData]);
  React.useEffect(() => {
    if (searchByField.length > 0 && searchQuery) {
      setRows(handleSearch(tableData, searchByField, searchQuery));
    } else {
      setRows(tableData);
    }
  }, [searchQuery]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = rows.length === 0
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Stack sx={{ px: 2 }} flexDirection="row" justifyContent="space-between" alignItems="center">
          <EnhancedTableToolbar numSelected={selected.length} title={title} />
          <Stack gap={2} flexDirection="row" alignItems="center">
            <DateRangePicker
              initialSettings={{
                startDate: start.toDate(),
                endDate: end.toDate(),
                locale: {
                  format: "DD/MM/YYY",
                },
                ranges: range,
              }}
              onCallback={handleCallback}
            >
              <TextField size='small' fullWidth type="text" value={`${moment(start).format('DD/MM/YYYY')} - ${moment(end).format('DD/MM/YYYY')}`} />
            </DateRangePicker>
            {searchByField.length > 0 && (
              <Search>
                <SearchIconWrapper>
                  <SearchIcon fontSize="small" />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder={`Search by ${searchByLabel}`}
                  inputProps={{ 'aria-label': 'search' }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Search>
            )}
          </Stack>

        </Stack>
        <TableContainer>
          <Table
            size={'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              tableHeaders={tableHeaders}
              showActions={actions?.length > 0}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {!loading ? stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {

                  return (
                    <TableRow
                      role="checkbox"
                      tabIndex={-1}
                      key={index}
                    >
                      {tableHeaders.map((head, headindex) => {
                        const data = row[head.id]
                        return (
                          <TableCell key={headindex}>{data}</TableCell>
                        );

                      })}
                      <TableCell
                        valign="baseline"
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        {actions?.length > 0 && (

                          actions.map((Action, index) => {
                            return <Action index={index} key={index} data={row} />;
                          })
                        )}
                      </TableCell>
                    </TableRow>
                  );
                }) : (
                <TableRow>
                  <TableCell colSpan={tableHeaders.length + 5}>
                    <Box sx={{
                      wdith: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '50vh'
                    }}>
                      <CircularProgress sx={{ mr: 2 }} /> Fetching Records...
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {emptyRows > 0 && (
                <TableRow
                >
                  <TableCell colSpan={tableHeaders.length + 5} sx={{ textAlign: 'center' }}>No data found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper >
    </Box >
  );
}
