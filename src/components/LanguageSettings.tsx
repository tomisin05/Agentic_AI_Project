import React from 'react';
import { Globe, Check } from 'lucide-react';
import { useTranslation, SupportedLanguage } from '../lib/i18n';
import { motion } from 'motion/react';

export function LanguageSettings() {
  const { language, setLanguage, supportedLanguages, t } = useTranslation();

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Globe className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Select Language</h3>
            <p className="text-sm text-gray-600">
              Current: {supportedLanguages.find(l => l.code === language)?.nativeName}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {supportedLanguages.map((lang) => (
          <motion.button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              language === lang.code
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{lang.flag}</span>
                <div>
                  <div className="font-bold text-gray-900 text-lg">
                    {lang.nativeName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {lang.name}
                  </div>
                </div>
              </div>
              
              {language === lang.code && (
                <div className="bg-indigo-600 text-white p-2 rounded-full">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl">
        <h3 className="font-bold text-gray-900 mb-2">📝 Translation Status</h3>
        <p className="text-sm text-gray-700 mb-4">
          All supported languages include translations for core features. Some newly added
          features may display in English until translations are completed.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-gray-900 mb-1">Core UI</div>
            <div className="text-green-600">✓ Complete</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-gray-900 mb-1">Timer</div>
            <div className="text-green-600">✓ Complete</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-gray-900 mb-1">Goals</div>
            <div className="text-green-600">✓ Complete</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-gray-900 mb-1">Settings</div>
            <div className="text-green-600">✓ Complete</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex gap-3">
          <Globe className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <div className="font-semibold mb-1">Help us translate!</div>
            <p>
              If you notice any translation issues or would like to help improve translations,
              please let us know. We're always working to make StoryStudy accessible to more students
              around the world.
            </p>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="mt-6 bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Preview</h3>
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-600">App Name:</span>
            <span className="font-semibold text-gray-900">{t('appName')}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Tagline:</span>
            <span className="font-semibold text-gray-900">{t('tagline')}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Start Session:</span>
            <span className="font-semibold text-gray-900">{t('startSession')}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Goals:</span>
            <span className="font-semibold text-gray-900">{t('goals')}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Journal:</span>
            <span className="font-semibold text-gray-900">{t('journal')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}