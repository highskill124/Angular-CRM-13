export interface IUploadedImageProperties {
    filename: string;
    original_filename: string; // original file name containing file extension
    folder_name?: string;
    create_thumbnail?: boolean;
    share_image?: boolean;
    myFile?: any; // request param name of image to be uploaded
    user_id?: string; // id of user doing the upload
    link?: string;
}
