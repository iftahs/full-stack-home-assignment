import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { Header } from '../components/Layout/Header';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { useTasks } from '../hooks/useTasks';
import { CreateTaskInput, TaskFilters as FilterType } from '../types';

export const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const filters = useMemo<FilterType>(() => ({
    search: searchParams.get('search') || undefined,
    status: searchParams.get('status') || undefined,
    priority: searchParams.get('priority') || undefined,
  }), [searchParams]);

  const { createTask, tasks, loading, updateTask, deleteTask } = useTasks(filters);

  // Fetch tasks when filters change is handled by useTasks hook now

  const handleCreateTask = async (taskData: CreateTaskInput) => {
    await createTask(taskData);
    // fetchTasks is called by socket event or we can call it here if we want immediate feedback before socket
    // But useTasks handles it via socket. 
    // However, for better UX, we might want to close the form immediately.
    setShowForm(false);
  };

  const handleFilterChange = (newFilters: FilterType) => {
    const params: Record<string, string> = {};
    if (newFilters.search) params.search = newFilters.search;
    if (newFilters.status) params.status = newFilters.status;
    if (newFilters.priority) params.priority = newFilters.priority;
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header 
        onNewTask={() => setShowForm(!showForm)}
        showNewTaskButton={true}
        isFormOpen={showForm}
      />

      <div className="max-w-6xl mx-auto p-8">
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
            <TaskForm onSubmit={handleCreateTask} />
          </div>
        )}

        <TaskFilters filters={filters} onFilterChange={handleFilterChange} />

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Tasks</h2>
          <TaskList 
            tasks={tasks}
            loading={loading}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        </div>
      </div>
    </div>
  );
};

