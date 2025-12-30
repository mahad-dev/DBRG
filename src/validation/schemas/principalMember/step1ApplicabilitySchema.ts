import * as Yup from 'yup';
import { requiredString } from '../../utils/conditionalValidation';
import { requiredFile } from '../../utils/fileValidation';

/**
 * Step 1 Applicability validation schema - Principal Member
 * Conditionally validates based on category selection (refiner vs trading)
 */
export const step1ApplicabilitySchema = Yup.lazy((values: any) => {
  console.log('🏗️ Building step1ApplicabilitySchema with values:', values);

  let schema = Yup.object({
    // Membership type
    membership: requiredString('Membership type'),

    // Services - at least one must be selected
    services: Yup.object().test(
      'at-least-one',
      'Please select at least one service',
      (obj) => obj && Object.values(obj).some(v => v === true)
    ),

    // Category selection required (refiner or trading)
    category: Yup.object().test(
      'category-selected',
      'Please select either Refiner or Trading category',
      (obj) => obj && ((obj as any).refiner === true || (obj as any).trading === true)
    ),

    // AML Notices question
    anyAMLNotices: Yup.boolean()
      .nullable()
      .test(
        'is-selected',
        'Please select Yes or No for AML notices question',
        (value) => value !== null && value !== undefined
      ),

    // Signed AML Declaration file
    signedAMLFile: requiredFile('Signed AML Declaration'),
  });

  console.log('✅ Base schema created with signedAMLFile validation');

  // CONDITIONAL: If refiner selected, validate refiner questions
  if (values.category?.refiner) {
    schema = schema.shape({
      refinerAnswers: Yup.object({
        accredited: Yup.boolean()
          .nullable()
          .test(
            'is-selected',
            'Please answer the accredited refinery question',
            (value) => value !== null && value !== undefined
          ),
        aml5yrs: Yup.boolean()
          .nullable()
          .test(
            'is-selected',
            'Please answer the UAE AML 5+ years question',
            (value) => value !== null && value !== undefined
          ),
        output10tons: Yup.boolean()
          .nullable()
          .test(
            'is-selected',
            'Please answer the output 10+ tons question',
            (value) => value !== null && value !== undefined
          ),
        ratedCompliant: Yup.boolean()
          .nullable()
          .test(
            'is-selected',
            'Please answer the Ministry compliance question',
            (value) => value !== null && value !== undefined
          ),
      }),
    });
  }

  // CONDITIONAL: If trading selected, validate trading questions + evidence file
  if (values.category?.trading) {
    schema = schema.shape({
      tradingAnswers: Yup.object({
        wholesaleBullion: Yup.boolean()
          .nullable()
          .test(
            'is-selected',
            'Please answer the wholesale bullion question',
            (value) => value !== null && value !== undefined
          ),
        bankRelationships: Yup.boolean()
          .nullable()
          .test(
            'is-selected',
            'Please answer the banking relationships question',
            (value) => value !== null && value !== undefined
          ),
      }),
      evidenceFile: requiredFile('Banking relationship evidence'),
    });
  }

  return schema;
});
