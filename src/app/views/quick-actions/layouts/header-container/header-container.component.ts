import {Component, Inject, Input, OnInit} from '@angular/core';
import {IgxOverlayService} from 'igniteui-angular';
import {ActiveQuickActionOverlayService} from '../../../../services/active-quick-action-overlay.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-header-container',
    templateUrl: './header-container.component.html',
    styleUrls: ['./header-container.component.scss']
})
export class HeaderContainerComponent implements OnInit {

    @Input() title = '';
    @Input() mode = 'infragistics';
    @Input() allowDismiss = true;

    constructor(
        @Inject(IgxOverlayService) private overlayService: IgxOverlayService,
        private activeGlobalOverlay: ActiveQuickActionOverlayService,
        private dialogRef: MatDialogRef<HeaderContainerComponent>
    ) {
    }

    ngOnInit() {
    }

    dismiss() {


        if (this.mode === 'infragistics' ) {
            this.overlayService.hide(this.activeGlobalOverlay.getActiveId());
        } else {
            this.dialogRef.close()
        }
    }
}
