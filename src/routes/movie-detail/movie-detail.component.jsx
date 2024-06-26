import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../contexts/user.context";
import { useParams } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getRedirectResult } from 'firebase/auth';

import { auth } from '../../firebase-config';
import { signInWithGoogle, signInWithMicrosoft } from '../../signin';
import AddToDrawer from "../../components/drawer/drawer.component";
import "./movie-detail.component.css";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Grid from "@mui/joy/Grid";
import countryNames from "../../countryCodes";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VideoPlayer from "../../components/video-player/video-player.component";

const MovieDetail = () => {
  const [login_token, setToken] = useState(null);
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [videos, setVideos] = useState([])
  const [s3VideoUrl, setS3VideoUrl] = useState(null);
  const [visibleVideos, setVisibleVideos] = useState(3);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, loadingAuth, errorAuth] = useAuthState(auth); // Ensure correct usage of useAuthState


  const token = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MzViZWFjNGU3N2JmNjhlNDJiMTIyZDhlNTU1MDRmMSIsInN1YiI6IjY2NjM4NDQzNjU2ZWQ3NjYwMDMwMjUzMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VrtNLvUqmEowHSwWw-LZpRz4QOmoPdr9KAROczUKUR4`;
  let authFlag = true;

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

        if (user && authFlag) {
          authFlag = false; // Prevent further executions
          user.getIdToken().then(idToken => {
            setToken(idToken);
          });
        }
    

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
  
  const handleAddTo = async () => {
    if (!user) {
      await signInWithGoogle();
      } else {
      setDrawerOpen(true);
      console.log('User is logged in:', user);
      console.log(`Adding ${movie.title} to ${user.email}'s list`);
    }
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
          <button onClick={handleAddTo} className="play-button">
            + Add to
          </button>
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

      {/* <div className="cast-section">
        <h2>Related Video</h2>
        <VideoPlayer videoSrc="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" />
      </div> */}

      {id === "332831" && (
        <div className="cast-section">
          <h2>Related Video</h2>
          <VideoPlayer videoSrc="https://reelrec.s3.us-east-2.amazonaws.com/reels/Yevade_Subramanyam.mkv" />
        </div>
      )}

      {id === "1381" && (
        <div className="cast-section">
          <h2>Related Video</h2>
          {/* <VideoPlayer videoSrc="magnet:?xt=urn:btih:eb557f482eb31f9a8e4729cdb4f1f44c57c7244c&dn=The+Fountian+(2004)&tr=http%3A%2F%2Ftracker.yify-torrents.com%2Fannounce&tr=udp%3A%2F%2Ftracker.yify-torrents.com%2Fannounce&tr=http%3A%2F%2Ftracker.thepiratebay.org%2Fannounce&tr=udp%3A%2F%2Ftracker.thepiratebay.org%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&tr=http%3A%2F%2Ftracker.publicbt.com%2Fannounce&tr=http%3A%2F%2Fgenesis.1337x.org%3A1337%2Fannounce&tr=http%3A%2F%2Fexodus.1337x.org%2Fannounce&tr=http%3A%2F%2Ftracker.ilibr.org%3A6969%2Fannounce&tr=http%3A%2F%2Ftracker.bitreactor.to%3A2710%2Fannounce&tr=http%3A%2F%2Fdenis.stalker.h3q.com%2Fannounce&tr=http%3A%2F%2Ffree.btr.kz%3A8888%2Fannounce&tr=http%3A%2F%2Fsombarato.org%3A6969%2Fannounce&tr=http%3A%2F%2Ftracker.ilibr.org%2Fannounce&tr=http%3A%2F%2Fpow7.com%2Fannounce&tr=http%3A%2F%2Finferno.demonoid.me%3A3415%2Fannounce" data-path="The Fountian (2004)/The.Fountian.Br.x264.YIFY.mkv" /> */}
      <video controls src="magnet:?xt=urn:btih:eb557f482eb31f9a8e4729cdb4f1f44c57c7244c&dn=The+Fountian+(2004)&tr=http%3A%2F%2Ftracker.yify-torrents.com%2Fannounce&tr=udp%3A%2F%2Ftracker.yify-torrents.com%2Fannounce&tr=http%3A%2F%2Ftracker.thepiratebay.org%2Fannounce&tr=udp%3A%2F%2Ftracker.thepiratebay.org%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&tr=http%3A%2F%2Ftracker.publicbt.com%2Fannounce&tr=http%3A%2F%2Fgenesis.1337x.org%3A1337%2Fannounce&tr=http%3A%2F%2Fexodus.1337x.org%2Fannounce&tr=http%3A%2F%2Ftracker.ilibr.org%3A6969%2Fannounce&tr=http%3A%2F%2Ftracker.bitreactor.to%3A2710%2Fannounce&tr=http%3A%2F%2Fdenis.stalker.h3q.com%2Fannounce&tr=http%3A%2F%2Ffree.btr.kz%3A8888%2Fannounce&tr=http%3A%2F%2Fsombarato.org%3A6969%2Fannounce&tr=http%3A%2F%2Ftracker.ilibr.org%2Fannounce&tr=http%3A%2F%2Fpow7.com%2Fannounce&tr=http%3A%2F%2Finferno.demonoid.me%3A3415%2Fannounce" data-path="The Fountian (2004)/The.Fountian.Br.x264.YIFY.mkv"></video>
<script src="https://cdn.jsdelivr.net/npm/@webtor/player-sdk-js/dist/index.min.js" charset="utf-8" async></script>
        </div>
      )}

      https://abra--7537cb52.api.nocturnal-narwhal.buzz/ba3e217c0963b169ec383888f7811aee99abed7e/The%20Fountain%20(2006)%20%5B1080p%5D%20%5BBluRay%5D%20%5B5.1%5D%20%5BYTS.MX%5D%2FThe.Fountain.2006.1080p.BluRay.x264.AAC5.1-%5BYTS.MX%5D.mp4~vod/hls/617bd7644c9acf4dc4274c48724c515f/index.m3u8?user-id=d3b56be3aed302212653b3529ffd93ef&download-id=480e78136c91030385704431f78c2535&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudCI6Ik1vemlsbGEvNS4wIChNYWNpbnRvc2g7IEludGVsIE1hYyBPUyBYIDEwXzE1XzcpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMjYuMC4wLjAgU2FmYXJpLzUzNy4zNiIsInJlbW90ZUFkZHJlc3MiOiIxNzMuMTg2LjEzLjE0MyIsImRvbWFpbiI6Inl0cy5teCIsImV4cCI6MTcxOTcxODA5OCwic2Vzc2lvbklEIjoiMVdnUnF5TlRjc1ZfUXM0SnpMTGJXeTlUcEJwLVBQdnkiLCJyYXRlIjoiMTBNIiwicm9sZSI6Im5vYm9keSJ9.FqI1YwhLxZmvyqAi5pLjPKmDgKlioEv7NWRoOPWSOko&api-key=8acbcf1e-732c-4574-a3bf-27e6a85b86f1


  
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
                <span>
                  <b>{countryNames[countryCode]}</b>- {countryCode}
                </span>
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
      <AddToDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        movie={movie}
        user={user ? user : null}
      />
    </div>
  );
};

export default MovieDetail;
