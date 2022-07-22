import {ComponentCanDeactivate} from '../can-deactivate/component-can-deactivate';
import {FormGroup} from '@angular/forms';
import { Directive } from "@angular/core";

@Directive()
export abstract class FormCanDeactivate extends ComponentCanDeactivate {

 abstract get form(): FormGroup;

 canDeactivate(): boolean {
      return !this.form.dirty;
  }
}
