import {Injectable} from '@angular/core';
import {ApiService} from './api/api.service';
import {map, tap} from 'rxjs/operators';
import {IInteractionDataFetcherParams} from "../modules/custom-ag-grid/ag-grid-base";
import {IApiResponseBody} from '../models/api-response-body';
import {ITask} from '../models/task';
import {DropdownGuids} from '../models/dropdown-guids.enum';
import {Observable} from 'rxjs';
import {IServerDropdownOption} from '../models/server-dropdown';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

    guids = DropdownGuids;

  static adapt(task): ITask {
        return {
                DocId: task.DocId,
                parentId: task.parent_id,
                subject: task.subject,
                body: task.body,
                method: task.method,
                createdDateTime: task.createdDateTime,
                completedDateTime: task.completedDateTime,
                dueDateTime: task.dueDateTime,
                startDateTime: task.startDateTime,
                status: task.status,
                priority: task.priority,
                importance: task.importance,
                sensitivity: task.sensitivity,
                assignedTo: task.assignedTo,
                categories: task.categories,
                reminder: task.reminder,
                reminderDateTime: task.reminderDateTime,
                percentComplete: task.percentComplete,
                recurrence: task.recurrence,
                hasAttachments: task.hasAttachments,
                history: task.history,
                outlook: task.outlook,
                createdBy: task.history && task.history.created_by ? task.history.created_by : task.created_by,
                createdByName: task.history && task.history.created_by_name ? task.history.created_by_name : task.created_by_name,
                createdOn: task.history && task.history.created_on ? task.history.created_on : task.created_on,
            };
    }

  constructor(private api: ApiService) { }

  create(task: Partial<ITask>) {
      return this.api.post({endpoint: `/task`, body: task, useAuthUrl: true})
          .pipe(
              map(res => res as IApiResponseBody),
              map((res: IApiResponseBody) => {
                  res.Data = TaskService.adapt(res.Data);
                  return res;
              })
          );
  }

    getAll(contactId: string, params?: IInteractionDataFetcherParams) {
        console.log(contactId)
        console.log(params)
        return this.api.get({
            endpoint: `/tasks/${contactId || ''}`,
            params: {
                rowCount: params.perPage,
                offset: params.offset,
                ...(params.qsearch ? {qsearch: params.qsearch} : {} ),
                ...(params.type && {type: params.type} ),
            },
            useAuthUrl: true,
        }).pipe(
            map(res => res as IApiResponseBody),
        );
    }

    getAllAdapted(contactId: string, params?: IInteractionDataFetcherParams) {
      return this.getAll(contactId, params).pipe(
          map((res: IApiResponseBody) => {
              res.Data = res.Data && res.Data.map(note => {
                  return TaskService.adapt(note);
              });
              // console.log(res.Data);
              return res;
          }),
      );
    }

    fetch(DocId) {
        return this.api.get({endpoint: `/task/${DocId}`, useAuthUrl: true}).pipe(
            map(res => res as IApiResponseBody),
            tap(res => console.log(res.Data)),
            map((res: IApiResponseBody) => TaskService.adapt(res.Data[0])),
        );
    }

    update(param: { DocId: string; formData: ITask }) {
        console.log('ParentID : ' + param.DocId)
        return this.api.patch({endpoint: `/task/${param.DocId}`, body: param.formData, useAuthUrl: true});
    }

    delete(id: string) {
        return this.api.delete({endpoint: `/task/${id}`, useAuthUrl: true});
    }


}
