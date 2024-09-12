import {z} from 'zod';
import {Status} from '../../utils/enum/status';

// Zod schema for creating tasks
export const createTaskSchema = z.object({
  subject: z.string(),
  deadline: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Invalid date format. Expected YYYY-MM-DD',
  }),
  status: z.enum([...(Object.values(Status) as [Status, ...Status[]])]),
});

// Zod schema for creating subtasks
export const createSubTaskSchema = z.object({
  subtasks: z
    .array(
      z.object({
        subject: z.string(),
        deadline: z.string().refine(date => !isNaN(Date.parse(date)), {
          message: 'Invalid date format. Expected YYYY-MM-DD',
        }),
        status: z.enum([...(Object.values(Status) as [Status, ...Status[]])]),
      })
    )
    .min(1),
});

// Zod schema for updating subtasks
export const updateSubTaskSchema = z.object({
  subtasks: z
    .array(
      z.object({
        _id: z.string(),
        subject: z.string(),
        deadline: z.string().refine(date => !isNaN(Date.parse(date)), {
          message: 'Invalid date format. Expected YYYY-MM-DD',
        }),
        status: z.enum([...(Object.values(Status) as [Status, ...Status[]])]),
      })
    )
    .min(1),
});
