import React, { useState, useEffect } from 'react';
import { Clock, Plus, Edit2, Trash2, Check, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useSettings } from '../lib/settingsContext';
import { Button } from './ui/button';

export interface PomodoroPreset {
  id: string;
  name: string;
  workDuration: number; // minutes
  shortBreakDuration: number; // minutes
  longBreakDuration: number; // minutes
  sessionsBeforeLongBreak: number;
  color: string;
  isDefault: boolean;
}

const DEFAULT_PRESETS: PomodoroPreset[] = [
  {
    id: 'classic',
    name: 'Classic Pomodoro',
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    color: 'from-red-500 to-pink-500',
    isDefault: true
  },
  {
    id: 'short-sprint',
    name: 'Short Sprint',
    workDuration: 15,
    shortBreakDuration: 3,
    longBreakDuration: 10,
    sessionsBeforeLongBreak: 4,
    color: 'from-blue-500 to-cyan-500',
    isDefault: true
  },
  {
    id: 'deep-work',
    name: 'Deep Work',
    workDuration: 50,
    shortBreakDuration: 10,
    longBreakDuration: 20,
    sessionsBeforeLongBreak: 3,
    color: 'from-purple-500 to-indigo-500',
    isDefault: true
  },
  {
    id: 'quick-study',
    name: 'Quick Study',
    workDuration: 10,
    shortBreakDuration: 2,
    longBreakDuration: 5,
    sessionsBeforeLongBreak: 6,
    color: 'from-green-500 to-emerald-500',
    isDefault: true
  }
];

interface SessionPresetsProps {
  onSelectPreset?: (preset: PomodoroPreset) => void;
  currentPresetId?: string;
  onBack?: () => void;
}

