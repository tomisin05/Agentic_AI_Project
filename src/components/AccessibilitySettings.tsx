import React, { useState, useEffect } from 'react';
import { Eye, Volume2, Keyboard, Monitor, Type, Contrast } from 'lucide-react';
import { accessibilitySystem, AccessibilitySettings as AccessibilitySettingsType } from '../lib/accessibility';
import { motion } from 'motion/react';

export function AccessibilitySettings() {
  const [settings, setSettings] = useState<AccessibilitySettingsType>(
    accessibilitySystem.getSettings()
  );

  useEffect(() => {
    const unsubscribe = accessibilitySystem.subscribe('settings-changed', (newSettings: AccessibilitySettingsType) => {
      setSettings(newSettings);
    });

    return unsubscribe;
  }, []);

  const updateSetting = <K extends keyof AccessibilitySettingsType>(
    key: K,
    value: AccessibilitySettingsType[K]
  ) => {
    accessibilitySystem.updateSetting(key, value);
  };

  const resetToDefaults = () => {
    if (confirm('Reset all accessibility settings to defaults?')) {
      accessibilitySystem.resetToDefaults();
    }
  };

  const testScreenReader = () => {
    accessibilitySystem.announceToScreenReader(
      'Screen reader test: This is a sample announcement from StoryStudy.',
      'polite'
    );
  };

  return (
    <div>
      <div className="space-y-6">
        {/* Visual Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Visual</h2>
              <p className="text-sm text-gray-600">Display and appearance settings</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">High Contrast Mode</div>
                <div className="text-sm text-gray-600">
                  Increase contrast for better visibility
                </div>
              </div>
              <button
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.highContrast ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full"
                  animate={{ x: settings.highContrast ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">Reduce Motion</div>
                <div className="text-sm text-gray-600">
                  Minimize animations and transitions
                </div>
              </div>
              <button
                onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full"
                  animate={{ x: settings.reducedMotion ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Font Size */}
            <div>
              <div className="font-semibold text-gray-900 mb-3">Font Size</div>
              <div className="grid grid-cols-4 gap-2">
                {(['small', 'medium', 'large', 'extra-large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSetting('fontSize', size)}
                    className={`py-3 rounded-xl font-medium transition-all ${
                      settings.fontSize === size
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size === 'small' && 'A'}
                    {size === 'medium' && 'A'}
                    {size === 'large' && 'A'}
                    {size === 'extra-large' && 'A'}
                    <div className="text-xs mt-1">
                      {size.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Focus Indicators */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">Enhanced Focus Indicators</div>
                <div className="text-sm text-gray-600">
                  Show clearer focus outlines for keyboard navigation
                </div>
              </div>
              <button
                onClick={() => updateSetting('focusIndicators', !settings.focusIndicators)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.focusIndicators ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full"
                  animate={{ x: settings.focusIndicators ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Audio Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Volume2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Audio</h2>
              <p className="text-sm text-gray-600">Sound and audio preferences</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Sound Effects */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">Sound Effects</div>
                <div className="text-sm text-gray-600">
                  Play sounds for timer events and notifications
                </div>
              </div>
              <button
                onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.soundEnabled ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full"
                  animate={{ x: settings.soundEnabled ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Audio Descriptions */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">Audio Descriptions</div>
                <div className="text-sm text-gray-600">
                  Enable audio descriptions for story elements
                </div>
              </div>
              <button
                onClick={() => updateSetting('audioDescriptions', !settings.audioDescriptions)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.audioDescriptions ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full"
                  animate={{ x: settings.audioDescriptions ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Navigation Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-xl">
              <Keyboard className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Navigation</h2>
              <p className="text-sm text-gray-600">Keyboard and interaction settings</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Keyboard Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">Enhanced Keyboard Navigation</div>
                <div className="text-sm text-gray-600">
                  Enable keyboard shortcuts and better focus management
                </div>
              </div>
              <button
                onClick={() => updateSetting('keyboardNavigation', !settings.keyboardNavigation)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.keyboardNavigation ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full"
                  animate={{ x: settings.keyboardNavigation ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Screen Reader */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">Screen Reader Optimization</div>
                <div className="text-sm text-gray-600">
                  Optimize layout and announcements for screen readers
                </div>
              </div>
              <button
                onClick={() => updateSetting('screenReaderOptimized', !settings.screenReaderOptimized)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.screenReaderOptimized ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full"
                  animate={{ x: settings.screenReaderOptimized ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Screen Reader Test */}
            <button
              onClick={testScreenReader}
              className="w-full py-3 border-2 border-green-300 text-green-700 rounded-xl font-medium hover:bg-green-50 transition-colors"
            >
              Test Screen Reader Announcement
            </button>
          </div>
        </motion.div>

        {/* Keyboard Shortcuts Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">⌨️ Keyboard Shortcuts</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Start/Pause Timer</span>
              <kbd className="px-3 py-1 bg-gray-200 rounded font-mono text-sm">Space</kbd>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Reset Timer</span>
              <kbd className="px-3 py-1 bg-gray-200 rounded font-mono text-sm">R</kbd>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Skip Session</span>
              <kbd className="px-3 py-1 bg-gray-200 rounded font-mono text-sm">S</kbd>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Open Journal</span>
              <kbd className="px-3 py-1 bg-gray-200 rounded font-mono text-sm">J</kbd>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Toggle Stats</span>
              <kbd className="px-3 py-1 bg-gray-200 rounded font-mono text-sm">T</kbd>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Close Modal</span>
              <kbd className="px-3 py-1 bg-gray-200 rounded font-mono text-sm">Esc</kbd>
            </div>
          </div>
        </motion.div>

        {/* System Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <Monitor className="w-6 h-6" />
            <h3 className="text-xl font-bold">System Integration</h3>
          </div>
          <p className="text-white/90 mb-4">
            StoryStudy automatically respects your operating system's accessibility preferences for
            reduced motion and high contrast mode.
          </p>
          <button
            onClick={resetToDefaults}
            className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-lg transition-shadow"
          >
            Reset to Defaults
          </button>
        </motion.div>
      </div>
    </div>
  );
}