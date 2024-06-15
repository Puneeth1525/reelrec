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
import axios from 'axios';
import CardOverflow from '@mui/joy/CardOverflow';
import Modal from '@mui/joy/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/joy/Button';
import { ModalDialog } from '@mui/joy';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import CustomSnackbar from '../dynamic-snackbar/dynamic-snackbar.component';

const AddToDrawer = ({ open, onClose, movie, user }) => {

    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");

    useEffect(() => {
      const fetchCollections = async () => {
        try {
          const response = await axios.get(
            `http://18.190.29.212:3000/users/${user.uid}`
          );
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


      const handleAddMovieToCollection = async (collectionId) => {
        try {
          const response = await axios.post(
            `http://18.190.29.212:3000/users/${user.uid}/collections/${collectionId}/movies`,
            {
              tmdbId: movie.id,
              title: movie.title,
              posterPath: movie.poster_path,
            }
          );
          console.log(
            `Added movie ${movie.title} to collection ${collectionId}`, response
          );
          handleOpenSnackbar(`Added movie ${movie.title} to collection ${collectionId}`, 'success');
          setTimeout(() => {
            onClose(); // Close the drawer after adding the movie
          }, 2000);
        } catch (error) {
          console.error("Error adding movie to collection", error);
          handleOpenSnackbar('Failed to add movie to collection.', 'error');
        }
      };

      const getRandomPosterPath = (collection) => {
        if (collection.movies.length === 0) {
          return null;
        }
        const randomIndex = Math.floor(Math.random() * collection.movies.length);
        return collection.movies[randomIndex].posterPath;
      };

      const handleModalOpen = () => {
        setIsModalOpen(true);
      };
    
      const handleModalClose = () => {
        setIsModalOpen(false);
        setNewCollectionName(''); // Clear input field when modal closes
      };
    
      const handleCreateNewCollection = async () => {
        try {
          const response = await axios.post(
            `http://18.190.29.212:3000/users/${user.uid}/collections`,
            {
              name: newCollectionName,
            }
          );
          console.log("after collection creation: ",response)
          const collections = response.data.collections;
          const newCollection = collections.find(
            (collection) => collection.name === newCollectionName
          );
          if (!newCollection) {
            throw new Error(
              `Collection with name '${newCollectionName}' not found after creation.`
            );
          }
          const newCollectionId = newCollection._id;    
          await handleAddMovieToCollection(newCollectionId);
    
          handleModalClose();
        } catch (error) {
          console.error('Error creating new collection and adding movie', error);
        }
      };

      const handleOpenSnackbar = (message, severity = 'info') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
      };
    
      const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
      };
    

      
  
  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <Card
        variant="outlined"
        orientation="horizontal"
        sx={{
          "&:hover": { boxShadow: "md" },
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
            sx={{ pointerEvents: "none" }}
          >
            {movie.release_date}
          </Chip>
        </CardContent>
      </Card>
      <Box role="presentation" onClick={onClose} onKeyDown={onClose}>
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <Chip onClick={handleModalOpen} className="chip" color="primary" variant="plain">
            + Add New
          </Chip>
        </Box>
        <Divider />
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography>Error: {error}</Typography>
        ) : (
          <List>
            {collections.map((collection) => (
              <ListItem key={collection._id}>
                <Card
                  className="colCard"
                  key={collection._id}
                  orientation="horizontal"
                  variant="outlined"
                >
                  <CardOverflow>
                    <AspectRatio ratio="1" sx={{ width: 90 }}>
                      <img
                        src={`https://image.tmdb.org/t/p/w500${getRandomPosterPath(
                          collection
                        )}`}
                        alt={collection.name}
                        loading="lazy"
                      />
                    </AspectRatio>
                  </CardOverflow>
                  <CardContent className="fullWidth">
                    <Typography fontWeight="md" textColor="success.plainColor">
                      {collection.name}
                    </Typography>
                    <Typography level="body-sm">
                      {collection.movies.slice(0, 4).map((movie, index) => (
                        <span key={movie._id}>
                          {movie.title}
                          {index < 3 && ", "}
                          {index === 3 && " ..."}
                        </span>
                      ))}
                      {collection.movies.length <= 4 &&
                        collection.movies.length > 0 &&
                        "."}
                    </Typography>
                  </CardContent>
                  <CardOverflow
                    variant="soft"
                    color="primary"
                    sx={{
                      px: 1,
                      writingMode: "vertical-rl",
                      justifyContent: "center",
                      fontSize: "xs",
                      fontWeight: "xl",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      borderLeft: "1px solid",
                      borderColor: "divider",
                    }}
                    onClick={() => handleAddMovieToCollection(collection._id)}
                  >
                    +
                  </CardOverflow>
                </Card>
              </ListItem>
            ))}
          </List>
        )}
        <Divider />
      </Box>

    
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <ModalDialog>
          <DialogTitle>Create new Collection</DialogTitle>
          
          <TextField
            fullWidth
            label="Collection Name"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box display="flex" justifyContent="flex-end">
            <Button onClick={handleModalClose} color="error" mr={2}>
              Cancel
            </Button>
            <Button onClick={handleCreateNewCollection} variant="contained" color="primary">
              Create Collection
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleCloseSnackbar}
      />

    </Drawer>
  );
};

export default AddToDrawer;
