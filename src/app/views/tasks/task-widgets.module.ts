import {NgModule} from '@angular/core';
import {CustomAgGridModule} from '../../modules/custom-ag-grid/custom-ag-grid.module';
import {AddTaskActionDirective} from './directives/add-task-action.directive';
import {ModalAddTaskComponent} from './components/modal-add-task/modal-add-task.component';
import {FormCreateTaskComponent} from './components/form-create-task/form-create-task.component';
import {ActionAddTaskComponent} from './components/action-add-task/action-add-task.component';
import {TasksListComponent} from './components/tasks-list/tasks-list.component';
import {CreateTaskComponent} from './components/create-task/create-task.component';

const ENTRY_COMPONENTS = [
    ModalAddTaskComponent,
];

const COMPONENTS = [
    FormCreateTaskComponent,
    ActionAddTaskComponent,
    TasksListComponent,
    CreateTaskComponent,
    ...ENTRY_COMPONENTS,
];

const DIRECTIVES = [
    AddTaskActionDirective,
];

@NgModule({
    imports: [
        CustomAgGridModule,
    ],
    declarations: [...COMPONENTS, ...DIRECTIVES],
    exports: [...COMPONENTS, ...DIRECTIVES, CustomAgGridModule]
})

export class TaskWidgetsModule {
}
