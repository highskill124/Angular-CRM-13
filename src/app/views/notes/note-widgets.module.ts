import {NgModule} from '@angular/core';
import {CustomAgGridModule} from '../../modules/custom-ag-grid/custom-ag-grid.module';
import {AddNoteActionDirective} from './directives/add-note-action.directive';
import {ModalAddNoteComponent} from './components/modal-add-note/modal-add-note.component';
import {FormCreateNoteComponent} from './components/form-create-note/form-create-note.component';
import {ActionAddNoteComponent} from './components/action-add-note/action-add-note.component';
import {NotesListComponent} from './components/notes-list/notes-list.component';
// import {CreateNoteComponent} from './components/create-note/create-note.component';

const ENTRY_COMPONENTS = [
    ModalAddNoteComponent,
];

const COMPONENTS = [
    FormCreateNoteComponent,
    ActionAddNoteComponent,
    NotesListComponent,
    // CreateNoteComponent,
    ...ENTRY_COMPONENTS,
];

const DIRECTIVES = [
    AddNoteActionDirective,
];

@NgModule({
    imports: [
        CustomAgGridModule,
    ],
    declarations: [...COMPONENTS, ...DIRECTIVES],
    exports: [...COMPONENTS, ...DIRECTIVES, CustomAgGridModule]
})

export class NoteWidgetsModule { }
