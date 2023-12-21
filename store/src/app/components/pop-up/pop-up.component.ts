import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent {
  constructor(
    public dialogRef: MatDialogRef<PopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string, confirmLabel: string, cancelLabel: string, actionType: string }
  ) { }

  onCancelClick(): void {
    this.dialogRef.close('canceled');
  }

  onConfirmClick(): void {
    if (this.data.actionType === 'delete') {
      this.dialogRef.close('deleted');
    } else if (this.data.actionType === 'login') {
      this.dialogRef.close('login');
    } else if (this.data.actionType === 'purchase') {
      this.dialogRef.close('purchased');
    }
  }
}