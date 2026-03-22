import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends (Component as any) {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      let errorMessage = 'მოხდა გაუთვალისწინებელი შეცდომა';
      let errorDetails = '';

      try {
        const parsed = JSON.parse(this.state.error?.message || '');
        if (parsed.error && parsed.operationType) {
          errorMessage = `Firestore შეცდომა: ${parsed.operationType}`;
          errorDetails = parsed.error;
          if (parsed.error.includes('Missing or insufficient permissions')) {
            errorMessage = 'წვდომა უარყოფილია';
            errorDetails = 'თქვენ არ გაქვთ ამ მოქმედების შესრულების უფლება. გთხოვთ, შეამოწმოთ თქვენი ავტორიზაცია.';
          }
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <Card className="max-w-md w-full rounded-[2rem] border-none shadow-2xl overflow-hidden">
            <CardHeader className="bg-destructive/5 text-destructive pb-8">
              <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
                <AlertCircle className="h-10 w-10" />
              </div>
              <CardTitle className="text-2xl font-bold">{errorMessage}</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <p className="text-slate-600 leading-relaxed">
                {errorDetails || 'გთხოვთ, სცადოთ გვერდის განახლება ან დაუკავშირდეთ მხარდაჭერას.'}
              </p>
              <Button 
                onClick={this.handleReset}
                className="w-full h-12 rounded-xl font-bold gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                გვერდის განახლება
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
