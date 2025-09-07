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
  Alert,
  Box
} from '@mantine/core';
import { 
  UserPlus, 
  Mail, 
  Users,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { useInviteUser } from '../hooks/useUserProfile';
import { useProjects } from '../hooks/useProjects';
import { showNotification } from '@mantine/notifications';

interface InviteTeamModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function InviteTeamModal({ opened, onClose }: InviteTeamModalProps) {
  const [email, setEmail] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const inviteUser = useInviteUser();
  const { data: projects } = useProjects();

  const handleSubmit = async () => {
    if (!email) return;
    
    setIsSubmitting(true);
    try {
      await inviteUser.mutateAsync({
        email,
        projectId: projectId || undefined,
      });
      
      showNotification({
        title: 'Invitation sent',
        message: 'Team member invitation has been sent successfully.',
        color: 'green',
      });
      
      setEmail('');
      setProjectId(null);
      setMessage('');
      onClose();
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to send invitation. Please try again.',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectOptions = projects?.map(project => ({
    value: project.id,
    label: project.name,
  })) || [];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Invite Team Member"
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
        <LoadingOverlay visible={isSubmitting} />
        
        <Stack gap="md">
          <Alert
            icon={<AlertCircle size={16} />}
            title="Invite Team Member"
            color="blue"
            variant="light"
          >
            Send an invitation to collaborate on your projects. The user will receive an email with instructions to join.
          </Alert>

          <TextInput
            label="Email Address"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftSection={<Mail size={16} />}
            required
          />

          <Select
            label="Add to Project (Optional)"
            placeholder="Select a project"
            data={projectOptions}
            value={projectId}
            onChange={setProjectId}
            leftSection={<Users size={16} />}
            clearable
          />

          <Textarea
            label="Personal Message (Optional)"
            placeholder="Add a personal message to the invitation..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />

          <Group justify="flex-end" gap="sm">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!email || isSubmitting}
              leftSection={<UserPlus size={16} />}
            >
              Send Invitation
            </Button>
          </Group>
        </Stack>
      </Box>
    </Modal>
  );
} 