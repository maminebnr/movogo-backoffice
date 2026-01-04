"use client";

import { useEffect } from "react";

export function SuppressAbortErrors() {
  useEffect(() => {
    // Suppress Apollo Client AbortErrors in development (harmless hot reload errors)
    if (process.env.NODE_ENV === 'development') {
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        const error = event.reason;
        if (
          error?.name === 'AbortError' &&
          (error?.message?.includes('signal is aborted') || 
           error?.message?.includes('aborted without reason'))
        ) {
          event.preventDefault();
        }
      };

      window.addEventListener('unhandledrejection', handleUnhandledRejection);

      return () => {
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }
  }, []);

  return null;
}

