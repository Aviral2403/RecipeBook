import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const { success } = await login({ email, password });
    if (success) {
      navigate('/recipes');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to your culinary journey</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={onSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                  placeholder="chef@example.com"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  minLength="6"
                  placeholder="Enter your secret recipe"
                />
              </div>
            </div>
            
            <button type="submit" className="auth-btn">
              <span>Login to Kitchen</span>
            </button>
          </form>
          
          <div className="auth-footer">
            <div className="divider">
              <span>New to our kitchen?</span>
            </div>
            <Link to="/register" className="auth-link">Create Your Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;