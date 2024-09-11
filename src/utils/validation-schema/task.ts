import {z} from 'zod';
import {Status} from '../../utils/enum/status';

export const createTaskSchema = z.object({
  subject: z.string(),
  deadline: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Invalid date format. Expected YYYY-MM-DD',
  }),
  status: z.enum([...(Object.values(Status) as [Status, ...Status[]])]),
});
