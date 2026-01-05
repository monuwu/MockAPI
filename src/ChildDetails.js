import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, Button, List, ListItem, ListItemText, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ChildDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem(`user_${userId}`) || '{}');

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Button 
              startIcon={<ArrowBackIcon />} 
              onClick={() => navigate('/')}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Typography variant="h4">Child Details</Typography>
          </Box>

          <Typography variant="h6" gutterBottom>
            Parent: {user.name}
          </Typography>

          {user.child && user.child.length > 0 ? (
            <List>
              {user.child.map((childName, index) => (
                childName && (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={`Child ${index + 1}`}
                      secondary={childName}
                    />
                  </ListItem>
                )
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">
              No child data available for this user.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default ChildDetails;
