import {IPropertyAddress} from '../models/farm';

export const formatPropertyAddress = (address: IPropertyAddress) => {
    return `${address.houseNumber && address.houseNumber + ' '}${address.streetName && address.streetName + ', '}${address.unitNumber && address.unitNumber + ', '}${address.city && address.city + ' '}${address.state && address.state + ' '}${address.zip && address.zip + '-'}${address.zip4}`;
};
