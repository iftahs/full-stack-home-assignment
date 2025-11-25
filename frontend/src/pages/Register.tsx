import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import { Button } from '../components/dsm/Button';
import { TextInput } from '../components/dsm/TextInput';
import { RegisterInput } from '../types';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { formData, validate, values } = useForm<RegisterInput>({
    email: {
      name: 'email',
      isRequired: true,
      validationMessage: 'Email is required',
    },
    username: {
      name: 'username',
      isRequired: true,
      validationMessage: 'Username is required',
    },
    name: {
      name: 'name',
      isRequired: true,
      validationMessage: 'Name is required',
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
      await register(values);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="Email"
            type="email"
            {...formData.email}
            error={formData.email.validationError}
            required={formData.email.isRequired}
          />
          <TextInput
            label="Username"
            type="text"
            {...formData.username}
            error={formData.username.validationError}
            required={formData.username.isRequired}
          />
          <TextInput
            label="Name"
            type="text"
            {...formData.name}
            error={formData.name.validationError}
            required={formData.name.isRequired}
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
            Register
          </Button>
          {error && (
            <div className="mt-2 text-red-500 text-sm text-center">
              {error}
            </div>
          )}
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-600 underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

