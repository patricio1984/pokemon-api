import React, { Component } from 'react'
import type { ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Optionally log to an error reporting service
    console.error('Uncaught error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex items-center justify-center bg-(--color-nearblack) text-red-500 p-4">
          <div className="max-w-lg text-center">
            <h1 className="text-3xl font-bold mb-2">Something went wrong.</h1>
            <p className="mb-4">An unexpected error occurred while rendering the application.</p>
            <pre className="text-xs whitespace-pre-wrap wrap-break-word">
              {this.state.error?.message}
            </pre>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
