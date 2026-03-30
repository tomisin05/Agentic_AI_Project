import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Scheduler } from './Scheduler';
import { motion } from 'motion/react';

interface SchedulerSettingsProps {
  onBack: () => void;
}

export function SchedulerSettings({ onBack }: SchedulerSettingsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Study
          </Button>
        </div>

        {/* Scheduler Component */}
        <Scheduler />
      </div>
    </motion.div>
  );
}
