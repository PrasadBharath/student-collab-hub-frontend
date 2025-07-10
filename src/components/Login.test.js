import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';

// Mock the particles.js library
global.particlesJS = jest.fn();

describe('Login Component', () => {
  const mockOnLoginSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form by default', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    
    expect(screen.getByText('Student Collaboration Hub')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('switches to signup form when signup tab is clicked', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    
    const signupTab = screen.getByText('Signup');
    fireEvent.click(signupTab);
    
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument();
  });

  test('switches to login form when login tab is clicked', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    
    // First switch to signup
    const signupTab = screen.getByText('Signup');
    fireEvent.click(signupTab);
    
    // Then switch back to login
    const loginTab = screen.getByText('Login');
    fireEvent.click(loginTab);
    
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('handles form input changes', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('shows signup form with all required fields', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    
    // Switch to signup
    const signupTab = screen.getByText('Signup');
    fireEvent.click(signupTab);
    
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Select Department')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Select Year')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument();
  });

  test('initializes particles.js on mount', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    
    expect(global.particlesJS).toHaveBeenCalledWith('particles-js', expect.any(Object));
  });
}); 