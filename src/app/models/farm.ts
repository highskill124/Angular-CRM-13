import {IEmail} from './email';
import {IPhoneNumber} from './phone-number';

export interface IFarm {
    name: string;
    guid: string;
    property_count: number;
    owner_occupied: number;
    absent_occupied: number;
}

export interface IFarmMaster {
    DocId: string;
    Record: Record;
}

export interface Record {
    DocId: string;
    History: IFarmHistory;
    Loan: IFarmLoan;
    Marketing: IFarmMarketing;
    Owners: IFarmOwners;
    'PropertyAddress': IPropertyAddress;
    'SalesInfo': IFarmSalesInfo;
    Taxes: IFarmTaxes;
    _id: string;
    _type: string;
    apn: string;
    baths: number;
    beds: number;
    buildingArea: string;
    fireplace: string;
    legalDescription: string;
    lotArea: number;
    lotAreaUnits: string;
    mailingAddress: IMailingAddress;
    numStories: string;
    numUnits: string;
    ownerOccupied: string;
    partialBaths: string;
    pool: string;
    propertyType: string;
    rooms: number;
    tract: number;
    yearBuilt: string;
    emails: IEmail[];
    phones: IPhoneNumber[];
}

export interface IFarmHistory {
    created_on: string;
    created_by: string;
    updated_on: string;
    updated_by: string;
    updated_flag: boolean;
    updated_flag_date: string;
}

export interface IMailingAddress {
    address: string;
    city: string;
    unitNumber: string;
    unitType: string;
    state: string;
    zip: string;
    zip4: string;
}

export interface IPropertyAddress {
    carrierRoute: string;
    city: string;
    houseNumber: string;
    latitude: number;
    location_type: string;
    longitude: number;
    odd_even: string;
    place_id: string;
    state: string;
    streetName: string;
    unitNumber: string;
    zip: string;
    zip4: string;
}

export interface IFarmTaxes {
    amountOfDelinquentTaxes: string;
    assessedValue: number;
    assessedYear: string;
    censusTract: string;
    delinquent: string;
    landValue: number;
    marketValueAssessed: string;
    mostRecentYearOfTaxDelinquency: string;
    percentImprovement: number;
    taxAmount: string;
    taxRateCodeArea: string;
    taxYear: string;
    totalAssessedValue: string;
    zoningCode: string;
}

export interface IFarmSalesInfo {
    homeownerExemption: string;
    lastContractDate: string;
    lastSaleBookNumber: string;
    lastSaleDate: string;
    lastSaleDocNumber: string;
    lastSalePageNumber: string;
    recorderBookNo: string;
    recorderPageNo: string;
    saleType: string;
    salesPrice: number;
    salesPriceCode: string;
    seller1FName: string;
    seller1IdCode: string;
    seller1LName: string;
    seller2FName: string;
    seller2LName: string;
}

export interface IFarmOwners {
    id: string;
    owner1FName: string;
    owner1FullName: string;
    owner1LName: string;
    owner1MName: string;
    owner1SpouseFName: string;
    owner1SpouseLName: string;
    owner1SpouseMName: string;
    owner2FName: string;
    owner2FullName: string;
    owner2LName: string;
    owner2MName: string;
    owner2SpouseFName: string;
    owner2SpouseLName: string;
    owner2SpouseMName: string;
    ownerNameFormatted: string;
    ownerNameS: string;
}

export interface IFarmMarketing {
    email: string;
    farm_id: string;
    phone: string;
    privacy: number;
    rts: number;
    status: string;
}

export interface IFarmLoan {
    borrower1FName: string;
    borrower1IdCode: string;
    borrower1LName: string;
    borrower2FName: string;
    borrower2Id: string;
    borrower2LName: string;
    buyerVestingCode: string;
    currentLtv: string;
    doctypecode: string;
    keyedLoantype: string;
    lender1Name: string;
    lender2Name: string;
    lenderId: string;
    lenderTypeCode: string;
    loan1Amount: number;
    loan1BookPage: string;
    loan1DocNumber: string;
    loan1DocTypeCode: string;
    loan1DueDate: string;
    loan1FinancingType: string;
    loan1Rate: string;
    loan1RecDate: string;
    loan1Term: string;
    loan1TitleCo: string;
    loan1Type: string;
    loan1Type1: string;
    loan2Amount: number;
    loan2BookNumber: string;
    loan2DocNumber: string;
    'loan2DueDate': string;
    'loan2FinancingType': string;
    'loan2PageNumber': string;
    'loan2Rate': string;
    'loan2RecDate': string;
    'loan2Term': string;
    'loan2TitleCo': string;
    'loan2Type': string;
    'mlLoanType': string;
    'newLenderTypeCode': string;
    'newLoanTypeCode': string;
    'purchaseLtv': string;
    'td2LenderTypeCode': string;
    'td2Loan1Type': string;
    'td2MlLoanType': string;
    'td2NewLoanTypeCode': string;
}