export function SessionPresets({ onSelectPreset, currentPresetId, onBack }: SessionPresetsProps) {
  const { currentPreset, setCurrentPreset } = useSettings();
  const [presets, setPresets] = useState<PomodoroPreset[]>(DEFAULT_PRESETS);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPreset, setEditingPreset] = useState<PomodoroPreset | null>(null);
  const [newPreset, setNewPreset] = useState<Partial<PomodoroPreset>>({
    name: '',
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    color: 'from-blue-500 to-purple-500'
  });

  // Load custom presets from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('pomodoro-presets');
    if (stored) {
      try {
        const customPresets = JSON.parse(stored);
        setPresets([...DEFAULT_PRESETS, ...customPresets]);
      } catch (error) {
        console.error('Failed to load presets:', error);
      }
    }
  }, []);

  // Save custom presets to localStorage
  const saveCustomPresets = (allPresets: PomodoroPreset[]) => {
    const customPresets = allPresets.filter(p => !p.isDefault);
    localStorage.setItem('pomodoro-presets', JSON.stringify(customPresets));
  };

  const createPreset = () => {
    if (!newPreset.name?.trim()) return;

    const preset: PomodoroPreset = {
      id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: newPreset.name!,
      workDuration: newPreset.workDuration!,
      shortBreakDuration: newPreset.shortBreakDuration!,
      longBreakDuration: newPreset.longBreakDuration!,
      sessionsBeforeLongBreak: newPreset.sessionsBeforeLongBreak!,
      color: newPreset.color!,
      isDefault: false
    };

    const updatedPresets = [...presets, preset];
    setPresets(updatedPresets);
    saveCustomPresets(updatedPresets);
    resetForm();
  };

  const updatePreset = () => {
    if (!editingPreset) return;

    const updatedPresets = presets.map(p =>
      p.id === editingPreset.id ? editingPreset : p
    );
    setPresets(updatedPresets);
    saveCustomPresets(updatedPresets);
    setEditingPreset(null);
  };

  const deletePreset = (id: string) => {
    const preset = presets.find(p => p.id === id);
    if (preset?.isDefault) return; // Can't delete default presets

    const updatedPresets = presets.filter(p => p.id !== id);
    setPresets(updatedPresets);
    saveCustomPresets(updatedPresets);
  };

  const resetForm = () => {
    setNewPreset({
      name: '',
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      sessionsBeforeLongBreak: 4,
      color: 'from-blue-500 to-purple-500'
    });
    setIsCreating(false);
  };

  const colorOptions = [
    'from-red-500 to-pink-500',
    'from-orange-500 to-amber-500',
    'from-yellow-500 to-orange-500',
    'from-green-500 to-emerald-500',
    'from-blue-500 to-cyan-500',
    'from-indigo-500 to-blue-500',
    'from-purple-500 to-indigo-500',
    'from-pink-500 to-rose-500'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        {onBack && (
          <div className="mb-4">
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
        )}
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              ⏱️ Session Presets
            </h1>
            <p className="text-gray-600">
              Customize your Pomodoro timer settings
            </p>
          </div>
          
          <button
            onClick={() => setIsCreating(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Preset
          </button>
        </div>

        {/* Presets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presets.map((preset) => (
            <motion.div
              key={preset.id}
              layout
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${currentPresetId === preset.id ? 'ring-4 ring-blue-500' : ''}`}
            >
              <div className={`h-3 bg-gradient-to-r ${preset.color}`} />
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {preset.name}
                    </h3>
                    {preset.isDefault && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  
                  {currentPresetId === preset.id && (
                    <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Work Duration</span>
                    <span className="font-bold text-gray-900">{preset.workDuration} min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Short Break</span>
                    <span className="font-bold text-gray-900">{preset.shortBreakDuration} min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Long Break</span>
                    <span className="font-bold text-gray-900">{preset.longBreakDuration} min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Sessions Before Long Break</span>
                    <span className="font-bold text-gray-900">{preset.sessionsBeforeLongBreak}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentPreset(preset);
                      onSelectPreset?.(preset);
                    }}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                      (currentPresetId || currentPreset?.id) === preset.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {(currentPresetId || currentPreset?.id) === preset.id ? 'Active' : 'Use This'}
                  </button>
                  
                  {!preset.isDefault && (
                    <>
                      <button
                        onClick={() => setEditingPreset(preset)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletePreset(preset.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create/Edit Modal */}
        {(isCreating || editingPreset) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                {editingPreset ? 'Edit Preset' : 'Create New Preset'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preset Name *
                  </label>
                  <input
                    type="text"
                    value={editingPreset?.name || newPreset.name}
                    onChange={(e) => editingPreset
                      ? setEditingPreset({ ...editingPreset, name: e.target.value })
                      : setNewPreset({ ...newPreset, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="My Custom Preset"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Work Duration (min)
                    </label>
                    <input
                      type="number"
                      value={editingPreset?.workDuration || newPreset.workDuration}
                      onChange={(e) => editingPreset
                        ? setEditingPreset({ ...editingPreset, workDuration: parseInt(e.target.value) })
                        : setNewPreset({ ...newPreset, workDuration: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      min="1"
                      max="120"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Break (min)
                    </label>
                    <input
                      type="number"
                      value={editingPreset?.shortBreakDuration || newPreset.shortBreakDuration}
                      onChange={(e) => editingPreset
                        ? setEditingPreset({ ...editingPreset, shortBreakDuration: parseInt(e.target.value) })
                        : setNewPreset({ ...newPreset, shortBreakDuration: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      min="1"
                      max="30"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Long Break (min)
                    </label>
                    <input
                      type="number"
                      value={editingPreset?.longBreakDuration || newPreset.longBreakDuration}
                      onChange={(e) => editingPreset
                        ? setEditingPreset({ ...editingPreset, longBreakDuration: parseInt(e.target.value) })
                        : setNewPreset({ ...newPreset, longBreakDuration: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      min="1"
                      max="60"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sessions Before Long Break
                    </label>
                    <input
                      type="number"
                      value={editingPreset?.sessionsBeforeLongBreak || newPreset.sessionsBeforeLongBreak}
                      onChange={(e) => editingPreset
                        ? setEditingPreset({ ...editingPreset, sessionsBeforeLongBreak: parseInt(e.target.value) })
                        : setNewPreset({ ...newPreset, sessionsBeforeLongBreak: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Theme
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => editingPreset
                          ? setEditingPreset({ ...editingPreset, color })
                          : setNewPreset({ ...newPreset, color })
                        }
                        className={`h-12 rounded-lg bg-gradient-to-r ${color} ${
                          (editingPreset?.color || newPreset.color) === color
                            ? 'ring-4 ring-blue-500'
                            : 'hover:scale-105'
                        } transition-transform`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                <button
                  onClick={editingPreset ? updatePreset : createPreset}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
                >
                  {editingPreset ? 'Update Preset' : 'Create Preset'}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingPreset(null);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-200 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}