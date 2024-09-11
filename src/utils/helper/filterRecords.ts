/* eslint-disable @typescript-eslint/no-unused-vars */
import {FlattenMaps} from 'mongoose';
import {ITask} from '../../db/schema/task';

export const filterTask = (task: FlattenMaps<ITask[]> | undefined) => {
  return task
    ?.filter(task => !task.isDeleted)
    ?.map(task => {
      const {isDeleted, ...restOfTask} = task;
      return {
        ...restOfTask,
        subtasks: task.subtasks
          .filter(subtask => !subtask.isDeleted)
          .map(subtask => {
            const {isDeleted, ...restOfSubtask} = subtask;
            return restOfSubtask;
          }),
      };
    });
};
