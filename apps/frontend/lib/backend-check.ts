// Utility to check if backend is available
let backendAvailable: boolean | null = null;

export const checkBackendAvailability = async (): Promise<boolean> => {
  if (backendAvailable !== null) {
    return backendAvailable;
  }

  try {
    const response = await fetch('/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Short timeout to avoid hanging
      signal: AbortSignal.timeout(2000),
    });
    
    backendAvailable = response.ok;
    return backendAvailable;
  } catch (error) {
    backendAvailable = false;
    return false;
  }
};

export const isBackendAvailable = (): boolean => {
  return backendAvailable ?? false;
};

export const resetBackendCheck = (): void => {
  backendAvailable = null;
}; 