export interface IButton {
    id?: number;
    ripple?: string;
    label?: string;
    disabled?: boolean;
    togglable?: boolean;
    selected?: boolean;
    color?: string;
    icon?: string;
    tooltip?: string;
  }
  
  export class Button {
    public id: number;
    public ripple: string;
    public label: string;
    public disabled: boolean;
    public togglable: boolean;
    public selected: boolean;
    public color: string;
    public icon: string;
    public tooltip: string;
  
    constructor(obj?: IButton) {
        this.id = obj.id ;
        this.ripple = obj.ripple || 'gray';
        this.label = obj.label;
        this.selected = obj.selected || false;
        this.togglable = obj.togglable;
        this.disabled = obj.disabled || false;
        this.color = obj.color;
        this.icon = obj.icon;
        this.tooltip = obj.tooltip;
    }
  }
  
