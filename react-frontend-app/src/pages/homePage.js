import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';

function HomePage() {
  const history = useHistory();
  const [posts, setPost] = useState([]);

  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(25);


  // TODO: allowing change of rows per page

  // retrieve the posts from the server
  const getPosts = useCallback(async () => {
    const res = await axios.get('http://localhost:9051/post-data?rows=${postsPerPage}&pageNumber=page')
    console.log("LOGGING DATA" + res.data);
    console.log("more specificaly: " + res.data[0].title);
    const data = []; //data is an array of arrays
    for(var i = 0; i < res.data.length; i++) {
      data.push([res.data[i].post_id,res.data[i].title,res.data[i].post_body,res.data[i].user_id]);
      console.log(data[i]);
    }
    setPost(data);
  }, [postsPerPage, page]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label='table'>
          <TableHead>
            <TableRow>
              <TableCell>Post Title</TableCell>
              <TableCell>Username</TableCell>
              <TableCell># of Comments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((row) => {
              <TableRow hover key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell aligh="right">{row.title}</TableCell>
                <TableCell aligh="right">{row.username}</TableCell>
                <TableCell aligh="right">{row.numComments}</TableCell>
              </TableRow>
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 25]}
                colSpan={3}
                count={posts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page'},
                  native: true,
                }}
                onChange={handleChangePage /* TODO: Create handleChangePage */}
                onChangeRowsPerPage={handleChangeRowsPerPage} // TODO: createa handleChangeRowsPerPage
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}


export default homePage
