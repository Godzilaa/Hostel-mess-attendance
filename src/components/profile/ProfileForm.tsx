'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon, 
  CameraIcon, 
  DocumentDuplicateIcon,
  CheckIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface Student {
  id: string;
  walletAddress: string;
  name: string | null;
  hostelBlock: string | null;
  roomNumber: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}

interface ProfileFormProps {
  student: Student;
  isLoading?: boolean;
  onSave?: (data: Partial<Student>) => Promise<void>;
  onClose?: () => void;
  isOnboarding?: boolean;
}

export default function ProfileForm({ student, isLoading = false, onSave, onClose, isOnboarding = false }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: student.name || '',
    hostelBlock: student.hostelBlock || '',
    roomNumber: student.roomNumber || '',
    avatarUrl: student.avatarUrl || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(student.avatarUrl);
  const [avatarWarning, setAvatarWarning] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setAvatarWarning('Image too large. Please choose an image smaller than 2MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Check if base64 string is too long for database
        if (result.length > 255) {
          // For now, don't save large images to avoid database errors
          setAvatarPreview(result);
          setAvatarWarning('Image will be displayed but not saved (too large for database). We\'ll add proper image upload soon!');
          // Don't update formData.avatarUrl for very large images
          console.log('Avatar preview set, but not saving to database (too large)');
        } else {
          setAvatarPreview(result);
          setAvatarWarning('');
          handleInputChange('avatarUrl', result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(student.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const handleSave = async () => {
    console.log('ProfileForm handleSave called');
    console.log('Form data:', formData);
    console.log('Is onboarding:', isOnboarding);
    console.log('onSave function exists:', !!onSave);
    
    setIsSaving(true);
    try {
      // Create a copy of formData and exclude large avatars to prevent database errors
      const submissionData = { ...formData };
      if (submissionData.avatarUrl && submissionData.avatarUrl.length > 255) {
        console.log('Excluding large avatar from submission to prevent database error');
        submissionData.avatarUrl = '';
      }
      
      await onSave?.(submissionData);
      if (!isOnboarding) {
        onClose?.();
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify({
    name: student.name || '',
    hostelBlock: student.hostelBlock || '',
    roomNumber: student.roomNumber || '',
    avatarUrl: student.avatarUrl || ''
  });

  const isFormValid = formData.name.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={isOnboarding ? '' : 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`${isOnboarding ? 'w-full' : 'max-w-md w-full max-h-[90vh] overflow-y-auto'} bg-white rounded-2xl shadow-xl ${isOnboarding ? 'max-w-none' : ''}`}
      >
        {/* Header */}
        <div className={`${isOnboarding ? 'p-4 sm:p-6' : 'p-6'} border-b border-gray-200`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {isOnboarding ? 'Complete Your Profile' : 'Edit Profile'}
            </h2>
            {!isOnboarding && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {isOnboarding && (
            <p className="text-gray-600 mt-2">
              Tell us about yourself to get started with your meal passport
            </p>
          )}
        </div>

        <div className={`${isOnboarding ? 'p-4 sm:p-6' : 'p-6'} space-y-6`}>
          {/* Avatar Section */}
          <div className="text-center">
            <div className="relative inline-block">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-100"
                />
              ) : (
                <UserCircleIcon className="w-24 h-24 text-gray-300" />
              )}
              
              <label className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-purple-700 transition-colors">
                <CameraIcon className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Click camera to change avatar
            </p>
            {avatarWarning && (
              <div className="flex items-start space-x-2 mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">{avatarWarning}</p>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hostel Block
                </label>
                <input
                  type="text"
                  value={formData.hostelBlock}
                  onChange={(e) => handleInputChange('hostelBlock', e.target.value)}
                  placeholder="e.g., Block A"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Number
                </label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                  placeholder="e.g., 301"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Read-only Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Account Information</h3>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Wallet Address
              </label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 text-sm font-mono bg-white px-3 py-2 rounded border text-gray-700">
                  {student.walletAddress.slice(0, 6)}...{student.walletAddress.slice(-6)}
                </code>
                <button
                  onClick={handleCopyAddress}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {copied ? (
                    <CheckIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <DocumentDuplicateIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Member Since
              </label>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <CalendarIcon className="w-4 h-4" />
                <span>{format(new Date(student.createdAt), 'MMMM yyyy')}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex ${isOnboarding ? 'justify-center' : 'space-x-3'} pt-4`}>
            {!isOnboarding && (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            )}
            
            <button
              onClick={handleSave}
              disabled={isOnboarding ? (isSaving || !isFormValid) : ((!hasChanges && !isOnboarding) || isSaving)}
              className={`${isOnboarding ? 'w-full max-w-md' : 'flex-1'} px-4 py-3 rounded-lg font-medium transition-colors ${
                isOnboarding ? 
                  (isFormValid && !isSaving ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed') :
                  ((hasChanges || isOnboarding) && !isSaving ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
              }`}
            >
              {isSaving ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isOnboarding ? 'Creating Profile...' : 'Saving...'}</span>
                </div>
              ) : (
                isOnboarding ? 'Complete Setup & Start Tracking Meals 🍽️' : 'Save Changes'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}