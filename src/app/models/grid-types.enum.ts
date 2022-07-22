/*export enum GridGuid {
  FARM = '43A4ED59-3515-4A19-B919-863D15A3DCBB',
}

export enum GridUrl {
  FARM = '/farm',
}*/
export interface IGridType {
  guid: string;
  url: string;
}

export class GridType {
  guid: string;
  url: string;

  constructor (type: IGridType) {
    this.guid = type.guid;
    this.url = type.url;
  }
}
