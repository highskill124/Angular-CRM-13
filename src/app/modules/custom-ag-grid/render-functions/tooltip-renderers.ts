import {IServerDropdownOption} from '../../../models/server-dropdown';

export const EmailsTooltipRenderer = (emails: IServerDropdownOption[]) => {
    let tooltipHtml = ``;
    const values = [...emails];
    if (values && values.length) {
        values.forEach((value, i) => {
            tooltipHtml += `${value.value} ${value.name ? '(' + value.name + ')' : ''}<br>`;
            /*if (i !== (values.length - 1)) {
                tooltipHtml += `\n`;
            }*/
        });
    }

    return tooltipHtml;
};

export const BucketsTooltipRenderer = (values: IServerDropdownOption[]) => {
    let tooltipHtml = ``;
    if (values && values.length) {
        values.forEach((value, i) => {
            tooltipHtml += `${value.name}<br>`;
            /*if (i !== (values.length - 1)) {
                tooltipHtml += `\n`;
            }*/
        });
    }

    return tooltipHtml;
};


export const FollowupInfo = (values: any) => {
    let tooltipHtml = values;
    return tooltipHtml;
}
