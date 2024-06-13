import React, { Component } from 'react';
import axios from 'axios';
import { Autocomplete, TextField } from '@mui/joy';

class NavSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
    };
    this.cancel = null;
  }

  handleInputChange = (event, newValue) => {
    this.setState({ suggestions: [] });
    if (this.cancel) {
      this.cancel.cancel();
    }

    this.cancel = axios.CancelToken.source();

    console.log("newValue: ",newValue)

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
        cancelToken: this.cancel.token 
      })
      .then(response => {
        this.setState({ suggestions: response.data.results });
      })
      .catch(error => {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          console.error('Error fetching suggestions:', error);
          this.setState({ suggestions: [] });
        }
      });
    } else {
      this.setState({ suggestions: [] });
    }
  };

  render() {
    const { width, placeholder } = this.props;
    const { suggestions } = this.state;

    return (
      <Autocomplete
        options={suggestions}
        style={{ width }}
        getOptionLabel={(option) => option.title}
        filterOptions={(x) => x} 
        onInputChange={this.handleInputChange}
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
              <div style={{ fontSize: "13px", color: "#ffffff" }}>
                {option.overview}
              </div>
            </div>
          </li>
        )}
        noOptionsText={suggestions.length === 0 ? "No results" : ""}
      />
    );
  }
}

export default NavSearch;
