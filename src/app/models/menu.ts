export interface IMenu {
    _id: string;
    _type: string;
    parent: string;
    icon: string;
    iconlibary: string;
    class: string;
    style: string;
    admin: boolean;
    disabled: boolean;
    level: number;
    position: number;
    tooltip: string;
    name: string;
    description?: string;
    link: string;
    history: IHistory
}

export interface IMenuParents {
    _id: string;
    name: string;
}

export interface IHistory {
    created_on: Date;
    created_by: string;
    updated_on: Date;
    updated_by: string;
}
