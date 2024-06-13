import { Routes, Route } from "react-router-dom";
import Nav from "./routes/nav/nav.component";
import Home from "./routes/home/home.component";
import Browse from "./routes/browse/browse.component";



const App = () => {
  return (
    <Routes>
    <Route path="/" element={<Nav />} >
      <Route index element={<Home />} />
      <Route path="browse" element={<Browse />} />
    </Route>
    </Routes>
  );
}

export default App;
