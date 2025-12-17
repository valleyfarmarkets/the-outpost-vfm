'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Booking Error Boundary
 * 
 * Catches render errors in the booking wizard to prevent the entire app from crashing.
 * Displays a user-friendly error message and debug details.
 */
export class BookingErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('[BookingErrorBoundary] Caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center h-[50vh]">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            We encountered an unexpected error while processing your booking. 
            Please try again.
          </p>
          
          <Button onClick={this.handleReset} className="min-w-[140px]">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          {/* Debug Info */}
          <div className="mt-8 w-full text-left bg-gray-900 rounded-lg p-4 overflow-auto max-h-[200px] border border-gray-700">
            <p className="text-xs font-mono text-red-400 font-bold mb-2">
              DEBUG ERROR: {this.state.error?.toString()}
            </p>
            {this.state.errorInfo && (
              <pre className="text-[10px] font-mono text-gray-400 leading-tight">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
