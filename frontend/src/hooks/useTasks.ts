import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Task, TaskFilters, CreateTaskInput, UpdateTaskInput } from '../types';
import { io } from 'socket.io-client';

export const useTasks = (filters?: TaskFilters) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);

    // Clean filters to remove undefined/null values
    const cleanFilters: Record<string, string> = {};
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          cleanFilters[key] = value;
        }
      });
    }

    const queryParams = new URLSearchParams(cleanFilters).toString();
    try {
      const data = await api.get<Task[]>(`/tasks?${queryParams}`);
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    // Connect to Socket.IO server
    const socketUrl = import.meta.env.VITE_API_URL
      ? new URL(import.meta.env.VITE_API_URL).origin
      : 'http://localhost:3000';

    const socket = io(socketUrl);

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    // Re-fetch tasks on any change to ensure consistency with filters
    socket.on('taskCreated', () => {
      fetchTasks();
    });

    socket.on('taskUpdated', () => {
      fetchTasks();
    });

    socket.on('taskDeleted', () => {
      fetchTasks();
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchTasks]);

  const createTask = async (taskData: CreateTaskInput) => {
    const newTask = await api.post<Task>('/tasks', taskData);
    // Optimistic update or wait for socket? 
    // We'll wait for socket or re-fetch to handle it, but for UI responsiveness we can append.
    // However, since we re-fetch on socket event, we might get a double update if we append here.
    // Let's just return the task and let the socket/fetch handle the list update.
    return newTask;
  };

  const updateTask = async (id: string, taskData: UpdateTaskInput) => {
    const updatedTask = await api.put<Task>(`/tasks/${id}`, taskData);
    return updatedTask;
  };

  const deleteTask = async (id: string) => {
    await api.delete<Task>(`/tasks/${id}`);
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
  };
};

