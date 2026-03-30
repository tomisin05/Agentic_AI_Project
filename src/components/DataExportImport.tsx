import React, { useState } from 'react';
import { Download, Upload, FileJson, Database, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function DataExportImport() {
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const exportData = (dataType: 'journal' | 'flashcards' | 'settings' | 'all') => {
    try {
      let data: any = {};
      const timestamp = new Date().toISOString().split('T')[0];

      switch (dataType) {
        case 'journal':
          data = {
            type: 'journal',
            version: '1.0',
            exportDate: new Date().toISOString(),
            data: JSON.parse(localStorage.getItem('journal-entries') || '[]')
          };
          break;

        case 'flashcards':
          data = {
            type: 'flashcards',
            version: '1.0',
            exportDate: new Date().toISOString(),
            data: JSON.parse(localStorage.getItem('flashcards') || '[]')
          };
          break;

        case 'settings':
          data = {
            type: 'settings',
            version: '1.0',
            exportDate: new Date().toISOString(),
            data: {
              pomodoroPresets: JSON.parse(localStorage.getItem('pomodoro-presets') || '[]'),
              accessibilitySettings: JSON.parse(localStorage.getItem('accessibility-settings') || '{}'),
              language: localStorage.getItem('language') || 'en',
              notificationsEnabled: localStorage.getItem('notifications-enabled') || 'true'
            }
          };
          break;

        case 'all':
          data = {
            type: 'complete-backup',
            version: '1.0',
            exportDate: new Date().toISOString(),
            data: {
              journal: JSON.parse(localStorage.getItem('journal-entries') || '[]'),
              flashcards: JSON.parse(localStorage.getItem('flashcards') || '[]'),
              scheduledSessions: JSON.parse(localStorage.getItem('scheduled-sessions') || '[]'),
              goals: JSON.parse(localStorage.getItem('goals') || '[]'),
              pomodoroPresets: JSON.parse(localStorage.getItem('pomodoro-presets') || '[]'),
              accessibilitySettings: JSON.parse(localStorage.getItem('accessibility-settings') || '{}'),
              language: localStorage.getItem('language') || 'en',
              notificationsEnabled: localStorage.getItem('notifications-enabled') || 'true',
              stats: {
                totalSessions: localStorage.getItem('total-sessions') || '0',
                totalStudyTime: localStorage.getItem('total-study-time') || '0',
                currentStreak: localStorage.getItem('current-streak') || '0'
              }
            }
          };
          break;
      }

      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `storystudy-${dataType}-${timestamp}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setExportStatus('success');
      setMessage(`${dataType} data exported successfully!`);
      setTimeout(() => {
        setExportStatus('idle');
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
      setMessage('Export failed. Please try again.');
      setTimeout(() => {
        setExportStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const imported = JSON.parse(json);

        // Validate import data
        if (!imported.type || !imported.version || !imported.data) {
          throw new Error('Invalid import file format');
        }

        // Import based on type
        switch (imported.type) {
          case 'journal':
            localStorage.setItem('journal-entries', JSON.stringify(imported.data));
            break;

          case 'flashcards':
            localStorage.setItem('flashcards', JSON.stringify(imported.data));
            break;

          case 'settings':
            if (imported.data.pomodoroPresets) {
              localStorage.setItem('pomodoro-presets', JSON.stringify(imported.data.pomodoroPresets));
            }
            if (imported.data.accessibilitySettings) {
              localStorage.setItem('accessibility-settings', JSON.stringify(imported.data.accessibilitySettings));
            }
            if (imported.data.language) {
              localStorage.setItem('language', imported.data.language);
            }
            if (imported.data.notificationsEnabled !== undefined) {
              localStorage.setItem('notifications-enabled', imported.data.notificationsEnabled);
            }
            break;

          case 'complete-backup':
            if (imported.data.journal) {
              localStorage.setItem('journal-entries', JSON.stringify(imported.data.journal));
            }
            if (imported.data.flashcards) {
              localStorage.setItem('flashcards', JSON.stringify(imported.data.flashcards));
            }
            if (imported.data.scheduledSessions) {
              localStorage.setItem('scheduled-sessions', JSON.stringify(imported.data.scheduledSessions));
            }
            if (imported.data.goals) {
              localStorage.setItem('goals', JSON.stringify(imported.data.goals));
            }
            if (imported.data.pomodoroPresets) {
              localStorage.setItem('pomodoro-presets', JSON.stringify(imported.data.pomodoroPresets));
            }
            if (imported.data.accessibilitySettings) {
              localStorage.setItem('accessibility-settings', JSON.stringify(imported.data.accessibilitySettings));
            }
            if (imported.data.language) {
              localStorage.setItem('language', imported.data.language);
            }
            if (imported.data.notificationsEnabled !== undefined) {
              localStorage.setItem('notifications-enabled', imported.data.notificationsEnabled);
            }
            if (imported.data.stats) {
              if (imported.data.stats.totalSessions) {
                localStorage.setItem('total-sessions', imported.data.stats.totalSessions);
              }
              if (imported.data.stats.totalStudyTime) {
                localStorage.setItem('total-study-time', imported.data.stats.totalStudyTime);
              }
              if (imported.data.stats.currentStreak) {
                localStorage.setItem('current-streak', imported.data.stats.currentStreak);
              }
            }
            break;

          default:
            throw new Error('Unknown import type');
        }

        setImportStatus('success');
        setMessage('Data imported successfully! Reload the page to see changes.');
        setTimeout(() => {
          setImportStatus('idle');
          setMessage('');
        }, 5000);
      } catch (error) {
        console.error('Import failed:', error);
        setImportStatus('error');
        setMessage('Import failed. Please check the file format.');
        setTimeout(() => {
          setImportStatus('idle');
          setMessage('');
        }, 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            💾 Data Management
          </h1>
          <p className="text-gray-600">
            Export your data for backup or import from a previous export
          </p>
        </div>

        {/* Status Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              exportStatus === 'success' || importStatus === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {(exportStatus === 'success' || importStatus === 'success') ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{message}</span>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Export Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Export Data</h2>
                <p className="text-sm text-gray-600">Download your data as JSON</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => exportData('journal')}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <FileJson className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Journal Entries</div>
                    <div className="text-sm text-gray-600">Export all your study reflections</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => exportData('flashcards')}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <FileJson className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Flashcards</div>
                    <div className="text-sm text-gray-600">Export your flashcard deck</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => exportData('settings')}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <FileJson className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Settings</div>
                    <div className="text-sm text-gray-600">Export your preferences</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => exportData('all')}
                className="w-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5" />
                  <div>
                    <div className="font-semibold">Complete Backup</div>
                    <div className="text-sm opacity-90">Export everything</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-xl">
                <Upload className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Import Data</h2>
                <p className="text-sm text-gray-600">Restore from a backup file</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 hover:bg-green-50 transition-all">
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                  id="import-file"
                />
                <label
                  htmlFor="import-file"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <Upload className="w-12 h-12 text-gray-400" />
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Choose a backup file
                    </div>
                    <div className="text-sm text-gray-600">
                      Select a .json file exported from StoryStudy
                    </div>
                  </div>
                </label>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <div className="font-semibold mb-1">⚠️ Important</div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Importing will merge with existing data</li>
                      <li>Reload the page after importing</li>
                      <li>Keep your original file as backup</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            📖 Data Management Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold mb-2">Regular Backups</h4>
              <p>Export your data weekly to prevent data loss. Store backups in a safe location.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">File Format</h4>
              <p>All exports are in JSON format, which is human-readable and portable.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Sync Across Devices</h4>
              <p>Export from one device and import on another to keep your data synchronized.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Selective Export</h4>
              <p>Choose specific data types to export only what you need.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
