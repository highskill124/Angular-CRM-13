export interface IServerDropdownOption<V = any> {
  value: V;
  name: string;
  selected: boolean;
  type?: string;
}

export interface IDropdownCache {
  guid: string;
  options: Array<ServerDropdownOption>;
}

export class ServerDropdownOption {
  value: any;
  name: string;
  selected: boolean;
  type?: string;

  constructor(data: IServerDropdownOption) {
    this.value = data.value;
    this.name = data.name;
    this.selected = data.selected;
    this.type = data.type;
  }
}
