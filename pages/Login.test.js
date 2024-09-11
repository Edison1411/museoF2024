import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from 'd:/Documentos Wind/Archivos de usuario/OneDrive/Escritorio/museum_project/nextly-template-main_v2/pages/login.js';
import { useAuth } from 'd:/Documentos Wind/Archivos de usuario/OneDrive/Escritorio/museum_project/nextly-template-main_v2/hooks/useAuth';
import { useRouter } from 'next/router';

jest.mock('d:/Documentos Wind/Archivos de usuario/OneDrive/Escritorio/museum_project/nextly-template-main_v2/hooks/useAuth');
jest.mock('next/router');

describe('Login Component', () => {
  const mockLogin = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({ login: mockLogin });
    useRouter.mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    // Act
    render(<Login />);

    // Assert
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows error if email or password is missing', async () => {
    // Arrange
    render(<Login />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Please enter both email and password.');
    });
  });

  test('shows error if login fails', async () => {
    // Arrange
    mockLogin.mockRejectedValue(new Error('Login failed'));
    render(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    // Act
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to log in. Please check your email and password.');
    });
  });

  test('redirects to /admin on successful login', async () => {
    // Arrange
    mockLogin.mockResolvedValue({});
    render(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    // Act
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Assert
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin');
    });
  });

  test('toggles password visibility', () => {
    // Arrange
    render(<Login />);
    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole('button', { name: /show/i });

    // Act
    fireEvent.click(toggleButton);

    // Assert
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Act
    fireEvent.click(toggleButton);

    // Assert
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('disables login button when loading', async () => {
    // Arrange
    mockLogin.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 1000)));
    render(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    // Act
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Assert
    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
  });
});