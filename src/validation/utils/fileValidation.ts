import * as Yup from 'yup';

/**
 * Allowed file types for document uploads
 */
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

/**
 * Maximum file size in bytes (10MB)
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates UploadBox fields - handles both new File uploads and existing paths
 * Required file validation: must have either new file OR existing path
 * Also validates file type and size for new uploads
 *
 * Usage:
 * - In Formik initialValues: include both file and filePath
 * - In schema: use requiredFile() which checks both
 *
 * @param fieldName - Name of the field for error message
 * @returns Yup validation schema
 */
export const requiredFile = (fieldName: string) => {
  console.log('🏗️ Creating requiredFile validator for:', fieldName);

  return Yup.mixed()
    .nullable()
    .test('file-required', `${fieldName} is required`, function (value) {
      console.log('🔍 [START] Validating file:', fieldName);

      const { parent } = this;
      const fieldPath = this.path as string;
      const pathFieldName = `${fieldPath}Path`;
      const documentIdFieldName = `${fieldPath}Id`;

      // Debug: Log what we're checking
      console.log('🔍 Validation details:', {
        fieldName,
        fieldPath,
        value,
        valueType: typeof value,
        isFile: value instanceof File,
        parent,
        pathFieldName,
        documentIdFieldName,
        pathValue: parent[pathFieldName],
        docIdValue: parent[documentIdFieldName],
        hasFile: value instanceof File,
        hasPath: !!parent[pathFieldName],
        hasDocId: !!parent[documentIdFieldName],
      });

      // Valid if: new File exists OR existing path exists OR document ID exists
      const isValid = (
        value instanceof File ||
        !!parent[pathFieldName] ||
        !!parent[documentIdFieldName]
      );

      console.log('✅ Validation result:', fieldName, isValid ? 'PASS' : 'FAIL');

      return isValid;
    })
    .test('file-type', `${fieldName} must be PDF, JPEG, PNG, GIF, or WebP`, function (value) {
      // Only validate type for new File uploads
      if (!value || !(value instanceof File)) return true;

      const isValidType = ALLOWED_FILE_TYPES.includes(value.type);
      console.log('🔍 File type validation:', fieldName, value.type, isValidType ? 'PASS' : 'FAIL');

      return isValidType;
    })
    .test('file-size', `${fieldName} must be less than 10MB`, function (value) {
      // Only validate size for new File uploads
      if (!value || !(value instanceof File)) return true;

      const isValidSize = value.size <= MAX_FILE_SIZE;
      console.log('🔍 File size validation:', fieldName, `${(value.size / 1024 / 1024).toFixed(2)}MB`, isValidSize ? 'PASS' : 'FAIL');

      return isValidSize;
    });
};

/**
 * Optional file validation (no requirement, but validates type and size if file is provided)
 */
export const optionalFile = () =>
  Yup.mixed()
    .nullable()
    .test('file-type', 'File must be PDF, JPEG, PNG, GIF, or WebP', function (value) {
      // Only validate type for new File uploads
      if (!value || !(value instanceof File)) return true;
      return ALLOWED_FILE_TYPES.includes(value.type);
    })
    .test('file-size', 'File must be less than 10MB', function (value) {
      // Only validate size for new File uploads
      if (!value || !(value instanceof File)) return true;
      return value.size <= MAX_FILE_SIZE;
    });

/**
 * File type validation (for specific file types)
 *
 * @param fieldName - Name of the field for error message
 * @param allowedTypes - Array of allowed MIME types (e.g., ['image/jpeg', 'image/png'])
 * @returns Yup validation schema
 */
export const fileWithType = (fieldName: string, allowedTypes: string[]) =>
  Yup.mixed()
    .test('file-type', `${fieldName} must be ${allowedTypes.join(', ')}`, function (value) {
      if (!value || !(value instanceof File)) return true;
      return allowedTypes.includes(value.type);
    });

/**
 * File size validation
 *
 * @param fieldName - Name of the field for error message
 * @param maxSizeInMB - Maximum file size in megabytes
 * @returns Yup validation schema
 */
export const fileWithMaxSize = (fieldName: string, maxSizeInMB: number) =>
  Yup.mixed()
    .test(
      'file-size',
      `${fieldName} must be less than ${maxSizeInMB}MB`,
      function (value) {
        if (!value || !(value instanceof File)) return true;
        return value.size <= maxSizeInMB * 1024 * 1024;
      }
    );

/**
 * Combined file validation: type and size
 *
 * @param fieldName - Name of the field for error message
 * @param allowedTypes - Array of allowed MIME types
 * @param maxSizeInMB - Maximum file size in megabytes
 * @returns Yup validation schema
 */
export const requiredFileWithConstraints = (
  fieldName: string,
  allowedTypes?: string[],
  maxSizeInMB?: number
) => {
  let schema = requiredFile(fieldName);

  if (allowedTypes && allowedTypes.length > 0) {
    schema = schema.test(
      'file-type',
      `${fieldName} must be ${allowedTypes.join(', ')}`,
      function (value) {
        if (!value || !(value instanceof File)) return true;
        return allowedTypes.includes(value.type);
      }
    );
  }

  if (maxSizeInMB) {
    schema = schema.test(
      'file-size',
      `${fieldName} must be less than ${maxSizeInMB}MB`,
      function (value) {
        if (!value || !(value instanceof File)) return true;
        return value.size <= maxSizeInMB * 1024 * 1024;
      }
    );
  }

  return schema;
};

/**
 * Helper to extract document ID from S3 path
 * Used in submit handlers to get existing document IDs
 *
 * @param path - S3 path string (e.g., "https://s3.../123_document.pdf")
 * @returns Document ID number or null
 */
export const extractDocumentIdFromPath = (path: string | null): number | null => {
  if (!path) return null;
  const match = path.match(/\/(\d+)_/);
  return match ? parseInt(match[1], 10) : null;
};
