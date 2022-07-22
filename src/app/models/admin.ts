export interface IMenu {
    guid: string;
    name: string;
    descrition: string;
    parent: string;
    level: number;
    position: number;
    sorter: string;
    path?: string;
}

export interface IPasswordProfile {
        minChar: number,
        numbers: number,
        upperCase: number,
        lowerCase: number,
        specialChar: number,
        maxPasswordAge: number,
        uniqueness: number
}
