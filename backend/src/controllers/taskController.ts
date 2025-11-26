import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

import { getIO } from '../socket';

export const getTasks = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const { search, status, priority } = req.query;

  const whereClause: any = {
    userId,
  };

  if (status) {
    whereClause.status = status as string;
  }

  if (priority) {
    whereClause.priority = priority as string;
  }

  if (search) {
    whereClause.OR = [
      { title: { contains: search as string } }, // Removed mode: 'insensitive' for compatibility if not configured
      { description: { contains: search as string } },
    ];
  }

  const tasks = await prisma.task.findMany({
    where: whereClause,
    include: {
      user: true,
      assignments: {
        include: {
          user: true
        }
      }
    }
  });

  res.json(tasks);
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { title, description, status, priority } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        userId: userId!,
      },
      include: {
        user: true,
        assignments: {
          include: {
            user: true
          }
        }
      }
    });

    getIO().emit('taskCreated', task);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
      },
      include: {
        user: true,
        assignments: {
          include: {
            user: true
          }
        }
      }
    });

    getIO().emit('taskUpdated', task);
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id },
    });

    getIO().emit('taskDeleted', id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            name: true,
          },
        },
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                name: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

