import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import { Button } from '../components/dsm/Button';
import { TextInput } from '../components/dsm/TextInput';
import { LoginInput } from '../types';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { formData, validate, values } = useForm<LoginInput>({
    email: {
      name: 'email',
      isRequired: true,
      validationMessage: 'Email is required',
    },
    password: {
      name: 'password',
      isRequired: true,
      validationMessage: 'Password is required',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(values.email, values.password);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="Email"
            type="email"
            {...formData.email}
            error={formData.email.validationError}
            required={formData.email.isRequired}
          />
          <TextInput
            label="Password"
            type="password"
            {...formData.password}
            error={formData.password.validationError}
            required={formData.password.isRequired}
          />
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Login
          </Button>
          {error && (
            <div className="mt-2 text-red-500 text-sm text-center">
              {error}
            </div>
          )}
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-600 underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

