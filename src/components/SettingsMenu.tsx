import { useState } from 'react';
import { X, Target, Calendar, Zap, Database, Languages, Eye, Download, Upload, Settings as SettingsIcon, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion, AnimatePresence } from 'motion/react';
import { GoalSetup } from './GoalSetup';
import { Scheduler } from './Scheduler';
import { SessionPresets } from './SessionPresets';
import { DataExportImport } from './DataExportImport';
import { LanguageSettings } from './LanguageSettings';
import { AccessibilitySettings } from './AccessibilitySettings';
import { AdaptiveInsightsDisplay } from './AdaptiveInsightsDisplay';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  journalEntries?: Array<{
    date: string;
    focusRating: number;
    duration?: number;
  }>;
}

export function SettingsMenu({ isOpen, onClose, journalEntries }: SettingsMenuProps) {
  const [activeTab, setActiveTab] = useState('goals');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Settings & Features</h2>
                <p className="text-sm text-gray-600">Manage your study tools and preferences</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="sticky top-0 bg-white border-b z-10 px-6 pt-4">
                <TabsList className="grid w-full grid-cols-7 gap-2">
                  <TabsTrigger value="goals" className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span className="hidden sm:inline">Goals</span>
                  </TabsTrigger>
                  <TabsTrigger value="scheduler" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="hidden sm:inline">Scheduler</span>
                  </TabsTrigger>
                  <TabsTrigger value="presets" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span className="hidden sm:inline">Presets</span>
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    <span className="hidden sm:inline">Insights</span>
                  </TabsTrigger>
                  <TabsTrigger value="data" className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    <span className="hidden sm:inline">Data</span>
                  </TabsTrigger>
                  <TabsTrigger value="language" className="flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    <span className="hidden sm:inline">Language</span>
                  </TabsTrigger>
                  <TabsTrigger value="accessibility" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Access</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="goals" className="mt-0">
                  <Card className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">📚 Goal Management</h3>
                      <p className="text-gray-600">Define study goals, track tasks, and monitor progress toward your objectives.</p>
                    </div>
                    <GoalSetup />
                  </Card>
                </TabsContent>

                <TabsContent value="scheduler" className="mt-0">
                  <Card className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">📅 Study Scheduler</h3>
                      <p className="text-gray-600">Plan your study sessions, sync with calendar, and stay organized.</p>
                    </div>
                    <Scheduler />
                  </Card>
                </TabsContent>

                <TabsContent value="presets" className="mt-0">
                  <Card className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">⚡ Session Presets</h3>
                      <p className="text-gray-600">Create and manage custom Pomodoro timer configurations for different study styles.</p>
                    </div>
                    <SessionPresets />
                  </Card>
                </TabsContent>

                <TabsContent value="insights" className="mt-0">
                  <Card className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">💡 Adaptive Insights</h3>
                      <p className="text-gray-600">Personalized recommendations and tips based on your study patterns.</p>
                    </div>
                    <AdaptiveInsightsDisplay />
                  </Card>
                </TabsContent>

                <TabsContent value="data" className="mt-0">
                  <Card className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">💾 Data Management</h3>
                      <p className="text-gray-600">Export your data for backup or import previously saved data.</p>
                    </div>
                    <DataExportImport />
                  </Card>
                </TabsContent>

                <TabsContent value="language" className="mt-0">
                  <Card className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">🌍 Language Settings</h3>
                      <p className="text-gray-600">Choose your preferred language for the app interface.</p>
                    </div>
                    <LanguageSettings />
                  </Card>
                </TabsContent>

                <TabsContent value="accessibility" className="mt-0">
                  <Card className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">♿ Accessibility</h3>
                      <p className="text-gray-600">Customize visual, audio, and navigation preferences for better accessibility.</p>
                    </div>
                    <AccessibilitySettings />
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Footer */}
          <div className="border-t p-4 bg-gray-50 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              💡 Tip: Press <kbd className="px-2 py-1 bg-white border rounded text-xs">Esc</kbd> to close
            </p>
            <Button onClick={onClose} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              Done
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}