'use client';

import { useState } from 'react';
import { createKidsSubmission } from '@/lib/actions/kids';
import type { KidsSubmissionInput } from '@/lib/types/kids';

interface KidsSubmissionFormProps {
  onSubmitSuccess: () => void;
}

export function KidsSubmissionForm({ onSubmitSuccess }: KidsSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [kid1Age, setKid1Age] = useState('');
  const [kid2Age, setKid2Age] = useState('');
  const [kid3Age, setKid3Age] = useState('');
  const [kid4Age, setKid4Age] = useState('');
  const [parent1Discord, setParent1Discord] = useState('');
  const [parent2Discord, setParent2Discord] = useState('');

  // Show/hide optional fields
  const [showKid2, setShowKid2] = useState(false);
  const [showKid3, setShowKid3] = useState(false);
  const [showKid4, setShowKid4] = useState(false);
  const [showParent2, setShowParent2] = useState(false);

  const ageOptions = Array.from({ length: 15 }, (_, i) => i + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate required fields (kid age is now optional)
      if (!startDate || !endDate || !parent1Discord.trim()) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // Validate date range
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        setError('End date must be after start date');
        setIsSubmitting(false);
        return;
      }

      // Build submission data
      const input: KidsSubmissionInput = {
        startDate: start,
        endDate: end,
        parent1Discord: parent1Discord.trim(),
      };

      // Add optional fields if present
      if (kid1Age) input.kid1Age = parseInt(kid1Age);
      if (showKid2 && kid2Age) input.kid2Age = parseInt(kid2Age);
      if (showKid3 && kid3Age) input.kid3Age = parseInt(kid3Age);
      if (showKid4 && kid4Age) input.kid4Age = parseInt(kid4Age);
      if (showParent2 && parent2Discord.trim()) input.parent2Discord = parent2Discord.trim();

      await createKidsSubmission(input);

      // Reset form
      setStartDate('');
      setEndDate('');
      setKid1Age('');
      setKid2Age('');
      setKid3Age('');
      setKid4Age('');
      setParent1Discord('');
      setParent2Discord('');
      setShowKid2(false);
      setShowKid3(false);
      setShowKid4(false);
      setShowParent2(false);

      onSubmitSuccess();
    } catch (err) {
      setError('Failed to submit. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-3 py-2 border-2 border-border bg-background font-mono focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer";
  const dateInputClass = inputClass + " [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:invert [&::-webkit-calendar-picker-indicator]:dark:brightness-200";
  const labelClass = "block text-sm font-mono font-medium mb-1";
  const buttonClass = "px-3 py-2 border-2 border-border hover:bg-primary hover:text-primary-foreground font-mono transition-colors";

  return (
    <form onSubmit={handleSubmit} className="border-2 border-border bg-card p-6 shadow-brutal-xl">
      <h2 className="text-xl sm:text-2xl font-bold font-mono mb-6">[ ADD YOUR STAY ]</h2>

      {error && (
        <div className="mb-4 p-3 border-2 border-destructive bg-destructive/10 text-destructive font-mono text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Range */}
        <div>
          <label htmlFor="startDate" className={labelClass}>
            From Date *
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            onClick={(e) => e.currentTarget.showPicker?.()}
            min={new Date().toISOString().split('T')[0]}
            style={{ colorScheme: 'light' }}
            className={dateInputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="endDate" className={labelClass}>
            To Date *
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            onClick={(e) => e.currentTarget.showPicker?.()}
            min={startDate || new Date().toISOString().split('T')[0]}
            style={{ colorScheme: 'light' }}
            className={dateInputClass}
            required
          />
        </div>

        {/* Kid 1 */}
        <div>
          <label htmlFor="kid1Age" className={labelClass}>
            Kid 1 Age
          </label>
          <select id="kid1Age" value={kid1Age} onChange={(e) => setKid1Age(e.target.value)} className={inputClass}>
            <option value="">Select age</option>
            {ageOptions.map((age) => (
              <option key={age} value={age}>{age} {age === 1 ? 'year' : 'years'}</option>
            ))}
          </select>
        </div>

        {/* Kid 2 (Optional) */}
        {showKid2 ? (
          <div>
            <label htmlFor="kid2Age" className={labelClass}>Kid 2 Age</label>
            <div className="flex gap-2">
              <select id="kid2Age" value={kid2Age} onChange={(e) => setKid2Age(e.target.value)} className={inputClass + " flex-1"}>
                <option value="">Select age</option>
                {ageOptions.map((age) => (
                  <option key={age} value={age}>{age} {age === 1 ? 'year' : 'years'}</option>
                ))}
              </select>
              <button type="button" onClick={() => { setShowKid2(false); setKid2Age(''); }} className={buttonClass}>✕</button>
            </div>
          </div>
        ) : (
          <div>
            <label className={labelClass}>&nbsp;</label>
            <button type="button" onClick={() => setShowKid2(true)} className={buttonClass + " w-full"}>+ Add Kid 2</button>
          </div>
        )}

        {/* Kid 3 (Optional) */}
        {showKid3 ? (
          <div>
            <label htmlFor="kid3Age" className={labelClass}>Kid 3 Age</label>
            <div className="flex gap-2">
              <select id="kid3Age" value={kid3Age} onChange={(e) => setKid3Age(e.target.value)} className={inputClass + " flex-1"}>
                <option value="">Select age</option>
                {ageOptions.map((age) => (
                  <option key={age} value={age}>{age} {age === 1 ? 'year' : 'years'}</option>
                ))}
              </select>
              <button type="button" onClick={() => { setShowKid3(false); setKid3Age(''); }} className={buttonClass}>✕</button>
            </div>
          </div>
        ) : showKid2 ? (
          <div>
            <label className={labelClass}>&nbsp;</label>
            <button type="button" onClick={() => setShowKid3(true)} className={buttonClass + " w-full"}>+ Add Kid 3</button>
          </div>
        ) : null}

        {/* Kid 4 (Optional) */}
        {showKid4 ? (
          <div>
            <label htmlFor="kid4Age" className={labelClass}>Kid 4 Age</label>
            <div className="flex gap-2">
              <select id="kid4Age" value={kid4Age} onChange={(e) => setKid4Age(e.target.value)} className={inputClass + " flex-1"}>
                <option value="">Select age</option>
                {ageOptions.map((age) => (
                  <option key={age} value={age}>{age} {age === 1 ? 'year' : 'years'}</option>
                ))}
              </select>
              <button type="button" onClick={() => { setShowKid4(false); setKid4Age(''); }} className={buttonClass}>✕</button>
            </div>
          </div>
        ) : showKid3 ? (
          <div>
            <label className={labelClass}>&nbsp;</label>
            <button type="button" onClick={() => setShowKid4(true)} className={buttonClass + " w-full"}>+ Add Kid 4</button>
          </div>
        ) : null}

        {/* Parent 1 (Required) */}
        <div>
          <label htmlFor="parent1Discord" className={labelClass}>
            Parent 1 Discord Name *
          </label>
          <input
            type="text"
            id="parent1Discord"
            value={parent1Discord}
            onChange={(e) => setParent1Discord(e.target.value)}
            className={inputClass}
            placeholder="@username"
            required
          />
        </div>

        {/* Parent 2 (Optional) */}
        {showParent2 ? (
          <div>
            <label htmlFor="parent2Discord" className={labelClass}>Parent 2 Discord Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                id="parent2Discord"
                value={parent2Discord}
                onChange={(e) => setParent2Discord(e.target.value)}
                className={inputClass + " flex-1"}
                placeholder="@username"
              />
              <button type="button" onClick={() => { setShowParent2(false); setParent2Discord(''); }} className={buttonClass}>✕</button>
            </div>
          </div>
        ) : (
          <div>
            <label className={labelClass}>&nbsp;</label>
            <button type="button" onClick={() => setShowParent2(true)} className={buttonClass + " w-full"}>+ Add Parent 2</button>
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 border-2 border-border bg-primary text-primary-foreground font-mono font-bold hover:bg-primary/90 transition-colors shadow-brutal-md disabled:opacity-50 disabled:cursor-not-allowed hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:translate-x-0 disabled:translate-y-0"
        >
          {isSubmitting ? '[ SUBMITTING... ]' : '[ ADD STAY ]'}
        </button>
      </div>
    </form>
  );
}
