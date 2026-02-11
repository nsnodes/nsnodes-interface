'use client';

import { useState, useEffect } from 'react';
import { verifyNSKidsPassword } from '@/lib/actions/auth';

const SESSION_KEY = 'nskids_auth';

interface KidsPasswordGateProps {
  children: React.ReactNode;
}

export function KidsPasswordGate({ children }: KidsPasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check session storage on mount
  useEffect(() => {
    const isAuthed = sessionStorage.getItem(SESSION_KEY) === 'true';
    setIsAuthenticated(isAuthed);
    setIsChecking(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const isValid = await verifyNSKidsPassword(answer);

      if (isValid) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('Incorrect answer. Try again.');
        setAnswer('');
      }
    } catch (err) {
      setError('Failed to verify password. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show nothing while checking auth status
  if (isChecking) {
    return null;
  }

  // Show protected content if authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Show password prompt
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="border-2 border-border bg-card p-8 shadow-brutal-xl">
          <h1 className="text-2xl font-bold font-mono mb-6 text-center">[ ACCESS REQUIRED ]</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="answer" className="block text-sm font-mono font-medium mb-2">
                What channel are Kids at NS inside?
              </label>
              <input
                type="text"
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-4 py-3 border-2 border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                placeholder="Type your answer..."
                autoComplete="off"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm font-mono text-destructive">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 border-2 border-border bg-primary text-primary-foreground font-mono font-bold hover:bg-primary/90 transition-colors shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0"
            >
              {isSubmitting ? '[ VERIFYING... ]' : '[ SUBMIT ]'}
            </button>
          </form>

          <p className="mt-4 text-xs text-center font-mono text-muted-foreground">
            Hint: Look for the answer in the NS Discord
          </p>
        </div>
      </div>
    </div>
  );
}
