import {Injectable} from '@angular/core';
import {ApiService} from './api/api.service';
import {IInteraction} from '../models/contact-interaction';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {IServerDropdownOption, ServerDropdownOption} from '../models/server-dropdown';
import {DropdownGuids} from '../models/dropdown-guids.enum';
import {IInteractionDataFetcherParams} from '../modules/custom-ag-grid/ag-grid-base';

@Injectable({
    providedIn: 'root'
})
export class InteractionService {

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
            map((res: any) => {
                res.Data = InteractionService.adapt(res.Data);
                return res;
            })
        );
    }

    getAll(contactId: string, params?: IInteractionDataFetcherParams) {
        return this.api.get({
            endpoint: `/interactions/${contactId}`,
            params: {
                rowCount: params.perPage,
                offset: params.offset,
                ...(params.qsearch ? {qsearch: params.qsearch} : {}),
                ...(params.type && {type: params.type}),
            },
            useAuthUrl: true,
        }).pipe(
            tap(res => console.log(res)),
            map((res: any) => {
                
                // res.Data = res.Data && res.Data.map(interaction => {
                //     // construct DocId and return data as recieved
                //     return InteractionService.adapt(interaction);
                // });
                // console.log(res.Data);
             
                return res;
            }),
        );
    }

    fetch(DocId) {
        return this.api.get({endpoint: `/interaction/${DocId}`, useAuthUrl: true}).pipe(
            map((res: any) => InteractionService.adapt(res.Data)),
        );
    }

    update(param: { DocId: string; formData: IInteraction }) {
        return this.api.patch({endpoint: `/interaction/${param.DocId}`, body: param.formData, useAuthUrl: true});
    }

    delete(DocId: string) {
        return this.api.delete({endpoint: `/interaction/${DocId}`, useAuthUrl: true});
    }

    methodsList(): Observable<IServerDropdownOption[]> {
        return this.api.get({endpoint: `/cblookup/${this.guids.INTERACTION_METHODS}`, useAuthUrl: true}).pipe(
            map((res: any) => {
                return res.Data.map(option => {
                    return new ServerDropdownOption({
                        value: option.id,
                        name: option.name,
                        selected: option.selected,
                    })
                })
            }),
        );
    }
}
