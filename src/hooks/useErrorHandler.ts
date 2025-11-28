import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  context?: string;
}

export interface ErrorState {
  error: AppError | null;
  isLoading: boolean;
  hasError: boolean;
}

export interface UseErrorHandlerReturn {
  error: AppError | null;
  isLoading: boolean;
  hasError: boolean;
  setError: (error: AppError | null) => void;
  clearError: () => void;
  handleAsync: <T>(
    asyncFn: () => Promise<T>,
    options?: {
      showToast?: boolean;
      context?: string;
      onError?: (error: AppError) => void;
      onSuccess?: (result: T) => void;
    }
  ) => Promise<T | null>;
  handleError: (
    error: unknown,
    context?: string,
    showToast?: boolean
  ) => AppError;
}

// Error code mappings for user-friendly messages
const ERROR_MESSAGES: Record<string, string> = {
  // Network errors
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  
  // Authentication errors
  UNAUTHORIZED: 'You are not authorized to perform this action. Please log in again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  
  // Validation errors
  VALIDATION_ERROR: 'Please check your input and try again.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  INVALID_DATE: 'Please enter a valid date.',
  
  // Patient errors
  PATIENT_NOT_FOUND: 'Patient not found. Please verify the patient ID.',
  PATIENT_ALREADY_EXISTS: 'A patient with this information already exists.',
  PATIENT_UPDATE_FAILED: 'Failed to update patient information. Please try again.',
  
  // Appointment errors
  APPOINTMENT_NOT_FOUND: 'Appointment not found.',
  APPOINTMENT_CONFLICT: 'This time slot is already booked. Please choose another time.',
  APPOINTMENT_PAST_DATE: 'Cannot schedule appointments in the past.',
  APPOINTMENT_CANCELLATION_FAILED: 'Failed to cancel appointment. Please try again.',
  
  // Medical record errors
  RECORD_NOT_FOUND: 'Medical record not found.',
  RECORD_ACCESS_DENIED: 'You do not have permission to access this medical record.',
  RECORD_UPDATE_FAILED: 'Failed to update medical record. Please try again.',
  
  // Lab result errors
  LAB_RESULT_NOT_FOUND: 'Lab result not found.',
  LAB_ORDER_FAILED: 'Failed to create lab order. Please try again.',
  CRITICAL_RESULT_NOTIFICATION_FAILED: 'Failed to send critical result notification.',
  
  // Prescription errors
  PRESCRIPTION_NOT_FOUND: 'Prescription not found.',
  PRESCRIPTION_EXPIRED: 'This prescription has expired.',
  DRUG_INTERACTION: 'Potential drug interaction detected. Please review.',
  ALLERGY_ALERT: 'Patient has a known allergy to this medication.',
  
  // File upload errors
  FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a supported format.',
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  
  // Server errors
  SERVER_ERROR: 'An internal server error occurred. Please try again later.',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable. Please try again later.',
  DATABASE_ERROR: 'Database error occurred. Please contact support.',
  
  // Generic errors
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  OPERATION_FAILED: 'Operation failed. Please try again.',
};

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Get error severity based on error code
const getErrorSeverity = (code: string): ErrorSeverity => {
  const criticalErrors = ['SERVER_ERROR', 'DATABASE_ERROR', 'CRITICAL_RESULT_NOTIFICATION_FAILED'];
  const highErrors = ['UNAUTHORIZED', 'FORBIDDEN', 'TOKEN_EXPIRED', 'DRUG_INTERACTION', 'ALLERGY_ALERT'];
  const mediumErrors = ['VALIDATION_ERROR', 'APPOINTMENT_CONFLICT', 'PATIENT_NOT_FOUND'];
  
  if (criticalErrors.includes(code)) return ErrorSeverity.CRITICAL;
  if (highErrors.includes(code)) return ErrorSeverity.HIGH;
  if (mediumErrors.includes(code)) return ErrorSeverity.MEDIUM;
  return ErrorSeverity.LOW;
};

