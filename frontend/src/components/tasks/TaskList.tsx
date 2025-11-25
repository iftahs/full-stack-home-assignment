import { useEffect, useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { Button } from '../dsm/Button';
import { TextInput } from '../dsm/TextInput';
import { TextArea } from '../dsm/TextArea';
import { Select } from '../dsm/Select';
import { Task, TaskFilters, UpdateTaskInput } from '../../types';

interface TaskListProps {
  filters: TaskFilters;
}

export const TaskList = ({ filters }: TaskListProps) => {
  const { tasks, loading, deleteTask, updateTask, fetchTasks } = useTasks(filters);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateTaskInput>({});

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleEditClick = (task: Task) => {
    setEditingId(task.id);
    setEditFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
    });
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

  const handleInputChange = (field: keyof UpdateTaskInput, value: string) => {
    setEditFormData({
      ...editFormData,
      [field]: value,
    });
  };

  if (loading) {
    return <div className="p-4">Loading tasks...</div>;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task: Task) => (
        <div
          key={task.id}
          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
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
                    value={editFormData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
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
                    value={editFormData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
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
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <p className="text-gray-600 mt-1">{task.description || ''}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {task.status}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                    {task.priority}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEditClick(task)}
                  className="px-3 py-1"
                  variant="primary"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => deleteTask(task.id)}
                  className="px-3 py-1"
                  variant="secondary"
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

