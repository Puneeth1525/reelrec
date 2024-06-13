import { Component } from "react";
import './home.component.css'

class Home extends Component {
    render() {
        return (
            <div className="container">
            <div className="movie-banner">
                {/* <nav>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#" className="active">Movies</a></li>
                        <li><a href="#">Series</a></li>
                        <li><a href="#">My List</a></li>
                    </ul>
                </nav> */}
                <img src="https://via.placeholder.com/1280x720" alt="The Martian" />
                <div className="movie-info">
                    <h1>The Martian</h1>
                    <button className="play-button">▶ Play</button>
                    <button className="wishlist-button">+ Add to Wish List</button>
                </div>
            </div>
            <div className="movie-details">
                <div className="movie-meta">
                    <p>English | Science Fiction | 2015 | 2hrs 15mins</p>
                </div>
                <p className="movie-description">
                    An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal to Earth that he is alive.
                </p>
                <div className="movie-genre">
                    <span>Genre</span>
                    <span className="genre-tag">Adventure</span>
                    <span className="genre-tag">Drama</span>
                    <span className="genre-tag">Sci-Fi</span>
                </div>
                <div className="movie-rating">
                    <span>Rating</span>
                    <span className="rating-tag">12+</span>
                </div>
            </div>
            <div className="cast-section">
                <h2>Cast</h2>
                <div className="cast-list">
                    <div className="cast-member">
                        <img src="https://via.placeholder.com/100x100" alt="Matt Damon" />
                        <p>Matt Damon</p>
                        <p>Actor</p>
                    </div>
                    <div className="cast-member">
                        <img src="https://via.placeholder.com/100x100" alt="Jessica Chastain" />
                        <p>Jessica Chastain</p>
                        <p>Actor</p>
                    </div>
                    <div className="cast-member">
                        <img src="https://via.placeholder.com/100x100" alt="Kate Mara" />
                        <p>Kate Mara</p>
                        <p>Actor</p>
                    </div>
                    <div className="cast-member">
                        <img src="https://via.placeholder.com/100x100" alt="Chiwetel Ejiofor" />
                        <p>Chiwetel Ejiofor</p>
                        <p>Actor</p>
                    </div>
                    <div className="cast-member">
                        <img src="https://via.placeholder.com/100x100" alt="Sebastian Stan" />
                        <p>Sebastian Stan</p>
                        <p>Actor</p>
                    </div>
                    <div className="cast-member">
                        <img src="https://via.placeholder.com/100x100" alt="Jeff Daniels" />
                        <p>Jeff Daniels</p>
                        <p>Actor</p>
                    </div>
                    <div className="cast-member">
                        <img src="https://via.placeholder.com/100x100" alt="Michael Peña" />
                        <p>Michael Peña</p>
                        <p>Actor</p>
                    </div>
                    <div className="see-all">
                        {/* <a href="#">See all</a> */}
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

  
  export default Home;
  