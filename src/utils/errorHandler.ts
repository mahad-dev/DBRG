/**
 * Map technical field names to user-friendly labels
 */
const fieldNameMap: Record<string, string> = {
  'input': 'Required field',
  'companyDetails.dateOfAppointment': 'Date of Appointment',
  'companyDetails.dateOfIncorporation': 'Date of Incorporation',
  'companyDetails.tradeLicenseExpiryDate': 'Trade License Expiry Date',
  'companyDetails.companyName': 'Company Name',
  'companyDetails.tradeLicenseNumber': 'Trade License Number',
  'companyDetails.email': 'Email Address',
  'companyDetails.phoneNumber': 'Phone Number',
  'applicability.membershipType': 'Membership Type',
  'bankRelationshipRequirement': 'Bank Relationship',
  'financialThreshold': 'Financial Threshold',
  'regulatoryCompliance': 'Regulatory Compliance',
};

/**
 * Get user-friendly field name
 */
function getReadableFieldName(field: string): string {
  // Check if we have a mapped name
  const cleanField = field.replace(/^\$\./, '');
  if (fieldNameMap[cleanField]) {
    return fieldNameMap[cleanField];
  }

  // Otherwise, clean up the field name
  return cleanField
    .replace(/\./g, ' > ') // Replace dots with arrows
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
    .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
}

/**
 * Get user-friendly error message
 */
function getReadableErrorMessage(field: string, message: string): string {
  const fieldName = getReadableFieldName(field);

  // Handle common error patterns
  if (message.includes('JSON value could not be converted to System.DateTime')) {
    return `${fieldName}: Please enter a valid date`;
  }
  if (message.includes('JSON value could not be converted')) {
    return `${fieldName}: Invalid value format`;
  }
  if (message === 'The input field is required.' || message.includes('is required')) {
    return `${fieldName} is required`;
  }
  if (message.includes('must be a valid email')) {
    return `${fieldName}: Please enter a valid email address`;
  }
  if (message.includes('must be at least')) {
    return `${fieldName}: ${message}`;
  }

  return `${fieldName}: ${message}`;
}

/**
 * Parse API error response and return a user-friendly message
 * Handles the format:
 * {
 *   "type": "...",
 *   "title": "One or more validation errors occurred.",
 *   "status": 400,
 *   "errors": {
 *     "fieldName": ["Error message 1", "Error message 2"],
 *     "$.path.to.field": ["Error message"]
 *   },
 *   "traceId": "..."
 * }
 */
export function parseApiError(error: any, fallbackMessage: string = "An error occurred. Please try again."): string {
  // For Axios errors, the actual response is in error.response.data
  const errorData = error?.response?.data || error;

  // If error has the new format with errors object
  if (errorData?.errors && typeof errorData.errors === 'object') {
    const errorMessages: string[] = [];

    for (const [field, messages] of Object.entries(errorData.errors)) {
      if (Array.isArray(messages) && messages.length > 0) {
        // Add each message with user-friendly formatting
        messages.forEach((msg: string) => {
          errorMessages.push(getReadableErrorMessage(field, msg));
        });
      }
    }

    if (errorMessages.length > 0) {
      // Return first 3 errors max to avoid too long toast
      return errorMessages.slice(0, 3).join('\n');
    }
  }

  // If error has title but it's the generic validation title, provide better message
  if (errorData?.title === 'One or more validation errors occurred.') {
    return 'Please check your form and correct any invalid fields.';
  }

  // If error has title (validation error title)
  if (errorData?.title) {
    return errorData.title;
  }

  // If error has message property (could be from errorData or original error)
  if (errorData?.message) {
    return errorData.message;
  }

  if (error?.message) {
    return error.message;
  }

  // If error is a string
  if (typeof error === 'string') {
    return error;
  }

  return fallbackMessage;
}
