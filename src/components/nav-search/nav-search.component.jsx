import React, { useState } from 'react';
import axios from 'axios';
import { Autocomplete, TextField } from '@mui/joy';
import { useNavigate } from 'react-router-dom';

const NavSearch = ({ width, placeholder }) => {
  const [suggestions, setSuggestions] = useState([]);
  const cancelToken = React.useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (event, newValue) => {
    setSuggestions([]);
    if (cancelToken.current) {
      cancelToken.current.cancel();
    }

    cancelToken.current = axios.CancelToken.source();

    console.log("newValue: ", newValue);

    if (newValue.trim() !== '') {
      axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          query: newValue,
          include_adult: false,
          language: 'en-US',
          page: 1,
        },
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MzViZWFjNGU3N2JmNjhlNDJiMTIyZDhlNTU1MDRmMSIsInN1YiI6IjY2NjM4NDQzNjU2ZWQ3NjYwMDMwMjUzMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VrtNLvUqmEowHSwWw-LZpRz4QOmoPdr9KAROczUKUR4`
        },
        cancelToken: cancelToken.current.token 
      })
      .then(response => {
        setSuggestions(response.data.results);
      })
      .catch(error => {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      });
    } else {
      setSuggestions([]);
    }
  };

  const handleOptionSelect = (event, option) => {
    if (option) {
      navigate(`/home/${option.id}`);
    }
  };

  return (
    <Autocomplete
      options={suggestions}
      style={{ width }}
      getOptionLabel={(option) => option.title}
      filterOptions={(x) => x}
      onInputChange={handleInputChange}
      onChange={handleOptionSelect}
      renderInput={(params) => (
        <TextField {...params} placeholder={placeholder} />
      )}
      renderOption={(props, option, index) => (
        <li
          key={`${option.title}-${index}`}
          {...props}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px",
            width: "100%",
            backgroundColor: "#111",
          }}
        >
          <img
            src={`https://image.tmdb.org/t/p/w92${option.poster_path}`}
            alt={option.title}
            style={{ marginRight: "10px", borderRadius: "4px" }}
          />
          <div>
            <div style={{ fontWeight: "bold", color: "white" }}>
              {option.original_title}
            </div>
            <span style={{ color: "white" }}>
              Release date: {option.release_date}
            </span>
            <div style={{ fontSize: "13px", color: "#ffffff" }}>
              {option.overview}
            </div>
          </div>
        </li>
      )}
      noOptionsText={suggestions.length === 0 ? "No results" : ""}
    />
  );
};

export default NavSearch;
