export enum PartyType {
  LANDLORD = 'Arrendador',
  TENANT = 'Arrendatario',
  GUARANTOR = 'Avalista'
}

export interface Party {
  id: string;
  type: PartyType;
  fullName: string;
  nationality: string;
  address: string;
  docNumber: string; // DNI/NIE
  phone: string;
  email: string;
}

export enum PetOption {
  FORBIDDEN = 'forbidden',
  ALLOWED = 'allowed'
}

export enum FurnitureOption {
  EMPTY = 'empty', // Cocina no equipada, sin muebles
  KITCHEN_EQUIPPED = 'kitchen_equipped', // Cocina equipada, sin muebles
  FURNISHED = 'furnished' // Cocina equipada, amueblada
}

export enum PaymentMethod {
  TRANSFER = 'transfer',
  DIRECT_DEBIT = 'direct_debit'
}

export enum ExpensePayer {
  LANDLORD = 'landlord',
  TENANT = 'tenant'
}

export enum RentUpdateOption {
  NO_UPDATE = 'no_update',
  UPDATE_IRAV = 'update_irav',
  NEGATIVE_LIMIT = 'negative_limit' // Option 2.1 in document
}

export interface PropertyDetails {
  location: string; // City where signed
  date: string; // Date of signing
  address: string;
  description: string; // Garage/storage
  catastralRef: string;
  community: string; // "Si forma parte de..."
  habitabilityCert: string;
  energyCert: string;
  maxOccupancy: number;
  keysCount: number;
}

export interface FinancialDetails {
  annualRent: number;
  monthlyRent: number;
  paymentMethod: PaymentMethod;
  bankAccount: string; // IBAN
  bankAccountHolder: string;
  bankEntity: string;
  depositAmount: number; // Fianza
  depositMonths: number;
  guaranteeType: 'none' | 'cash' | 'transfer' | 'bank_guarantee';
  guaranteeAmount: number;
}

export interface ExpenseDetails {
  communityFeesPayer: ExpensePayer;
  communityFeesAmount?: number;
  ibiPayer: ExpensePayer;
  ibiAmount?: number;
  garbageTaxPayer: ExpensePayer;
  garbageTaxAmount?: number;
}

export interface ContractData {
  parties: Party[];
  property: PropertyDetails;
  financials: FinancialDetails;
  expenses: ExpenseDetails;
  options: {
    pets: PetOption;
    furniture: FurnitureOption;
    rentUpdate: RentUpdateOption;
    hasInventory: boolean;
  };
}

export interface ConfigCounts {
  landlords: number;
  tenants: number;
  guarantors: number;
}