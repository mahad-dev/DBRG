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
console.log("first..Arbaz", errorData);
console.log("second..Arbaz", error);
  // If error has the new format with errors object
  if (errorData?.errors && typeof errorData.errors === 'object') {
    const errorMessages: string[] = [];

    for (const [field, messages] of Object.entries(errorData.errors)) {
      if (Array.isArray(messages) && messages.length > 0) {
        // Clean up field name (remove $. prefix and make readable)
        const cleanFieldName = field
          .replace(/^\$\./, '') // Remove $. prefix
          .replace(/\./g, ' > ') // Replace dots with arrows
          .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
          .replace(/^./, str => str.toUpperCase()); // Capitalize first letter

        // Add each message
        messages.forEach((msg: string) => {
          // For JSON conversion errors, simplify the message
          if (msg.includes('JSON value could not be converted')) {
            errorMessages.push(`${cleanFieldName}: Invalid value provided`);
          } else {
            errorMessages.push(`${cleanFieldName}: ${msg}`);
          }
        });
      }
    }

    if (errorMessages.length > 0) {
      // Return first 3 errors max to avoid too long toast
      return errorMessages.slice(0, 3).join('\n');
    }
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
