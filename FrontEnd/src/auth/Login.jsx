import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff, X } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { baseUrl } from '../utils/apiConstant.js';
// Common Button component for consistency
const Button = ({ children, onClick, variant = 'primary', icon: Icon, fullWidth = true, type = 'button' }) => {
  let classes = "flex items-center justify-center space-x-2 py-3 px-4 text-sm font-semibold rounded-lg transition duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";

  if (fullWidth) {
    classes += " w-full";
  }

  if (variant === 'primary') {
    classes += " bg-black text-white hover:bg-gray-800 focus:ring-gray-900 border border-black";
  } else if (variant === 'secondary') {
    // For Google button
    classes += " bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300 border border-gray-300";
  } else if (variant === 'link') {
    classes += " bg-transparent text-black hover:text-gray-600 focus:ring-transparent focus:ring-offset-0";
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
    </button>
  );
};

// Input Field Component
const InputField = ({ label, type = 'text', id, icon: Icon, value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {Icon && <Icon className="w-5 h-5 text-gray-400" />}
        </div>
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-black focus:border-black transition duration-150"
        />
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
};

// --- Standalone Login Form Component ---
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${baseUrl}/auth/login`,
        {
          email,
          password
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      if (res.data.success) {
        // Store token in localStorage
        if (res.data.token) {
          localStorage.setItem('access_token', res.data.token);
        }
        navigate("/dashBoard");
      } else {
        setMessage(res.data.message || "Invalid Email Or Password!");
        setTimeout(() => setMessage(''), 3000);
      }

    } catch (err) {
      setMessage(
        err?.response?.data?.message || "Something went wrong!"
      );
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-2xl border border-gray-200 transition-all duration-300">
      <form onSubmit={handleLogin} className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-500">Sign in to continue to your account.</p>

        {message && (
          <div className="bg-gray-100 border border-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-between text-sm">
            <span>{message}</span>
            <button type="button" onClick={() => setMessage('')}><X className="w-4 h-4" /></button>
          </div>
        )}

        <InputField
          label="Email Address"
          id="login-email"
          type="email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <InputField
          label="Password"
          id="login-password"
          type="password"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        <Button type="submit" icon={LogIn}>
          Log In
        </Button>

        {/* Removed 'Sign up now' button */}
        <div className="text-center text-sm text-gray-500 pt-2">
          New here? Please visit the <Link to={'/signUp'}><span className='font-bold underline '>SignUp</span></Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm

