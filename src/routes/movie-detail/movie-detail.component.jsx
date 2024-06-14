import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./movie-detail.component.css";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Grid from "@mui/joy/Grid";
import countryNames from "../../countryCodes";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [videos, setVideos] = useState([])

  const token = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MzViZWFjNGU3N2JmNjhlNDJiMTIyZDhlNTU1MDRmMSIsInN1YiI6IjY2NjM4NDQzNjU2ZWQ3NjYwMDMwMjUzMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VrtNLvUqmEowHSwWw-LZpRz4QOmoPdr9KAROczUKUR4`;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            params: {
              language: "en-US",
            },
            headers: {
              Authorization: token,
            },
          }
        );

        const creditsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const providersResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/watch/providers`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const videosResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        setCast(creditsResponse.data.cast);
        setCrew(creditsResponse.data.crew);
        setProviders(providersResponse.data.results);
        setVideos(videosResponse.data.results);

        setMovie({
          ...movieResponse.data,
          credits: creditsResponse.data,
        });

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const remainingVideos = videos.slice(1);


  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading movie details.</div>;
  }

  const castSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 13,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 9,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const crewSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 13,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 9,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };


  return (
    <div className="container">
      <div className="movie-banner">
        <img
          className="banner-image"
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
          alt={movie.title}
        />
        <div className="movie-info">
          <p className="movie-title">{movie.title}</p>
          <button className="play-button">+ Add to</button>
          <button className="wishlist-button">Rate</button>
        </div>
      </div>
      <div className="movie-details">


        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{ flexGrow: 1 }}
        >
          
            <Grid sm={6}>
            <div className="movie-meta">
              <p>{`Language: ${movie.original_language} | ${new Date(
                movie.release_date
              ).getFullYear()} | ${Math.floor(movie.runtime / 60)}hrs ${
                movie.runtime % 60
              }mins`}</p>
            </div>
            <p className="movie-description">{movie.overview}</p>
            </Grid>

            <Grid sm={1}>

            <div className="movie-genre">
              <span>Genre</span>
              {movie.genres.map((genre) => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
            <div className="movie-rating">
              <span>Rating</span>
              <span className="rating-tag">{movie.adult ? "18+" : "PG"}</span>
            </div>

            </Grid>
        
        </Grid>
      </div>
      <div className="cast-section">
          <h2>Available on</h2>
          <div className="country-dropdown">
            <Select
              placeholder="Select a country"
              value={selectedCountry}
              onChange={(event, newValue) => setSelectedCountry(newValue)}
            >
              {Object.keys(providers).map((countryCode) => (
                <Option key={countryCode} value={countryCode}>
                  <span><b>{countryNames[countryCode]}</b>- {countryCode}</span>
                </Option>
              ))}
            </Select>
          </div>
          {selectedCountry &&
            providers[selectedCountry] &&
            providers[selectedCountry].flatrate && (
              <div className="cast-list">
                {providers[selectedCountry].flatrate.map((provider) => (
                  <div key={provider.provider_id} className="cast-member">
                    <img
                      src={`https://image.tmdb.org/t/p/w100_and_h100_face${provider.logo_path}`}
                      alt={provider.provider_name}
                    />
                    <p>{provider.provider_name}</p>
                  </div>
                ))}
              </div>
            )}
        </div>

        <div className="cast-section">
        <h2>Videos</h2>
        <div className="cast-list">
          {videos.map((member) => (
            <div key={member.id} className="cast-member">
            <iframe
                width="360"
                height="180"
                src={`https://www.youtube.com/embed/${member.key}`}
                title={member.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <b>
                <p>{member.name}</p>
              </b>
            </div>
          ))}
        </div>
      </div>

      <div className="cast-section">
        <h2>Cast</h2>
        <Slider {...castSliderSettings}>
          {cast.map((member) => (
            <div key={member.id} className="cast-member">
              <img
                src={`https://image.tmdb.org/t/p/w100_and_h100_face${member.profile_path}`}
                alt={member.name}
              />
              <p>{member.name}</p>
              <b>
                <p>{member.character}</p>
              </b>
            </div>
          ))}
        </Slider>
      </div>


      <div className="cast-section">
        <h2>Crew</h2>
        <Slider {...crewSliderSettings}>
          {crew.map((member) => (
            <div key={member.id} className="cast-member">
              {member.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w100_and_h100_face${member.profile_path}`}
                  alt={member.name}
                />
              ) : (
                <div className="placeholder-image">
                  <b>No Image</b>
                </div>
              )}{" "}
              <p>{member.name}</p>
              <b>
                <p>{member.job}</p>
              </b>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default MovieDetail;
