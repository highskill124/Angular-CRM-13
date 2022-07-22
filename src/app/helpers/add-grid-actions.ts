import {deleteGridAction, editGridAction, IGridAction, viewGridAction} from '../models/grid';

export function addGridActions<T>(data: T[], actions: IGridAction[] = [viewGridAction, editGridAction, deleteGridAction]) {
    /**
     * TODO: Properly type note in map() callback
     */
    return data && data.length && data.map((item: any) => {
        item.actions = actions;

        return item;

    }) || data;
}
