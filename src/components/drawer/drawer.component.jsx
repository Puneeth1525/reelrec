// src/components/AddToDrawer/AddToDrawer.js
import React, { useState, useEffect } from 'react';
import Box from '@mui/joy/Box';
import Drawer from '@mui/joy/Drawer';
import List from '@mui/joy/List';
import Divider from '@mui/joy/Divider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import AspectRatio from '@mui/joy/AspectRatio';
import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import axios from 'axios'

const AddToDrawer = ({ open, onClose, movie, user }) => {

    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCollections = async () => {
          try {
            const response = await axios.get(`http://18.190.29.212:3000/api/users/${user.uid}`);
            setCollections(response.data.collections);
            setLoading(false);
          } catch (error) {
            setError(error.message);
            setLoading(false);
          }
        };
    
        if (open && user) {
          fetchCollections();
        }
      }, [open, user]);

      
    
      console.log("collectioins",collections)

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
    >
      <Card
        variant="outlined"
        orientation="horizontal"
        sx={{
          '&:hover': { boxShadow: 'md' },
        }}
      >
        <AspectRatio ratio="1" sx={{ width: 90 }}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
          />
        </AspectRatio>
        <CardContent>
          <Typography level="title-lg" id="card-description">
            {movie.title}
          </Typography>
          {/* <Typography level="body-sm" aria-describedby="card-description" mb={1}>
            {movie.overview}
          </Typography> */}
          <Chip
            variant="outlined"
            color="primary"
            size="sm"
            sx={{ pointerEvents: 'none' }}
          >
            {movie.release_date}
          </Chip>
        </CardContent>
      </Card>

      <Box
        role="presentation"
        onClick={onClose}
        onKeyDown={onClose}
      >
        <List>
          <ListItem>
            <ListItemButton>Add to Collection 1</ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>Add to Collection 2</ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>Add to Collection 3</ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem>
            <ListItemButton>Create New Collection</ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default AddToDrawer;
