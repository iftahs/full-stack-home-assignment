export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  assignments?: unknown[];
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  createdAt: string;
  user?: User;
}

export type ApiResponse = unknown;

export interface TaskFilters {
  status?: string;
  priority?: string;
  search?: string;
}

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;
export type UpdateTaskInput = Partial<CreateTaskInput>;

export interface RegisterInput {
  email: string;
  username: string;
  name: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

