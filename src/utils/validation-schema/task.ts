import {Status} from 'utils/enum/status';
import {z} from 'zod';

export const createUserSchema = z.object({
  subject: z.string({
    message: 'subject is required',
    invalid_type_error: 'invalid type of message, expected String datatype',
  }),
  deadline: z.date({
    message: 'deadline is required',
    invalid_type_error: 'invalid type of deadline, expected Date datatype',
  }),
  status: z.enum([...(Object.values(Status) as [Status, ...Status[]])], {
    message: 'status is required',
  }),
});
