import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { baseUrl } from '../utils/apiConstant.js';

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


// --- Standalone Sign Up Form Component ---
const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Error: Passwords do not match!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    // Dummy Signup Logic
    console.log("Signing up with:", { name, email, password });
    const res = await axios.post(`${baseUrl}/auth/signUp`, {
      name,
      email,
      password
    })

    if (res.data.success) {
      // Email Verification Code Sent Successfully
      navigate("/otpVerify");
    }
    setMessage(`Signing up ${name}... (Verification link sent, check console for details)`);
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };



  return (
    <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-2xl border border-gray-200 transition-all duration-300">
      <form onSubmit={handleSignup} className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-500">Get started by creating a new account.</p>

        {message && (
          <div className="bg-gray-100 border border-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-between text-sm">
            <span>{message}</span>
            <button type="button" onClick={() => setMessage('')}><X className="w-4 h-4" /></button>
          </div>
        )}



        {/* Name Input */}
        <InputField
          label="Full Name"
          id="signup-name"
          type="text"
          icon={User}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
        />

        {/* Email Input */}
        <InputField
          label="Email Address"
          id="signup-email"
          type="email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        {/* Password Input */}
        <InputField
          label="Password"
          id="signup-password"
          type="password"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
        />

        {/* Confirm Password Input */}
        <InputField
          label="Confirm Password"
          id="signup-confirm-password"
          type="password"
          icon={Lock}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
        />

        <Button type="submit" icon={UserPlus}>
          Create Account
        </Button>

        {/* Removed 'Log in here' button */}
        <div className="text-center text-sm text-gray-500 pt-2">
          Already have an account? Please visit the <Link to={'/login'}><span className='font-bold underline'>Login.</span></Link>
        </div>
      </form>
    </div>
  );
};

export default SignupForm