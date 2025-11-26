import { useState } from 'react';
import { Spinner } from '../dsm/Spinner';
import { Button } from '../dsm/Button';
import { TextInput } from '../dsm/TextInput';
import { TextArea } from '../dsm/TextArea';
import { Select } from '../dsm/Select';
import { Task, UpdateTaskInput } from '../../types';
import { EllipsisVerticalIcon } from '../../assets/icons/EllipsisVerticalIcon';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  updateTask: (id: string, taskData: UpdateTaskInput) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
}

export const TaskList = ({ tasks, loading, updateTask, deleteTask }: TaskListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateTaskInput>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleEditClick = (task: Task) => {
    setEditingId(task.id);
    setEditFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
    });
    setOpenMenuId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleSaveEdit = async (taskId: string) => {
    try {
      await updateTask(taskId, editFormData);
      setEditingId(null);
      setEditFormData({});
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteClick = async (taskId: string) => {
    await deleteTask(taskId);
    setOpenMenuId(null);
  };

  const handleInputChange = (field: keyof UpdateTaskInput, value: string) => {
    setEditFormData({
      ...editFormData,
      [field]: value,
    });
  };

  const toggleMenu = (taskId: string) => {
    setOpenMenuId(openMenuId === taskId ? null : taskId);
  };

  // Only show full loading state if we have no tasks to show (initial load)
  if (loading && tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Spinner size="md" className="text-blue-500" />
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading tasks...</p>
      </div>
    );
  }

  if (!loading && tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200">
        <img 
          src="/src/assets/no-tasks.png" 
          alt="No tasks" 
          className="w-64 h-64 object-contain mb-4"
        />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No tasks found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          Looks like you're all caught up! Create a new task to get started or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 transition-opacity duration-200 ${loading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
      {tasks.map((task: Task) => (
        <div
          key={task.id}
          className="py-4 px-0 relative border-b border-gray-100 dark:border-gray-700 last:border-0"
        >
          {editingId === task.id ? (
            // Edit mode
            <div className="space-y-4">
              <div>
                <TextInput
                  label="Title"
                  value={editFormData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>
              <div>
                <TextArea
                  label="Description"
                  value={editFormData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Status"
                    value={editFormData.status || ''}
                    onChange={(value) => handleInputChange('status', value)}
                    options={[
                      { label: 'TO DO', value: 'TODO' },
                      { label: 'IN PROGRESS', value: 'IN_PROGRESS' },
                      { label: 'DONE', value: 'DONE' },
                    ]}
                  />
                </div>
                <div>
                  <Select
                    label="Priority"
                    value={editFormData.priority || ''}
                    onChange={(value) => handleInputChange('priority', value)}
                    options={[
                      { label: 'LOW', value: 'LOW' },
                      { label: 'MEDIUM', value: 'MEDIUM' },
                      { label: 'HIGH', value: 'HIGH' },
                    ]}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={handleCancelEdit}
                  className="px-4 py-2"
                  variant="neutral"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSaveEdit(task.id)}
                  className="px-4 py-2"
                  variant="success"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            // View mode
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-8 md:pr-0">
                <h3 className="font-semibold text-lg dark:text-white">{task.title}</h3>
                <p className="text-gray-600 mt-1 dark:text-gray-300">{task.description || ''}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm dark:bg-blue-900 dark:text-blue-200">
                    {task.status.replace(/_/g, ' ')}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm dark:bg-gray-700 dark:text-gray-300">
                    {task.priority}
                  </span>
                </div>
              </div>
              
              {/* Desktop Actions */}
              <div className="hidden md:flex gap-2">
                <Button
                  onClick={() => handleEditClick(task)}
                  className="px-3 py-1"
                  variant="primary"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteClick(task.id)}
                  className="px-3 py-1"
                  variant="secondary"
                >
                  Delete
                </Button>
              </div>

              {/* Mobile Actions (3-dots menu) */}
              <div className="md:hidden absolute top-4 right-4">
                <button
                  onClick={() => toggleMenu(task.id)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <EllipsisVerticalIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </button>
                
                {openMenuId === task.id && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setOpenMenuId(null)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border dark:border-gray-700">
                      <button
                        onClick={() => handleEditClick(task)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(task.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 last:rounded-b-md"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

