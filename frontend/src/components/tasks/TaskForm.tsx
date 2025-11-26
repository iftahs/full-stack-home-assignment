import { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { Button } from '../dsm/Button';
import { TextInput } from '../dsm/TextInput';
import { TextArea } from '../dsm/TextArea';
import { Select } from '../dsm/Select';
import { Task, CreateTaskInput } from '../../types';

interface TaskFormProps {
  onSubmit: (data: CreateTaskInput) => Promise<void>;
  initialData?: Task;
}

interface TaskFormValues {
  title: string;
  description: string;
  status: string;
  priority: string;
}

export const TaskForm = ({ onSubmit, initialData }: TaskFormProps) => {
  const { formData, validate, values } = useForm<TaskFormValues>({
    title: {
      name: 'title',
      initialValue: initialData?.title,
      isRequired: true,
      validationMessage: 'Title is required',
    },
    description: {
      name: 'description',
      initialValue: initialData?.description,
      isRequired: true,
      validationMessage: 'Description is required',
    },
    status: {
      name: 'status',
      initialValue: initialData?.status || 'TODO',  
      isRequired: true,
      validationMessage: 'Status is required',
    },
    priority: {
      name: 'priority',
      initialValue: initialData?.priority || 'MEDIUM',
      isRequired: true,
      validationMessage: 'Priority is required',
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);
    try {
      await onSubmit(values);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        label="Title"
        type="text"
        required={formData.title.isRequired}
        error={formData.title.validationError}
        {...formData.title}
      />
      <TextArea
        label="Description"
        required={formData.description.isRequired}
        error={formData.description.validationError}
        {...formData.description}
        rows={4}
      />
      <Select
        label="Status"
        required={formData.status.isRequired}
        error={formData.status.validationError}
        value={formData.status.value}
        onChange={(value) => formData.status.onChange({ target: { value } } as any)}
        options={[
          { label: 'TO DO', value: 'TODO' },
          { label: 'IN PROGRESS', value: 'IN_PROGRESS' },
          { label: 'DONE', value: 'DONE' },
        ]}
      />
      <Select
        label="Priority"
        required={formData.priority.isRequired}
        error={formData.priority.validationError}
        value={formData.priority.value}
        onChange={(value) => formData.priority.onChange({ target: { value } } as any)}
        options={[
          { label: 'LOW', value: 'LOW' },
          { label: 'MEDIUM', value: 'MEDIUM' },
          { label: 'HIGH', value: 'HIGH' },
        ]}
      />
      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
      >
        {initialData ? 'Update Task' : 'Create Task'}
      </Button>
    </form>
  );
};

