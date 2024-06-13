import { Routes, Route } from 'react-router-dom';
import Nav from './routes/nav/nav.component';
import Browse from './routes/browse/browse.component';
import MovieDetail from './routes/movie-detail/movie-detail.component'; // Ensure correct import

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Nav />}>
        <Route index element={<Browse />} />
        <Route path="home/:id" element={<MovieDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
