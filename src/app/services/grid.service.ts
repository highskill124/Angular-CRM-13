import {Injectable} from '@angular/core';
import {ApiService} from './api/api.service';
import {IInteraction} from '../models/contact-interaction';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {IServerDropdownOption, ServerDropdownOption} from '../models/server-dropdown';
import {DropdownGuids} from '../models/dropdown-guids.enum';
import { IApiResponseBody } from '../models/api-response-body';
import { IGridColumnAgGrid } from '../models/grid-column';

@Injectable({
    providedIn: 'root'
})
export class GridService {

    guids = DropdownGuids;

    static adapt(interaction): IInteraction {
        return {
            DocId: interaction._id ? `interaction::${interaction._id}` : interaction.DocId,
            type: interaction.type,
            subject: interaction.subject,
            time: interaction.time,
            parent_id: interaction.parent_id,
            followup_id: interaction.followup_id,
            notes: interaction.notes,
            reminder_date: interaction.reminder_date,
            reminder_time: interaction.reminder_time,
            flag_to: interaction.flag_to
        };
    }

    constructor(private api: ApiService) {
    }

    create(interaction: Partial<IInteraction>) {
        return this.api.post({endpoint: `/interaction`, body: interaction, useAuthUrl: true}).pipe(
       
        )}

    // getAll(contactId: string, params?: any) {
    //     return this.api.get({
    //         endpoint: `/interactions/${contactId}`,
    //         params: {
    //             rowCount: params.perPage,
    //             offset: params.offset,
    //             ...(params.qsearch ? {qsearch: params.qsearch} : {}),
    //             ...(params.type && {type: params.type}),
    //         },
    //         useAuthUrl: true,
    //     }).pipe(
    //         tap(res => console.log(res)),
    //         map((res: any) => {
                
    //             // res.Data = res.Data && res.Data.map(interaction => {
    //             //     // construct DocId and return data as recieved
    //             //     return InteractionService.adapt(interaction);
    //             // });
    //             // console.log(res.Data);
             
    //             return res;
    //         }),
    //     );
    // }

    fetchColumn(docKey : string, colKey : string) {
        return this.api.get({endpoint: `/grid/ColumnInfo/${docKey}/${colKey}`, useAuthUrl: false}).pipe(
            map(res => res as IApiResponseBody),
            tap(res => console.log(res))
        );
    }

    updateColumn(docKey : string, colKey : string, formData: IGridColumnAgGrid){
        console.log('Calling Column Update')
        return this.api.patch({endpoint: `/grid/ColumnInfo/${docKey}/${colKey}`, body: formData, useAuthUrl: false}).pipe(
            map(res => res as IApiResponseBody),
            tap(res => console.log(res))
        );
    }

    createColumn(docKey : string, formData: IGridColumnAgGrid){
        console.log('Calling Column Create')
        return this.api.post({endpoint: `/grid/ColumnInfo/${docKey}`, body: formData, useAuthUrl: false}).pipe(
            map(res => res as IApiResponseBody),
            tap(res => console.log(res))
        );
    }

    delete(docKey : string, colKey : string) {
        return this.api.delete({endpoint: `/grid/ColumnInfo/${docKey}/${colKey}`, useAuthUrl: false}).pipe(
            map(res => res as IApiResponseBody),
            tap(res => console.log(res))
        );
    }

   
    fetchGridName(docKey : string) {
        return this.api.get({endpoint: `/grid/name/${docKey}`, useAuthUrl: false}).pipe(
            map(res => res as IApiResponseBody),
            tap(res => console.log(res))
        );
    }


}
