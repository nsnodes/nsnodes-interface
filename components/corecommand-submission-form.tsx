"use client";

import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import type { CoreCommandment } from '@/lib/types/corecommand';
import CoreCommandLLMAssistant from '@/components/corecommand-llm-assistant';

interface CoreCommandSubmissionFormProps {
  onSubmit: (commandment: CoreCommandment) => void;
  onClose: () => void;
}

export default function CoreCommandSubmissionForm({
  onSubmit,
  onClose
}: CoreCommandSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantSection, setAssistantSection] = useState<'title' | 'commandment' | 'description'>('title');
  const [error, setError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [commandment, setCommandment] = useState('');
  const [description, setDescription] = useState('');
  const [submitterName, setSubmitterName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate
      if (!title.trim() || !commandment.trim() || !description.trim() || !submitterName.trim()) {
        setError('Please fill in all fields');
        setIsSubmitting(false);
        return;
      }

      // Convert to .eth name if not already
      const ethName = submitterName.endsWith('.eth') ? submitterName : `${submitterName}.eth`;

      // Create new commandment
      const newCommandment: CoreCommandment = {
        id: Date.now().toString(),
        title: title.trim(),
        commandment: commandment.trim(),
        description: description.trim(),
        upvotes: 0,
        downvotes: 0,
        voterNames: [],
        createdAt: new Date(),
        netVotes: 0,
        proposedBy: ethName
      };

      onSubmit(newCommandment);

      // Reset form
      setTitle('');
      setCommandment('');
      setDescription('');
      setSubmitterName('');
    } catch (err) {
      setError('Failed to submit. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAssistant = (section: 'title' | 'commandment' | 'description') => {
    setAssistantSection(section);
    setShowAssistant(true);
  };

  const inputClass = "w-full px-3 py-2 border-2 border-border bg-background font-mono focus:outline-none focus:ring-2 focus:ring-ring";
  const labelClass = "block text-sm font-mono font-medium mb-1";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold font-mono">[ PROPOSE COMMANDMENT ]</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-accent transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="p-3 border-2 border-destructive bg-destructive/10 text-destructive font-mono text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="title" className={labelClass}>
              Society Title *
            </label>
            <button
              type="button"
              onClick={() => openAssistant('title')}
              className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3" />
              AI Assist
            </button>
          </div>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., The Long-Attention Society"
            className={inputClass}
            disabled={isSubmitting}
          />
        </div>

        {/* Commandment */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="commandment" className={labelClass}>
              The Commandment (Core Principle) *
            </label>
            <button
              type="button"
              onClick={() => openAssistant('commandment')}
              className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3" />
              AI Assist
            </button>
          </div>
          <textarea
            id="commandment"
            value={commandment}
            onChange={(e) => setCommandment(e.target.value)}
            placeholder="One clear, memorable sentence stating the principle..."
            rows={2}
            className={inputClass}
            disabled={isSubmitting}
          />
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Keep it to 1-2 sentences max. This is the core principle.
          </p>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="description" className={labelClass}>
              Description *
            </label>
            <button
              type="button"
              onClick={() => openAssistant('description')}
              className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3" />
              AI Assist
            </button>
          </div>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain what this society does and why it matters..."
            rows={4}
            className={inputClass}
            disabled={isSubmitting}
          />
          <p className="text-xs font-mono text-muted-foreground mt-1">
            2-3 sentences explaining the concept.
          </p>
        </div>

        {/* Submitter Name */}
        <div>
          <label htmlFor="submitterName" className={labelClass}>
            Your .eth Name *
          </label>
          <input
            type="text"
            id="submitterName"
            value={submitterName}
            onChange={(e) => setSubmitterName(e.target.value)}
            placeholder="yourname.eth"
            className={inputClass}
            disabled={isSubmitting}
          />
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Will be shown as "Proposed by yourname.eth"
          </p>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 border-2 border-border bg-primary text-primary-foreground font-mono font-bold hover:bg-primary/90 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:translate-x-0 disabled:translate-y-0"
          >
            {isSubmitting ? '[ SUBMITTING... ]' : '[ SUBMIT COMMANDMENT ]'}
          </button>
        </div>
      </form>

      {/* LLM Assistant Modal */}
      {showAssistant && (
        <CoreCommandLLMAssistant
          section={assistantSection}
          currentText={assistantSection === 'title' ? title : assistantSection === 'commandment' ? commandment : description}
          context={`Title: ${title}\nCommandment: ${commandment}`}
          onSelect={(improved) => {
            if (assistantSection === 'title') setTitle(improved);
            else if (assistantSection === 'commandment') setCommandment(improved);
            else setDescription(improved);
            setShowAssistant(false);
          }}
          onClose={() => setShowAssistant(false)}
        />
      )}
    </div>
  );
}
