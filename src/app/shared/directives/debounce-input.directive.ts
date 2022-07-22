import {Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeWhile} from 'rxjs/operators';

@Directive({
    selector: '[appDebounceInput]'
})
export class DebounceInputDirective implements OnInit, OnDestroy {

    @Input() debounceTime = 500;
    @Output() debounceInput = new EventEmitter();
    private inputs$ = new Subject();

    private alive = true;

    constructor() {
    }

    ngOnInit() {
        this.inputs$
            .pipe(
                debounceTime(this.debounceTime),
                distinctUntilChanged(),
                takeWhile(() => this.alive),
            )
            .subscribe(e => this.debounceInput.emit(e));
    }

    @HostListener('input', ['$event'])
    inputEvent(event) {
        event.preventDefault();
        event.stopPropagation();
        this.inputs$.next(event);
    }

    ngOnDestroy() {
        this.alive = false;
    }

}
