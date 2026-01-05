
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Card, CardContent, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Pagination, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import { useSnackbar } from 'notistack';
import { Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const {enqueueSnackbar} = useSnackbar();
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


// Fetch users
  const API_URL = process.env.NODE_ENV === 'production' 
    ? '/api/users' 
    : 'http://localhost:3000/api/users';
  
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
        const res = await axios.get(API_URL);
        setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
      enqueueSnackbar('Error fetching users!', { variant: 'error' });
    }
    setLoading(false);
  }, [enqueueSnackbar]);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);



  const handleCreate = async () => {
    if (!name.trim()) return;
    // Check for duplicate (case-insensitive)
    const exists = users.some(
      user => user.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (exists) {
      enqueueSnackbar('User already exists!', { variant: 'error' });
      return;
    }
    try {
      await axios.post(API_URL, { name });
      setName('');
      fetchUsers();
      enqueueSnackbar('User created successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error creating user:', error.response?.data || error.message);
      enqueueSnackbar('Error creating user!', { variant: 'error' });
    }
  };

  // Start editing
  const startEdit = (user) => {
    setEditingId(user.id);
    setEditingName(user.name);
  };

  // Update user
  const handleUpdate = async (id) => {
    if (!editingName.trim()) return;
    try {
      await axios.put(`${API_URL}?id=${id}`, { name: editingName });
      setEditingId(null);
      setEditingName('');
      fetchUsers();
      enqueueSnackbar('User updated successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error updating user:', error.response?.data || error.message);
      enqueueSnackbar('Error updating user!', { variant: 'error' });
    }
  };

  // Open delete dialog
  const openDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await axios.delete(`${API_URL}?id=${userToDelete.id}`);
        setUserToDelete(null);
        setDeleteDialogOpen(false);
        fetchUsers();
        enqueueSnackbar('User deleted successfully!', { variant: 'success' });
      } catch (error) {
        console.error('Error deleting user:', error.response?.data || error.message);
        enqueueSnackbar('Error deleting user!', { variant: 'error' });
        setDeleteDialogOpen(false);
      }
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setUserToDelete(null);
    setDeleteDialogOpen(false);
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>User CRUD Example</Typography>
          
          <Box display="flex" gap={2} mb={3}>
            <TextField
              label="Enter name"
              value={name}
              onChange={e => setName(e.target.value)}
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleCreate}>Add</Button>
          </Box>

          <TextField
            label="Search users"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {currentUsers.length} of {filteredUsers.length} users
          </Typography>

          {loading ? (
            Array.from(new Array(5)).map((_, idx) => (
              <Skeleton key={idx} variant="rectangular" height={56} sx={{ mb: 2, borderRadius: 2 }} />
            ))
          ) : (
            <List>
              {currentUsers.map(user => (
                <ListItem key={user.id} secondaryAction={
                  editingId === user.id ? (
                    <>
                      <Button color="success" variant="contained" size="small" onClick={() => handleUpdate(user.id)} sx={{ mr: 1 }}>Save</Button>
                      <Button color="inherit" variant="outlined" size="small" onClick={() => setEditingId(null)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <IconButton edge="end" aria-label="child" color="primary" onClick={() => {
                        localStorage.setItem(`user_${user.id}`, JSON.stringify(user));
                        navigate(`/child/${user.id}`);
                      }}>
                        <ChildCareIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="edit" onClick={() => startEdit(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" color="error" onClick={() => openDeleteDialog(user)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )
                }>n                  {editingId === user.id ? (
                    <TextField
                      value={editingName}
                      onChange={e => setEditingName(e.target.value)}
                      size="small"
                      sx={{ width: 200 }}
                    />
                  ) : (
                    <>
                      <ListItemAvatar>
                        <Avatar src={user.avatar} alt={user.name} />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={user.name} 
                        secondary={user.child ? user.child.filter(Boolean).join(' • ') : null}
                      />
                    </>
                  )}
                </ListItem>
              ))}
            </List>
          )}

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
