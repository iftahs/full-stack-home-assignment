import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { Button } from '../components/dsm/Button';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { CreateTaskInput, TaskFilters } from '../types';

export const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [filters] = useState<TaskFilters>({});
  const { createTask, fetchTasks } = useTasks();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleCreateTask = async (taskData: CreateTaskInput) => {
    await createTask(taskData);
    await fetchTasks();
    setShowForm(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {user && (
              <p className="text-sm text-gray-600 mt-1">
                Welcome, {user.name || user.username}!
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowForm(!showForm)}
              variant="primary"
            >
              {showForm ? 'Cancel' : 'New Task'}
            </Button>
            <Button
              onClick={handleLogout}
              variant="secondary"
            >
              Logout
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <TaskForm onSubmit={handleCreateTask} />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
          <TaskList filters={filters} />
        </div>
      </div>
    </div>
  );
};

