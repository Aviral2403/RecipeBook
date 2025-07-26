import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecipeProvider } from "./context/RecipeContext";
import Landing from "./pages/Landing/Landing";
import Home from "./pages/Home/Home";
import RecipeDetail from "./pages/RecipeDetail/RecipeDetail";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import SavedRecipes from "./components/SavedRecipes/SavedRecipes";

function App() {
  return (
    <RecipeProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/recipes" element={<Home />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/saved" element={<SavedRecipes />} />
          </Routes>
        </div>
      </Router>
    </RecipeProvider>
  );
}

export default App;