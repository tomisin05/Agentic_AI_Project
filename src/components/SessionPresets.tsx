import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Settings, Clock, Coffee, Plus, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from "motion/react";

export interface SessionPreset {
  id: string;
  name: string;
  workDuration: number; // in minutes
  breakDuration: number; // in minutes
  longBreakDuration?: number; // in minutes
  sessionsBeforeLongBreak?: number;
  color: string;
  isDefault?: boolean;
}

interface SessionPresetsProps {
  presets: SessionPreset[];
  currentPreset: SessionPreset;
  onPresetSelect: (preset: SessionPreset) => void;
  onPresetCreate: (preset: Omit<SessionPreset, 'id'>) => void;
  onPresetUpdate: (preset: SessionPreset) => void;
  onPresetDelete: (presetId: string) => void;
}

const defaultPresets: SessionPreset[] = [
  {
    id: 'classic',
    name: 'Classic Pomodoro',
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    color: 'bg-red-500',
    isDefault: true
  },
  {
    id: 'focused',
    name: 'Deep Focus',
    workDuration: 45,
    breakDuration: 15,
    longBreakDuration: 30,
    sessionsBeforeLongBreak: 3,
    color: 'bg-blue-500'
  },
  {
    id: 'sprint',
    name: 'Quick Sprint',
    workDuration: 15,
    breakDuration: 3,
    longBreakDuration: 10,
    sessionsBeforeLongBreak: 6,
    color: 'bg-green-500'
  },
  {
    id: 'extended',
    name: 'Extended Study',
    workDuration: 60,
    breakDuration: 20,
    longBreakDuration: 45,
    sessionsBeforeLongBreak: 2,
    color: 'bg-purple-500'
  }
];

export function SessionPresets({ 
  presets, 
  currentPreset, 
  onPresetSelect, 
  onPresetCreate, 
  onPresetUpdate, 
  onPresetDelete 
}: SessionPresetsProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<SessionPreset | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    color: 'bg-blue-500'
  });

  const allPresets = [...defaultPresets, ...presets];
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500',
    'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      workDuration: 25,
      breakDuration: 5,
      longBreakDuration: 15,
      sessionsBeforeLongBreak: 4,
      color: 'bg-blue-500'
    });
  };

  const handleCreatePreset = () => {
    if (!formData.name.trim()) return;
    
    onPresetCreate({
      name: formData.name,
      workDuration: formData.workDuration,
      breakDuration: formData.breakDuration,
      longBreakDuration: formData.longBreakDuration,
      sessionsBeforeLongBreak: formData.sessionsBeforeLongBreak,
      color: formData.color
    });
    
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleUpdatePreset = () => {
    if (!editingPreset || !formData.name.trim()) return;
    
    onPresetUpdate({
      ...editingPreset,
      name: formData.name,
      workDuration: formData.workDuration,
      breakDuration: formData.breakDuration,
      longBreakDuration: formData.longBreakDuration,
      sessionsBeforeLongBreak: formData.sessionsBeforeLongBreak,
      color: formData.color
    });
    
    setEditingPreset(null);
    resetForm();
  };

  const startEdit = (preset: SessionPreset) => {
    setEditingPreset(preset);
    setFormData({
      name: preset.name,
      workDuration: preset.workDuration,
      breakDuration: preset.breakDuration,
      longBreakDuration: preset.longBreakDuration || 15,
      sessionsBeforeLongBreak: preset.sessionsBeforeLongBreak || 4,
      color: preset.color
    });
  };

  const PresetForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Preset Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="My Custom Preset"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="work">Work Duration (min)</Label>
          <Input
            id="work"
            type="number"
            min="5"
            max="120"
            value={formData.workDuration}
            onChange={(e) => setFormData(prev => ({ ...prev, workDuration: parseInt(e.target.value) || 25 }))}
          />
        </div>
        <div>
          <Label htmlFor="break">Break Duration (min)</Label>
          <Input
            id="break"
            type="number"
            min="1"
            max="30"
            value={formData.breakDuration}
            onChange={(e) => setFormData(prev => ({ ...prev, breakDuration: parseInt(e.target.value) || 5 }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="longbreak">Long Break (min)</Label>
          <Input
            id="longbreak"
            type="number"
            min="5"
            max="60"
            value={formData.longBreakDuration}
            onChange={(e) => setFormData(prev => ({ ...prev, longBreakDuration: parseInt(e.target.value) || 15 }))}
          />
        </div>
        <div>
          <Label htmlFor="sessions">Sessions Before Long Break</Label>
          <Input
            id="sessions"
            type="number"
            min="2"
            max="10"
            value={formData.sessionsBeforeLongBreak}
            onChange={(e) => setFormData(prev => ({ ...prev, sessionsBeforeLongBreak: parseInt(e.target.value) || 4 }))}
          />
        </div>
      </div>

      <div>
        <Label>Color</Label>
        <div className="flex gap-2 mt-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setFormData(prev => ({ ...prev, color }))}
              className={`w-8 h-8 rounded-full ${color} ${
                formData.color === color ? 'ring-2 ring-gray-400 ring-offset-2' : ''
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button 
          onClick={editingPreset ? handleUpdatePreset : handleCreatePreset}
          className="flex-1"
        >
          {editingPreset ? 'Update Preset' : 'Create Preset'}
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            setIsCreateDialogOpen(false);
            setEditingPreset(null);
            resetForm();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Session Presets
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Preset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Custom Preset</DialogTitle>
                <DialogDescription>
                  Create a custom study session preset with your preferred work and break durations.
                </DialogDescription>
              </DialogHeader>
              <PresetForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <AnimatePresence>
            {allPresets.map((preset, index) => (
              <motion.div
                key={preset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  currentPreset.id === preset.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onPresetSelect(preset)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${preset.color}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{preset.name}</span>
                        {preset.isDefault && (
                          <Badge variant="outline" className="text-xs">Default</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {preset.workDuration}m
                        </span>
                        <span className="flex items-center gap-1">
                          <Coffee className="w-3 h-3" />
                          {preset.breakDuration}m
                        </span>
                        {preset.longBreakDuration && (
                          <span className="text-xs">
                            {preset.longBreakDuration}m after {preset.sessionsBeforeLongBreak}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {!preset.isDefault && (
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(preset)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPresetDelete(preset.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingPreset} onOpenChange={() => setEditingPreset(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Preset</DialogTitle>
              <DialogDescription>
                Modify the settings for this custom preset.
              </DialogDescription>
            </DialogHeader>
            <PresetForm />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}