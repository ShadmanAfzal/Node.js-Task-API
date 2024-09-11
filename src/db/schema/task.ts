import {Schema, Types} from 'mongoose';
import {Status} from '../../utils/enum/status';
import SubtaskSchema, {ISubtask} from './subtask';

export interface ITask extends Document {
  _id: Types.ObjectId;
  subject: string;
  deadline: Date;
  status: Status;
  isDeleted: boolean;
  subtasks: ISubtask[];
}

const TaskSchema = new Schema<ITask>({
  subject: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.PENDING,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  subtasks: {
    type: [SubtaskSchema],
    default: [],
  },
});

export default TaskSchema;
