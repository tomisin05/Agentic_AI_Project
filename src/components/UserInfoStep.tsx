import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User, Mail, Sparkles } from 'lucide-react';

interface UserInfoStepProps {
  name: string;
  email: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
}

export function UserInfoStep({ name, email, onNameChange, onEmailChange }: UserInfoStepProps) {
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNameChange = (value: string) => {
    onNameChange(value);
    if (value.trim().length < 2) {
      setNameError('Name should be at least 2 characters');
    } else {
      setNameError('');
    }
  };

  const handleEmailChange = (value: string) => {
    onEmailChange(value);
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-900">Let's Get Started!</span>
        </div>
        <h2 className="mb-2">Tell us about yourself</h2>
        <p className="text-muted-foreground">
          We'll personalize your study experience just for you
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-8 bg-gradient-to-br from-white to-blue-50/30 border-2 border-blue-100">
          <div className="space-y-6">
            {/* Name Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="name" className="flex items-center gap-2 text-base">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                What's your name?
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={`text-base h-12 border-2 ${
                  nameError 
                    ? 'border-red-300 focus:border-red-500' 
                    : name.length >= 2 
                    ? 'border-green-300 focus:border-green-500'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {nameError && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500 flex items-center gap-1"
                >
                  ⚠️ {nameError}
                </motion.p>
              )}
              {name.length >= 2 && !nameError && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-green-600 flex items-center gap-1"
                >
                  ✓ Looking good!
                </motion.p>
              )}
            </motion.div>

            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="email" className="flex items-center gap-2 text-base">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                Your email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@school.edu or name@work.com"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={`text-base h-12 border-2 ${
                  emailError 
                    ? 'border-red-300 focus:border-red-500' 
                    : email && validateEmail(email)
                    ? 'border-green-300 focus:border-green-500'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              <p className="text-xs text-muted-foreground">
                💼 Work, school, or personal email - your choice!
              </p>
              {emailError && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500 flex items-center gap-1"
                >
                  ⚠️ {emailError}
                </motion.p>
              )}
              {email && validateEmail(email) && !emailError && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-green-600 flex items-center gap-1"
                >
                  ✓ Perfect!
                </motion.p>
              )}
            </motion.div>

            {/* Privacy Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <p className="text-xs text-blue-800">
                🔒 <strong>Your privacy matters!</strong> We use this info to personalize your experience. 
                Your data stays with you and is never shared.
              </p>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Motivational message */}
      {name.length >= 2 && email && validateEmail(email) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
            <p className="text-sm text-green-800">
              🎉 Awesome, {name}! You're all set to begin your journey!
            </p>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
