import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { Globe, Check, Languages } from 'lucide-react';
import { useTranslation, Language, I18nManager } from '../lib/i18n';

interface LanguageSettingsProps {
  onClose?: () => void;
}

export function LanguageSettings({ onClose }: LanguageSettingsProps) {
  const { language, setLanguage, t, availableLanguages } = useTranslation();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    toast.success(t('notifications.settingsSaved'));
  };

  const getLanguageStats = () => {
    // Mock translation completeness - in real app, calculate from actual translations
    const completeness: Record<Language, number> = {
      en: 100,
      es: 85,
      fr: 75,
      de: 70,
      ja: 60,
      zh: 55,
      pt: 80,
      ru: 65,
    };
    return completeness;
  };

  const completeness = getLanguageStats();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">{t('settings.language')}</h1>
            <p className="text-muted-foreground">Choose your preferred language</p>
          </div>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            {t('common.close')}
          </Button>
        )}
      </div>

      {/* Current Language */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            Current Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Label htmlFor="language-select">Select Language</Label>
              <p className="text-sm text-muted-foreground">
                Choose the language for the interface
              </p>
            </div>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language-select" className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.nativeName}</span>
                      <span className="text-muted-foreground">({lang.name})</span>
                      {lang.code === language && (
                        <Check className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Current: <span className="font-medium">{availableLanguages.find(l => l.code === language)?.nativeName}</span>
          </div>
        </CardContent>
      </Card>

      {/* Available Languages */}
      <Card>
        <CardHeader>
          <CardTitle>Available Languages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {availableLanguages.map((lang) => (
              <div 
                key={lang.code}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                  lang.code === language 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-border hover:bg-muted/50'
                }`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium">{lang.nativeName}</div>
                    <div className="text-sm text-muted-foreground">{lang.name}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={completeness[lang.code] === 100 ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {completeness[lang.code]}% complete
                  </Badge>
                  {lang.code === language && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Translation Information */}
      <Card>
        <CardHeader>
          <CardTitle>Translation Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total strings:</span>
              <span className="font-medium">~200</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Translated languages:</span>
              <span className="font-medium">{availableLanguages.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Fully translated:</span>
              <span className="font-medium">
                {Object.values(completeness).filter(c => c === 100).length} languages
              </span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Some languages are partially translated. 
              English will be used as fallback for missing translations.
            </p>
          </div>
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p>
              Want to help translate? Translations are managed through our 
              community translation platform. Contact us to contribute!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground">Start button:</span>
                <span className="ml-2 font-medium">{t('common.start')}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Focus level:</span>
                <span className="ml-2 font-medium">{t('timer.focusLevel')}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Work session:</span>
                <span className="ml-2 font-medium">{t('timer.workSession')}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Break time:</span>
                <span className="ml-2 font-medium">{t('timer.breakTime')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}