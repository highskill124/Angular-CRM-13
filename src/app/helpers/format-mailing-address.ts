import {IMailingAddress} from '../models/farm';

export const formatMailingAddress = (address: IMailingAddress) => {
    return `${address.address && address.address + ', '}${address.city} ${address.state} ${address.zip && address.zip + '-'}${address.zip4}`;
};
