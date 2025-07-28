import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecipeProvider } from './context/RecipeContext';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing/Landing';
import Home from './pages/Home/Home';
import RecipeDetail from './pages/RecipeDetail/RecipeDetail';
import Navbar from './components/Navbar/Navbar';
import SavedRecipes from './components/SavedRecipes/SavedRecipes';
import './App.css';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <RecipeProvider>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/recipes" element={<Home />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/saved"
                element={
                  <PrivateRoute>
                    <SavedRecipes />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </RecipeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;