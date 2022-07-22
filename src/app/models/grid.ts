import {IGridType} from './grid-types.enum';

export enum GridAction {
    VIEW = 'view',
    EDIT = 'edit',
    DELETE = 'delete',
    BUCKETS = 'buckets',
    TRACKING = 'tracking'
}

export interface IGridAction {
    action: GridAction;
    url: string;
    idField: string;
}

export const viewGridAction: IGridAction = {
    action: GridAction.VIEW,
    idField: 'DocId',
    url: ``,
};
export const editGridAction: IGridAction = {
    action: GridAction.EDIT,
    idField: 'DocId',
    url: ``,
};
export const deleteGridAction: IGridAction = {
    action: GridAction.DELETE,
    idField: 'DocId',
    url: '',
};

export interface IGridSearchField {
    name: string;
    value: any;
    type?: string;
    placeholderText?: string;
}

export interface IGridInput {
    title?: string;
    gridType: IGridType;
    actions?: Array<IGridAction>;
}
