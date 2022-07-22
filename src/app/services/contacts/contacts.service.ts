import { IApiResponseBody } from './../../models/api-response-body';
import { IEmail } from './../../models/email';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {ApiService} from '../api/api.service';
import {IContact, IGridContact, IMainContact} from '../../models/contact';
import {IServerDropdownOption, ServerDropdownOption} from '../../models/server-dropdown';
import {IContactDataFetcherParams, IGridDataFetcher, IGridDataFetcherParams} from '../../modules/custom-ag-grid/ag-grid-base';
import {MailService} from '../mail.service';
import {IMail} from '../../models/mail';


@Injectable({providedIn: 'root'})
export class ContactsService implements IGridDataFetcher {

    static adaptContact(contact): IContact {
        return {
            DocId: contact.DocId,
            first_name: contact.first_name,
            middle_name: contact.middle_name,
            last_name: contact.last_name,
            dob: contact.dob,
            initials: contact.initials,
            spouse_name: contact.spouse_name,
            file_as: contact.file_as,
            company_name: contact.company_name,
            job_title: contact.job_title,
            home_phone: contact.home_phone,
            cell_phone: contact.cell_phone,
            office_phone: contact.office_phone,
            fax_number: contact.fax_number,
            email_address: contact.email_address,
            email_alternate: contact.email_alternate,
            street: contact.street,
            city: contact.city,
            state: contact.state,
            postal_code: contact.postal_code,
            notes: contact.notes,
            follow_up: contact.follow_up,
            start_date: contact.start_date,
            end_date: contact.end_date,
            add_to_outlook: contact.add_to_outlook,
            tags: contact.tags,
        };
    }

    static adaptGridContact(contact): IGridContact {
        return {
            DocId: contact.DocId,
            Name: contact.Name,
            buckets: contact.buckets && contact.buckets.length && contact.buckets.map((bucket: any) => {
                return {
                    value: bucket.DocId,
                    name: bucket.text,
                    selected: true, // setting selected to true since only selected items are returned from api
                };
            }) || [],
            tags: contact.tags && contact.tags.length && contact.tags.map((tag: any) => {
                return {
                    value: tag.DocId,
                    name: tag.text,
                    selected: true, // setting selected to true since only selected items are returned from api
                };
            }) || [],
            emails: contact.emails && contact.emails.length && contact.emails.map((email: any) => {
                const key = Object.keys(email)[0];
                return {
                    name: key,
                    value: email[key],
                    selected: true,
                }
            }) || [],
            phones: contact.phones && contact.phones.length && contact.phones.map((phone: any) => {
                // const key = Object.keys(phone)[0];
                return {
                    name: Object.keys(phone)[0],
                    value: Object.values(phone)[0],
                    selected: true,
                }
            }) || [],
            followup: contact.followup && [
                {
                    name: contact.followup.type,
                    selected: contact.followup.selected,
                    value: contact.followup.date,
                }
            ],
            lastactivity: contact.lastactivity,
        }
    }

    static adaptMainContact(contact): IMainContact {
        if (contact) {
            return {
                DocId: contact._id ? `contact::${contact._id}` : contact.DocId,
                first_name: contact.first_name,
                middle_name: contact.middle_name,
                last_name: contact.last_name,
                image: contact.image,
                dob: contact.dob,
                initials: contact.initials,
                spouse_name: contact.spouse_name,
                file_as: contact.file_as,
                company_name: contact.company_name,
                job_title: contact.job_title,
                phones: contact.phones,
                emails: contact.emails,
                websites: contact.websites,
                socials: contact.socials,
                addresses: contact.addresses && contact.addresses.map(address => {
                    return {
                        city: address.city,
                        country: address.countryOrRegion,
                        id: address.id,
                        postal_code: address.postalCode,
                        state: address.state,
                        street: address.street,
                        type: address.type,
                        unit: address.unit,
                    };
                }),
                follow_ups: contact.follow_ups,
                recurring_events: contact.recurring_events,
                notes: contact.notes,
                add_to_outlook: contact.add_to_outlook,
                tags: contact.tags,
                buckets: contact.buckets,
                programs: contact.programs,
                history: contact.history,
            };
        } else {
            return contact;
        }
    }

    constructor(public api: ApiService, private mailService: MailService) {
    }

    emailLookup(searchValue) {
        return this.api.get({endpoint: `/email/EmailAddress/${searchValue}`}).pipe(
            map((res: any) => res.Data.map(item => {
                return new ServerDropdownOption({
                    name: item.address,
                    value: item.address,
                    selected: item.selected
                });
            })),
        );
    }

    nameLookup(searchValue): Observable<IServerDropdownOption[]> {
        return this.api.get({endpoint: `/contact/nameLookup/${searchValue}`}).pipe(
            map((res: any) => res.Data.map(item => {
                return new ServerDropdownOption({
                    name: `${item.name} ${item.file_as ? ' | ' + item.file_as : ''}`,
                    value: item.DocID,
                    selected: item.selected
                });
            })),
        );
    }

