import {Schema, Document} from 'mongoose';
import {Status} from '../../utils/enum/status';

export interface ISubtask extends Document {
  subject: string;
  deadline: Date;
  status: Status;
  isDeleted: boolean;
}

const SubtaskSchema = new Schema<ISubtask>({
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
});

export default SubtaskSchema;
