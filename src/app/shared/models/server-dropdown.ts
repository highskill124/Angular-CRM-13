export interface IServerDropdownOption<V = any> {
    value: V;
    name: string;
    selected?: boolean;
  }
  
  export interface IDropdownCache {
    guid: string;
    options: Array<ServerDropdownOption>;
  }
  
  export class ServerDropdownOption {
    value: any;
    name: string;
    selected: boolean;
  
    constructor(data: IServerDropdownOption) {
      this.value = data.value;
      this.name = data.name;
      this.selected = data.selected;
    }
  }