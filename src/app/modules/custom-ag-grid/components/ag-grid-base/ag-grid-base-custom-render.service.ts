import {Injectable} from '@angular/core';
import {IGridColumnAgGrid} from '../../../../models/grid-column';
import {DateAndTimeRenderer, DateRenderer, StringRenderer} from '../../render-functions/date-renderer';
import {TemplateRendererComponent} from '../template-renderer/template-renderer.component';
import {hexToRgb} from '../../../../helpers/utils';
import {CustomTooltip} from '../basic-tooltip/basic-tooltip.component';
import {EmailsTooltipRenderer, FollowupInfo} from '../../render-functions/tooltip-renderers';
import {MultiKeyValueItemRendererComponent} from '../multi-key-value-item-renderer/multi-key-value-item-renderer.component';



@Injectable({
    providedIn: 'root',
})



export class AGGridBaseCustomRender {

    private progressBGDefault = '#70cc70';



resolveRenderer(type: string, column: IGridColumnAgGrid) {
    switch (type) {
        case 'msgtrack':
            return {
                cellRenderer: (data) => {
                    return data.data.msg_count + ' | ' + data.data.click_count;
                },
            };

        // case 'test':
        //     return {
        //         cellRenderer: (data) => {
        //             console.log(data.value)
        //             return data.value[0];                        },
        //     };


        case 'date':
            return {
                cellRenderer: (data) => {
                    return DateRenderer(data.value);
                },
            };
        case 'datetime':
            return {
                cellRenderer: (data) => {
                    return DateAndTimeRenderer(data.value);
                },
            };
        case 'money':
            return {
                cellRenderer: (data) => {
                    return data.value && this.currencyPipe.transform(data.value, 'USD');
                },
            };
        case 'updateFlag':
            return {
                cellRenderer: (data) => {
                    if (data.value === true) {
                        return '<span><i class="material-icons md-18" style="color:red;vertical-align: middle">edit</i></span>';
                    } else {
                        return '<span></span>';
                    }
                },
            };
        case 'checkedFlag':
            return {
                cellRenderer: (data) => {
                    if (data.value === true) {
                        return '<span class="table-row-icon"><i class="material-icons md-18" style="color:green">done</i></span>';
                    } else {
                        return '<span></span>';
                    }
                },
            };

        case 'mls2' : {
            return {
                cellRendererFramework: TemplateRendererComponent,
                cellRendererParams: {
                    ngTemplate: this.notifyTemp,
                    tooltipRenderer: CustomTooltip,
                },
            }
        }
            ;


        case 'checkedFollowup':
            return {
                cellRenderer: (data) => {
                    if (data.value && data.value !== '') {
                        return '<span class="table-row-icon"><i class="material-icons md-18" style="color:green">done</i></span>';
                    } else {
                        return '<span></span>';
                    }
                },
            };
        case 'followupPrefix':
            return {
                cellRenderer: (data) => {
                    if (data.value === 'contact') {
                        return '<span class="table-row-icon"><i class="material-icons md-18" style="color:green">person</i></span>';
                    } else {
                        return '<span></span>';
                    }
                },
            };
        case 'multi-keyvalue':
            return {
                cellRendererFramework: MultiKeyValueItemRendererComponent,
                cellRendererParams: {
                    field: column.field,
                    tooltipRenderer: EmailsTooltipRenderer,
                },
            };
        case 'time-info':
            return {
                cellRendererFramework: MultiKeyValueItemRendererComponent,
                cellRendererParams: {
                    field: column.field,
                    tooltipRenderer: FollowupInfo,
                },
            };
        case 'notify' :
            return {
                cellRendererFramework: TemplateRendererComponent,
                cellRendererParams: {
                    ngTemplate: this.notifyTemp,

                }
            };

        case 'mls' :
            return {
                cellRendererFramework: TemplateRendererComponent,
                cellRendererParams: {
                    ngTemplate: this.notifyTemp,
                    tooltipRenderer: FollowupInfo,

                }
            };

        case 'progress' :
            return {
                cellRenderer: (data) => {

                    const progress = data.value;
                    const rgbC = hexToRgb(this.progressBG || this.progressBGDefault);
                    const htmlString = `
                            <div class="cut-progress progress">
                                <i>${progress.toFixed(2)}%</i>
                                <div class="progress-bar" role="progressbar"
                                    style="width: ${progress}%; background: rgba(${rgbC.r}, ${rgbC.g}, ${rgbC.b},${progress / 100});" aria-valuenow="${progress}"
                                    aria-valuemin="0" aria-valuemax="100">
                                </div>
                            </div>
                        `;

                    return htmlString;
                }
            }
    }

}
}