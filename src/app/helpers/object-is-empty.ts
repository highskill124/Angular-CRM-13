export const objectIsEmpty = (obj: Object) => {
    // because Object.keys(new Date()).length === 0;
// we have to do some additional check
    return Object.keys(obj).length === 0 && obj.constructor === Object
};