    bucketList(): Observable<IServerDropdownOption[]> {
        return this.api.get({endpoint: '/cblookup/bucketlist'}).pipe(
            map((res: any) => {
                return res.Data.map(option => {
                    return new ServerDropdownOption({
                        value: option.id,
                        name: option.text,
                        selected: option.selected,
                    })
                })
            }),
        );
    }

    tagList(): Observable<IServerDropdownOption[]> {
        return this.api.get({endpoint: '/cblookup/tag', useAuthUrl: true}).pipe(
            map((res: any) => {
                return res.Data.map(option => {
                    return new ServerDropdownOption({
                        value: option.id,
                        name: option.text,
                        selected: option.selected,
                    })
                })
            }),
        );
    }

    programsList(key: string): Observable<IServerDropdownOption[]> {
        return this.api.get({endpoint: `/cblookup/${key}`, useAuthUrl: true}).pipe(
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

    followUpOptions(key: string): Observable<IServerDropdownOption[]> {
        return this.api.get({endpoint: `/cblookup/${key}`, useAuthUrl: true}).pipe(
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

    labelsList(key: string): Observable<IServerDropdownOption[]> {
        return this.api.get({endpoint: `/cblookup/${key}`, useAuthUrl: true}).pipe(
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

    /**
     * TODO: Move this functionality to mail.service.ts, belongs there
     * @param contactId
     * @param params
     */
    emailsList(contactId: string, params?: IGridDataFetcherParams) {
        return this.api.get({endpoint: `/emails/${contactId}`, params: params, useAuthUrl: true}).pipe(
            map(res => res as IApiResponseBody<IMail[]>),
            map(res => {
                res.Data = res.Data && res.Data.map(mail => {
                    return MailService.adapt(mail)
                });
                return res;
            }),
        );
    }

    query(params?: any) {
        return this.api.get({endpoint: '/contacts', params: params});
    }

    getAll(params?: IContactDataFetcherParams) {
        return this.api.get({
            endpoint: `/contact/list`,
            params: {
                rowCount: params.perPage,
                offset: params.offset,
                ...(params.qsearch ? {qsearch: params.qsearch} : {}),
                ...(params.type && {type: params.type}),
                ...(params.buckets && {buckets: params.buckets.join(',')}),
                ...(params.tags && {tags: params.tags.join(',')}),
            },
        }).pipe(
            map((res: any) => {
                res.Data = res.Data && res.Data.map(contact => {
                    // construct DocId and return data as recieved
                    return ContactsService.adaptGridContact(contact);
                });
                // console.log(res.Data);
                return res;
            }),
        );
    }

    fetch(DocId: string) {
        return this.api.get({endpoint: `/contact/${DocId}`}).pipe(
            map((res: any) => {
                res.Data = ContactsService.adaptMainContact(res.Data);
                if (!res.Data.DocId) {

                }
                return res;
            }),
        );
    }

    quickCreate(contact: Partial<IContact>) {
        return this.api.post({endpoint: '/contact/quickContact', body: contact});
    }

    shortCreate(contact: Partial<IContact>) {
        return this.api.post({endpoint: '/contact/shortContact', body: contact});
    }

    emailAdd(fields: { address: string, name?: string, otherLabel?: string, type?: string }, contactId: string) {
        return this.api.post({endpoint: `/contact/ContactEmail/${contactId}`, body: fields});
    }

    create(contact: Partial<IContact>) {
        return this.api.post({endpoint: '/contact/create', body: contact});
    }

    createMain(contact: Partial<IMainContact>) {
        return this.api.post({endpoint: '/contact/new', body: contact}).pipe(
            map((res: any) => {
                res.Data = ContactsService.adaptMainContact(res.Data);
                // DocId is returned in body instead of in Data object
                if (!res.Data.DocId && res.DocId) {
                    res.Data.DocId = res.DocId;
                }
                return res;
            })
        );
    }

    updateMain(DocId: string, contact: Partial<IMainContact>) {
        return this.api.post({endpoint: `/contact/update/${DocId}`, body: contact});
    }

    delete(guids: Array<string>) {
        if (guids.length > 1) {
            return this.api.delete({
                endpoint: `/contact/multiple`,
                reqOpts: {
                    body: {DocId: guids}
                }
            });
        } else {
            return this.api.delete({endpoint: `/contact/single/${guids[0]}`});
        }
    }

    updateBuckets(ContactId: string, bucketIds: string[]) {
        return this.api.patch({
            endpoint: `/contact/bucket/${ContactId}`,
            body: bucketIds,
        });
    }

    updateTags(ContactId: string, tagIds: string[]) {
        return this.api.patch({
            endpoint: `/contact/tags/${ContactId}`,
            body: tagIds,
        });
    }

    print(DocId: string) {
        return this.api.get({endpoint: `/report/contact/${DocId}`});
    }

    getEmailDetail( DocId: string, EmailId: string) {
        return this.api.get({endpoint: `/contact/email/${DocId}/${EmailId}`}).pipe(

            map(res => res as IApiResponseBody),
            tap(res => console.log(res)),
            map(res => res.Data[0] as IEmail),
        )}

    getEmails( DocId: string) {
        return this.api.get({endpoint: `/contact/emails/${DocId}`}).pipe(
            map(res => res as IApiResponseBody),
            map(res => res.Data as IEmail[]),
    )}
}