// Convert unknown error to AppError
const normalizeError = (error: unknown, context?: string): AppError => {
  if (error instanceof Error) {
    // Handle fetch/network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        code: 'NETWORK_ERROR',
        message: ERROR_MESSAGES.NETWORK_ERROR,
        details: error.message,
        timestamp: new Date(),
        context,
      };
    }
    
    // Handle timeout errors
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return {
        code: 'TIMEOUT_ERROR',
        message: ERROR_MESSAGES.TIMEOUT_ERROR,
        details: error.message,
        timestamp: new Date(),
        context,
      };
    }
    
    // Handle API response errors
    if (error.message.includes('401')) {
      return {
        code: 'UNAUTHORIZED',
        message: ERROR_MESSAGES.UNAUTHORIZED,
        details: error.message,
        timestamp: new Date(),
        context,
      };
    }
    
    if (error.message.includes('403')) {
      return {
        code: 'FORBIDDEN',
        message: ERROR_MESSAGES.FORBIDDEN,
        details: error.message,
        timestamp: new Date(),
        context,
      };
    }
    
    if (error.message.includes('404')) {
      return {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found.',
        details: error.message,
        timestamp: new Date(),
        context,
      };
    }
    
    if (error.message.includes('500')) {
      return {
        code: 'SERVER_ERROR',
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message,
        timestamp: new Date(),
        context,
      };
    }
    
    // Generic error
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      details: error.stack,
      timestamp: new Date(),
      context,
    };
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return {
      code: 'UNKNOWN_ERROR',
      message: error,
      timestamp: new Date(),
      context,
    };
  }
  
  // Handle object errors (e.g., from API responses)
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as any;
    return {
      code: errorObj.code || 'UNKNOWN_ERROR',
      message: errorObj.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      details: errorObj.details || errorObj,
      timestamp: new Date(),
      context,
    };
  }
  
  // Fallback for unknown error types
  return {
    code: 'UNKNOWN_ERROR',
    message: ERROR_MESSAGES.UNKNOWN_ERROR,
    details: error,
    timestamp: new Date(),
    context,
  };
};

// Show toast notification based on error severity
const showErrorToast = (error: AppError) => {
  const severity = getErrorSeverity(error.code);
  
  switch (severity) {
    case ErrorSeverity.CRITICAL:
      toast.error(error.message, {
        duration: 10000,
        description: 'Please contact system administrator if this persists.',
      });
      break;
    case ErrorSeverity.HIGH:
      toast.error(error.message, {
        duration: 8000,
      });
      break;
    case ErrorSeverity.MEDIUM:
      toast.warning(error.message, {
        duration: 6000,
      });
      break;
    case ErrorSeverity.LOW:
    default:
      toast.error(error.message, {
        duration: 4000,
      });
      break;
  }
};

// Log error for monitoring/debugging
const logError = (error: AppError) => {
  const severity = getErrorSeverity(error.code);
  
  const logData = {
    timestamp: error.timestamp.toISOString(),
    code: error.code,
    message: error.message,
    context: error.context,
    severity,
    details: error.details,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };
  
  // In production, send to error monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Sentry, LogRocket, or custom error service
    console.error('[Error Logged]', logData);
  } else {
    console.error('[Development Error]', logData);
  }
};

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isLoading: false,
    hasError: false,
  });

  const setError = useCallback((error: AppError | null) => {
    setErrorState(prev => ({
      ...prev,
      error,
      hasError: error !== null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setErrorState(prev => ({
      ...prev,
      error: null,
      hasError: false,
    }));
  }, []);

  const handleError = useCallback((
    error: unknown,
    context?: string,
    showToast: boolean = true
  ): AppError => {
    const normalizedError = normalizeError(error, context);
    
    // Log the error
    logError(normalizedError);
    
    // Show toast notification if requested
    if (showToast) {
      showErrorToast(normalizedError);
    }
    
    // Update error state
    setError(normalizedError);
    
    return normalizedError;
  }, [setError]);

  const handleAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options: {
      showToast?: boolean;
      context?: string;
      onError?: (error: AppError) => void;
      onSuccess?: (result: T) => void;
    } = {}
  ): Promise<T | null> => {
    const {
      showToast = true,
      context,
      onError,
      onSuccess,
    } = options;

    try {
      // Clear previous errors
      clearError();
      
      // Set loading state
      setErrorState(prev => ({ ...prev, isLoading: true }));
      
      // Execute async function
      const result = await asyncFn();
      
      // Clear loading state
      setErrorState(prev => ({ ...prev, isLoading: false }));
      
      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      // Clear loading state
      setErrorState(prev => ({ ...prev, isLoading: false }));
      
      // Handle the error
      const appError = handleError(error, context, showToast);
      
      // Call error callback
      if (onError) {
        onError(appError);
      }
      
      return null;
    }
  }, [clearError, handleError]);

  return {
    error: errorState.error,
    isLoading: errorState.isLoading,
    hasError: errorState.hasError,
    setError,
    clearError,
    handleAsync,
    handleError,
  };
};

export default useErrorHandler;

