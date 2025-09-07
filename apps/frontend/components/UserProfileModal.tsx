'use client';

import { 
  Modal, 
  TextInput, 
  Stack, 
  Text, 
  Button, 
  Group, 
  Select,
  Textarea,
  LoadingOverlay,
  Avatar,
  FileInput,
  Box
} from '@mantine/core';
import { 
  User, 
  Mail, 
  Camera,
  Save
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUserProfile, useUpdateUserProfile } from '../hooks/useUserProfile';
import { showNotification } from '@mantine/notifications';

interface UserProfileModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function UserProfileModal({ opened, onClose }: UserProfileModalProps) {
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: profile, isLoading } = useUserProfile();
  const updateProfile = useUpdateUserProfile();

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setDisplayName(profile.displayName || '');
      setEmail(profile.email || '');
      setBio(profile.bio || '');
      setRole(profile.role || null);
      setPhotoURL(profile.photoURL || '');
    }
  }, [profile]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateProfile.mutateAsync({
        name,
        displayName,
        email,
        bio,
        role,
        photoURL,
      });
      
      showNotification({
        title: 'Profile updated',
        message: 'Your profile has been updated successfully.',
        color: 'green',
      });
      
      onClose();
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to update profile. Please try again.',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Project Manager' },
    { value: 'developer', label: 'Developer' },
    { value: 'designer', label: 'Designer' },
    { value: 'tester', label: 'QA Tester' },
    { value: 'viewer', label: 'Viewer' },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Profile Settings"
      size="md"
      centered
      styles={{
        title: {
          color: 'var(--mantine-text-heading)',
          fontWeight: 'bold',
          fontSize: '1.25rem',
        },
      }}
    >
      <Box pos="relative">
        <LoadingOverlay visible={isLoading || isSubmitting} />
        
        <Stack gap="md">
          {/* Profile Picture */}
          <Group justify="center">
            <Avatar
              src={photoURL}
              size="xl"
              radius="xl"
              color="blue"
            >
              {name?.charAt(0) || displayName?.charAt(0) || 'U'}
            </Avatar>
          </Group>

          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftSection={<User size={16} />}
          />

          <TextInput
            label="Display Name"
            placeholder="Enter your display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            leftSection={<User size={16} />}
          />

          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftSection={<Mail size={16} />}
            type="email"
          />

          <Select
            label="Role"
            placeholder="Select your role"
            data={roleOptions}
            value={role}
            onChange={setRole}
            clearable
          />

          <Textarea
            label="Bio"
            placeholder="Tell us about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
          />

          <TextInput
            label="Profile Picture URL"
            placeholder="Enter profile picture URL"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            leftSection={<Camera size={16} />}
          />

          <Group justify="flex-end" gap="sm">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              leftSection={<Save size={16} />}
            >
              Save Changes
            </Button>
          </Group>
        </Stack>
      </Box>
    </Modal>
  );
} 