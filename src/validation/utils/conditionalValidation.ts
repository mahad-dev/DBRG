import * as Yup from 'yup';

/**
 * Conditional validation utility functions
 * Provides reusable validation helpers for common field types
 */

/**
 * Required string validation with trimming
 * @param fieldName - Name of the field for error message
 * @returns Yup validation schema
 */
export const requiredString = (fieldName: string) =>
  Yup.string()
    .required(`${fieldName} is required`)
    .trim();

/**
 * Optional string validation (nullable)
 * @returns Yup validation schema
 */
export const optionalString = () =>
  Yup.string()
    .nullable()
    .trim();

/**
 * Required boolean validation (Yes/No questions)
 * Ensures value is explicitly selected (not null/undefined)
 * @param fieldName - Name of the field for error message
 * @returns Yup validation schema
 */
export const requiredBoolean = (fieldName: string) =>
  Yup.boolean()
    .nullable()
    .test(
      'is-selected',
      `Please select Yes or No for ${fieldName}`,
      (value) => value !== null && value !== undefined
    );

/**
 * Optional boolean validation
 * @returns Yup validation schema
 */
export const optionalBoolean = () =>
  Yup.boolean().nullable();

/**
 * Email validation (required)
 * @param fieldName - Name of the field for error message
 * @returns Yup validation schema
 */
export const requiredEmail = (fieldName: string) =>
  Yup.string()
    .required(`${fieldName} is required`)
    .email('Invalid email format')
    .trim();

/**
 * Optional email validation
 * @returns Yup validation schema
 */
export const optionalEmail = () =>
  Yup.string()
    .nullable()
    .email('Invalid email format')
    .trim();

/**
 * Phone number validation (required)
 * Basic validation - just ensures it's not empty
 * @param fieldName - Name of the field for error message
 * @returns Yup validation schema
 */
export const requiredPhone = (fieldName: string) =>
  Yup.string()
    .required(`${fieldName} is required`)
    .trim();

/**
 * Number validation (required)
 * @param fieldName - Name of the field for error message
 * @param min - Optional minimum value
 * @param max - Optional maximum value
 * @returns Yup validation schema
 */
export const requiredNumber = (fieldName: string, min?: number, max?: number) => {
  let schema = Yup.number()
    .required(`${fieldName} is required`)
    .typeError(`${fieldName} must be a number`);

  if (min !== undefined) {
    schema = schema.min(min, `${fieldName} must be at least ${min}`);
  }

  if (max !== undefined) {
    schema = schema.max(max, `${fieldName} cannot exceed ${max}`);
  }

  return schema;
};

/**
 * Optional number validation
 * @param min - Optional minimum value
 * @param max - Optional maximum value
 * @returns Yup validation schema
 */
export const optionalNumber = (min?: number, max?: number) => {
  let schema = Yup.number()
    .nullable()
    .typeError('Must be a number');

  if (min !== undefined) {
    schema = schema.min(min, `Must be at least ${min}`);
  }

  if (max !== undefined) {
    schema = schema.max(max, `Cannot exceed ${max}`);
  }

  return schema;
};

/**
 * Date validation (required)
 * @param fieldName - Name of the field for error message
 * @returns Yup validation schema
 */
export const requiredDate = (fieldName: string) =>
  Yup.date()
    .required(`${fieldName} is required`)
    .typeError(`${fieldName} must be a valid date`);

/**
 * Optional date validation
 * @returns Yup validation schema
 */
export const optionalDate = () =>
  Yup.date()
    .nullable()
    .typeError('Must be a valid date');
