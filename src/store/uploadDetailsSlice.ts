import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  UploadDetailsState,
  UploadDetailsPayload
} from '../types/uploadDetails';
import { MemberApplicationSection } from '../types/uploadDetails';
import { uploadDetailsApi } from '@/services/uploadDetailsApi';

/* ------------------------------------------------------------------ */
/* Async Thunks */
/* ------------------------------------------------------------------ */

export const uploadDocument = createAsyncThunk(
  'uploadDetails/uploadDocument',
  async (file: File, { rejectWithValue }) => {
    try {
      const documentId = await uploadDetailsApi.uploadDocument(file);
      return documentId;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to upload document');
    }
  }
);

export const saveUploadDetails = createAsyncThunk(
  'uploadDetails/saveUploadDetails',
  async (
    {
      payload,
      sectionNumber,
    }: {
      payload: Partial<UploadDetailsPayload>;
      sectionNumber: MemberApplicationSection;
    },
    { rejectWithValue }
  ) => {
    try {
      await uploadDetailsApi.saveUploadDetails(payload, sectionNumber);
      return sectionNumber; // ✅ IMPORTANT
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to save upload details');
    }
  }
);

export const getUploadDetails = createAsyncThunk(
  'uploadDetails/getUploadDetails',
  async (userId: string, { rejectWithValue }) => {
    try {
      const data = await uploadDetailsApi.getUploadDetails(userId);
      return { data, userId };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch upload details');
    }
  }
);

export const getDocumentPath = createAsyncThunk(
  'uploadDetails/getDocumentPath',
  async (id: number, { rejectWithValue }) => {
    try {
      const path = await uploadDetailsApi.getDocumentPath(id);
      return { id, path };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to get document path');
    }
  }
);

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

const addUniqueStep = (
  steps: MemberApplicationSection[],
  step: MemberApplicationSection
) => {
  if (!steps.includes(step)) {
    steps.push(step);
  }
};

/* ------------------------------------------------------------------ */
/* Initial State */
/* ------------------------------------------------------------------ */

const initialState: UploadDetailsState = {
  data: {},
  currentStep: MemberApplicationSection.Applicability,
  isLoading: false,
  isSaving: false,
  errors: {},
  completedSteps: [], // ✅ ARRAY (Redux-safe)
  userId: undefined,
};

/* ------------------------------------------------------------------ */
/* Slice */
/* ------------------------------------------------------------------ */

const uploadDetailsSlice = createSlice({
  name: 'uploadDetails',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<MemberApplicationSection>) => {
      state.currentStep = action.payload;
    },

    updateFormData: (
      state,
      action: PayloadAction<Partial<UploadDetailsPayload>>
    ) => {
      state.data = { ...state.data, ...action.payload };
    },

    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },

    clearErrors: (state) => {
      state.errors = {};
    },

    resetForm: () => initialState,
  },

  extraReducers: (builder) => {
    /* ---------------- Upload Document ---------------- */
    builder
      .addCase(uploadDocument.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadDocument.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.errors.upload = action.payload as string;
      });

    /* ---------------- Save Upload Details ---------------- */
    builder
      .addCase(saveUploadDetails.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(saveUploadDetails.fulfilled, (state, action) => {
        state.isSaving = false;

        const sectionNumber = action.payload;

        addUniqueStep(state.completedSteps, sectionNumber);

        if (sectionNumber < MemberApplicationSection.DeclarationConsent) {
          state.currentStep = sectionNumber + 1;
        }
      })
      .addCase(saveUploadDetails.rejected, (state, action) => {
        state.isSaving = false;
        state.errors.save = action.payload as string;
      });

    /* ---------------- Get Upload Details ---------------- */
    builder
      .addCase(getUploadDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUploadDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
        state.userId = action.payload.userId;
        state.completedSteps = [];

        const sectionKeys: Record<
          MemberApplicationSection,
          keyof UploadDetailsPayload
        > = {
          [MemberApplicationSection.Applicability]: 'applicability',
          [MemberApplicationSection.CompanyDetails]: 'companyDetails',
          [MemberApplicationSection.BankRelationReq]:
            'bankRelationshipRequirement',
          [MemberApplicationSection.FinancialThreshold]:
            'financialThresholds',
          [MemberApplicationSection.RegulatorCompliance]:
            'regulatoryCompliance',
          [MemberApplicationSection.RequiredDocs]:
            'memberRequiredDocuments',
          [MemberApplicationSection.DataProtectionPrivacy]:
            'dataProtectionPrivacy',
          [MemberApplicationSection.DeclarationConsent]:
            'declarationConsent',
        };

        const sections = Object.values(MemberApplicationSection).filter(
          (v) => typeof v === 'number'
        ) as MemberApplicationSection[];

        for (const section of sections) {
          const key = sectionKeys[section];
          if (action.payload.data[key]) {
            addUniqueStep(state.completedSteps, section);
          }
        }

        const firstIncomplete =
          sections.find(
            (s) => !state.completedSteps.includes(s)
          ) ?? MemberApplicationSection.DeclarationConsent;

        state.currentStep = firstIncomplete;
      })
      .addCase(getUploadDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.errors.fetch = action.payload as string;
      });

    /* ---------------- Get Document Path ---------------- */
    builder
      .addCase(getDocumentPath.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDocumentPath.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(getDocumentPath.rejected, (state, action) => {
        state.isLoading = false;
        state.errors.document = action.payload as string;
      });
  },
});

/* ------------------------------------------------------------------ */
/* Exports */
/* ------------------------------------------------------------------ */

export const {
  setCurrentStep,
  updateFormData,
  setUserId,
  clearErrors,
  resetForm,
} = uploadDetailsSlice.actions;

export const selectUploadDetails = (state: {
  uploadDetails: UploadDetailsState;
}) => state.uploadDetails;

export const selectCurrentStep = (state: {
  uploadDetails: UploadDetailsState;
}) => state.uploadDetails.currentStep;

export const selectFormData = (state: {
  uploadDetails: UploadDetailsState;
}) => state.uploadDetails.data;

export const selectIsLoading = (state: {
  uploadDetails: UploadDetailsState;
}) => state.uploadDetails.isLoading;

export const selectIsSaving = (state: {
  uploadDetails: UploadDetailsState;
}) => state.uploadDetails.isSaving;

export const selectErrors = (state: {
  uploadDetails: UploadDetailsState;
}) => state.uploadDetails.errors;

export const selectCompletedSteps = (state: {
  uploadDetails: UploadDetailsState;
}) => state.uploadDetails.completedSteps;

export const selectUserId = (state: {
  uploadDetails: UploadDetailsState;
}) => state.uploadDetails.userId;

export default uploadDetailsSlice.reducer;
