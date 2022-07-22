import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class Base64Service {
    constructor() {}

    convertToBlobAndDownload(params: {
        base64Data: string;
        contentType: string;
        filename?: string;
        sliceSize?: number;
    }) {
        const blobData = this.convertBase64ToBlobData(
            params.base64Data,
            params.contentType
        );
        this.download(blobData, params.contentType, params.filename);
    }

    convertBase64ToBlobData(
        base64Data: string,
        contentType: string,
        sliceSize = 512
    ) {
        const byteCharacters = atob(base64Data);
        const byteArrays = [];

        for (
            let offset = 0;
            offset < byteCharacters.length;
            offset += sliceSize
        ) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: contentType });
    }

    download(blobData: Blob, contentType: string, filename = "file") {
        // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //     // IE
        //     window.navigator.msSaveOrOpenBlob(blobData, filename);
        // } else
        {
            // chrome
            const blob = new Blob([blobData], { type: contentType });
            const url = window.URL.createObjectURL(blob);
            // window.open(url);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            link.click();
        }
    }
}
