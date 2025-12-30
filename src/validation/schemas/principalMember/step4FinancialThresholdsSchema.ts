import * as Yup from 'yup';
import { requiredFile } from '../../utils/fileValidation';

/**
 * Step 4 Financial Thresholds validation schema - Principal Member
 * Conditionally validates based on bullion turnover and net worth thresholds
 */
export const step4FinancialThresholdsSchema = Yup.lazy((values: any) => {
  console.log('🏗️ Building step4FinancialThresholdsSchema with values:', values);

  let schema = Yup.object({
    // Paid Up Capital - Required numeric
    paidUpCapital: Yup.number()
      .required('Paid up capital is required')
      .positive('Paid up capital must be a positive number')
      .typeError('Paid up capital must be a valid number'),

    // Annual Turnover - Required numeric
    annualTurnover: Yup.number()
      .required('Annual turnover is required')
      .positive('Annual turnover must be a positive number')
      .typeError('Annual turnover must be a valid number'),

    // Bullion Turnover Question
    bullionTurnover: Yup.boolean()
      .nullable()
      .test(
        'is-selected',
        'Please select Yes or No for annual bullion turnover question',
        (value) => value !== null && value !== undefined
      ),

    // Net Worth Question
    netWorth: Yup.boolean()
      .nullable()
      .test(
        'is-selected',
        'Please select Yes or No for net worth question',
        (value) => value !== null && value !== undefined
      ),
  });

  console.log('✅ Base schema created');

  // CONDITIONAL: If bullion turnover >= 50 tons (Yes), require proof file
  if (values.bullionTurnover === true) {
    console.log('🔍 Bullion turnover is YES, adding file validation');
    schema = schema.shape({
      bullionTurnoverFile: requiredFile('Statement of confirmation for Annual Bullion Turnover'),
    });
  }

  // CONDITIONAL: If net worth >= USD 15 million (Yes), require proof file
  if (values.netWorth === true) {
    console.log('🔍 Net worth is YES, adding file validation');
    schema = schema.shape({
      netWorthFile: requiredFile('Net worth proof'),
    });
  }

  return schema;
});
