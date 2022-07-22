import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ActiveQuickActionOverlayService {

    private overlayId: string;

  constructor() { }

  setActiveId(id: string) {
      this.overlayId = id;
  }

  getActiveId() {
      return this.overlayId ? this.overlayId : null;
  }
}
