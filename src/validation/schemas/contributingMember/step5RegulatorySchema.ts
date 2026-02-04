import * as Yup from 'yup';
import { requiredBoolean, requiredString, requiredEmail } from '../../utils/conditionalValidation';
import { requiredFile } from '../../utils/fileValidation';

/**
 * Step 5 Regulatory & Compliance validation schema - Contributing Member
 * Note: This is Step 3 in Contributing Member flow
 * Conditionally validates based on user answers (Yes/No fields)
 */
export const step5RegulatorySchema = Yup.lazy((values: any) => {
  let schema = Yup.object({
    // AML/CFT Compliance
    compliantUAE: requiredBoolean('AML/CFT compliance'),

    // Ongoing Cases
    ongoingCases: requiredBoolean('Ongoing cases question'),

    // Sanctions List
    sanctionsListed: requiredBoolean('Sanctions list question'),

    // AML Policies
    policiesPrepared: requiredBoolean('AML policies question'),

    // Training
    trainingOngoing: requiredBoolean('Training question'),

    // ID Processes
    idProcesses: requiredBoolean('ID processes question'),

    // Risk Assessment
    riskAssessment: requiredBoolean('Risk assessment question'),

    // Penalties
    penalties: requiredBoolean('Penalties question'),

    // Supply Chain Compliance
    supplyChainCompliant: requiredBoolean('Supply chain compliance'),
    preciousPolicy: requiredBoolean('Precious metals policy question'),
    responsibleSourcingAudit: requiredBoolean('Responsible sourcing audit question'),
  });

  // CONDITIONAL: If compliantUAE = true, require officer details
  if (values.compliantUAE === true) {
    schema = schema.shape({
      officerName: requiredString('Officer name'),
      officerDesignation: requiredString('Officer designation'),
      officerContact: requiredString('Officer contact number'),
      officerEmail: requiredEmail('Officer email'),
    });
  }

  // CONDITIONAL: If ongoingCases = true, require details and file
  if (values.ongoingCases === true) {
    schema = schema.shape({
      ongoingCasesDetails: requiredString('Ongoing cases details'),
      ongoingDetailsFile: requiredFile('Supporting documents'),
      ongoingDetailsFileId: Yup.number().nullable(),
    });
  }

  // CONDITIONAL: If policiesPrepared = true, require AML policy file
  if (values.policiesPrepared === true) {
    schema = schema.shape({
      amlPolicyFile: requiredFile('AML/CFT policy document'),
      amlPolicyFileId: Yup.number().nullable(),
    });
  }

  // CONDITIONAL: If penalties = true, require explanation and declaration file
  if (values.penalties === true) {
    schema = schema.shape({
      penaltyExplanation: requiredString('Penalty explanation'),
      declarationFile: requiredFile('Declaration document'),
      declarationFileId: Yup.number().nullable(),
    });
  }

  // CONDITIONAL: If preciousPolicy = true, require supply chain policy file
  if (values.preciousPolicy === true) {
    schema = schema.shape({
      supplyChainDueDiligenceFile: requiredFile('Supply chain policy document'),
      supplyChainDueDiligenceFileId: Yup.number().nullable(),
    });
  }

  // CONDITIONAL: If responsibleSourcingAudit = true, require audit evidence file
  if (values.responsibleSourcingAudit === true) {
    schema = schema.shape({
      responsibleSourcingFile: requiredFile('Audit evidence document'),
      responsibleSourcingFileId: Yup.number().nullable(),
    });
  }

  return schema;
});
