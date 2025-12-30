import * as Yup from 'yup';
import { requiredString } from '../../utils/conditionalValidation';

/**
 * Step 2 Company Details validation schema - Member Bank
 * Validates company information including contact details and registration info
 */
export const step2CompanyDetailsSchema = Yup.object({
  // Company Information
  companyName: requiredString('Company name'),
  tradingName: requiredString('Trading name'),
  registrationNumber: requiredString('Registration number'),
  dateOfIncorporation: requiredString('Date of incorporation'),
  countryOfIncorporation: requiredString('Country of incorporation'),
  registeredAddress: requiredString('Registered address'),
  operationalAddress: requiredString('Operational address'),

  // Contact Details
  telephoneNumber: requiredString('Telephone number'),
  emailAddress: Yup.string()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  website: requiredString('Website'),

  // Optional fields
  vatNumber: Yup.string().nullable(),
  taxRegistrationNumber: Yup.string().nullable(),
});
