import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { 
  Accessibility, 
  Eye, 
  Volume2, 
  Keyboard, 
  MousePointer, 
  Type,
  Palette,
  Monitor,
  Info
} from 'lucide-react';
import { 
  AccessibilitySettings as AccessibilitySettingsType,
  AccessibilityManager,
  keyboardShortcuts,
  initializeAccessibility,
  ScreenReaderAnnouncer
} from '../lib/accessibility';

interface AccessibilitySettingsProps {
  onClose?: () => void;
}

export function AccessibilitySettings({ onClose }: AccessibilitySettingsProps) {
  const [settings, setSettings] = useState<AccessibilitySettingsType>(
    AccessibilityManager.getSettings()
  );
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  useEffect(() => {
    initializeAccessibility();
  }, []);

  const updateSetting = <K extends keyof AccessibilitySettingsType>(
    key: K, 
    value: AccessibilitySettingsType[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    AccessibilityManager.saveSettings(newSettings);
    AccessibilityManager.applySettings(newSettings);
    
    // Announce changes to screen readers
    ScreenReaderAnnouncer.announce(`${key} setting updated`);
    toast.success(`${key} setting updated`);
  };

  const resetToDefaults = () => {
    const defaultSettings = AccessibilityManager.getSettings();
    setSettings(defaultSettings);
    AccessibilityManager.saveSettings(defaultSettings);
    AccessibilityManager.applySettings(defaultSettings);
    toast.success('Accessibility settings reset to defaults');
  };

  const testScreenReader = () => {
    ScreenReaderAnnouncer.announce(
      'Screen reader test: This is a test announcement for accessibility features.', 
      'assertive'
    );
    toast.info('Screen reader announcement sent');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Accessibility className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Accessibility Settings</h1>
            <p className="text-muted-foreground">Customize the app for your accessibility needs</p>
          </div>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Visual Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Visual Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="high-contrast">High Contrast Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Increases color contrast for better visibility
                </p>
              </div>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                aria-describedby="high-contrast-desc"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="reduce-motion">Reduce Motion</Label>
                <p className="text-sm text-muted-foreground">
                  Minimizes animations and transitions
                </p>
              </div>
              <Switch
                id="reduce-motion"
                checked={settings.reduceMotion}
                onCheckedChange={(checked) => updateSetting('reduceMotion', checked)}
                aria-describedby="reduce-motion-desc"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size</Label>
              <Select
                value={settings.fontSize}
                onValueChange={(value: any) => updateSetting('fontSize', value)}
              >
                <SelectTrigger id="font-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (14px)</SelectItem>
                  <SelectItem value="medium">Medium (16px)</SelectItem>
                  <SelectItem value="large">Large (18px)</SelectItem>
                  <SelectItem value="extra-large">Extra Large (20px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Audio Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Audio Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="sound-enabled">Sound Effects</Label>
                <p className="text-sm text-muted-foreground">
                  Enable audio feedback for timer and notifications
                </p>
              </div>
              <Switch
                id="sound-enabled"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="autoplay-enabled">Autoplay Audio</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically play audio cues and narration
                </p>
              </div>
              <Switch
                id="autoplay-enabled"
                checked={settings.autoplayEnabled}
                onCheckedChange={(checked) => updateSetting('autoplayEnabled', checked)}
              />
            </div>

            <div className="space-y-2">
              <Button 
                variant="outline" 
                onClick={testScreenReader}
                className="w-full"
              >
                Test Screen Reader
              </Button>
              <p className="text-xs text-muted-foreground">
                This will send a test message to screen readers
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              Navigation Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="keyboard-navigation">Enhanced Keyboard Navigation</Label>
                <p className="text-sm text-muted-foreground">
                  Improved keyboard shortcuts and focus indicators
                </p>
              </div>
              <Switch
                id="keyboard-navigation"
                checked={settings.keyboardNavigationEnabled}
                onCheckedChange={(checked) => updateSetting('keyboardNavigationEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="screen-reader">Screen Reader Optimization</Label>
                <p className="text-sm text-muted-foreground">
                  Enhanced labels and announcements for screen readers
                </p>
              </div>
              <Switch
                id="screen-reader"
                checked={settings.screenReaderOptimized}
                onCheckedChange={(checked) => updateSetting('screenReaderOptimized', checked)}
              />
            </div>

            <Button 
              variant="outline" 
              onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
              className="w-full"
            >
              {showKeyboardShortcuts ? 'Hide' : 'Show'} Keyboard Shortcuts
            </Button>
          </CardContent>
        </Card>

        {/* System Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              System Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">System Theme</Label>
                <p className="font-medium">
                  {window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light'}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Motion Preference</Label>
                <p className="font-medium">
                  {window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'Reduced' : 'Normal'}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Contrast Preference</Label>
                <p className="font-medium">
                  {window.matchMedia('(prefers-contrast: high)').matches ? 'High' : 'Normal'}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Color Scheme</Label>
                <p className="font-medium">Auto-detected</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Reset Settings</p>
                <p className="text-xs text-muted-foreground">Restore default accessibility settings</p>
              </div>
              <Button variant="outline" onClick={resetToDefaults}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keyboard Shortcuts */}
      {showKeyboardShortcuts && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              Keyboard Shortcuts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(keyboardShortcuts).map(([key, description]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">{description}</span>
                  <Badge variant="outline" className="font-mono">
                    {key}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accessibility Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Accessibility Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <p>
              This app is designed to be accessible to all users. It includes features like:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Keyboard navigation support throughout the interface</li>
              <li>Screen reader compatibility with proper ARIA labels</li>
              <li>High contrast mode for users with visual impairments</li>
              <li>Reduced motion options for users sensitive to animations</li>
              <li>Customizable font sizes for better readability</li>
              <li>Audio feedback and notifications</li>
              <li>Focus management and tab trapping in modals</li>
              <li>Semantic HTML structure for better navigation</li>
            </ul>
            <p className="text-muted-foreground">
              If you encounter any accessibility issues or have suggestions for improvements, 
              please let us know. We're committed to making this app usable for everyone.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}