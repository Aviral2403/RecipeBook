import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const { success } = await register({ name, email, password });
    if (success) {
      navigate('/recipes');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">Join Our Kitchen</h2>
            <p className="auth-subtitle">Start your culinary adventure today</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={onSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Chef Name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  required
                  placeholder="Your culinary name"
                />
              </div>
            </div>
            
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
                  placeholder="Create your secret recipe"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={onChange}
                  required
                  minLength="6"
                  placeholder="Confirm your secret recipe"
                />
              </div>
            </div>
            
            <button type="submit" className="auth-btn">
              <span>Start Cooking</span>
            </button>
          </form>
          
          <div className="auth-footer">
            <div className="divider">
              <span>Already have an account?</span>
            </div>
            <Link to="/login" className="auth-link">Sign In Here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;