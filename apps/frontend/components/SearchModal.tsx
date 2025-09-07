'use client';

import { 
  Modal, 
  TextInput, 
  Stack, 
  Text, 
  Group, 
  Badge, 
  Card, 
  Avatar, 
  Divider,
  LoadingOverlay,
  Box,
  Anchor
} from '@mantine/core';
import { 
  Search, 
  Folder, 
  MessageSquare, 
  User, 
  Calendar,
  Clock,
  Tag
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGlobalSearch } from '../hooks/useSearch';
import { useRouter } from 'next/navigation';

interface SearchModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function SearchModal({ opened, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { data: searchResults, isLoading } = useGlobalSearch(searchQuery);

  useEffect(() => {
    if (opened) {
      setSearchQuery('');
    }
  }, [opened]);

  const handleResultClick = (type: string, id: string) => {
    switch (type) {
      case 'project':
        router.push(`/projects/${id}`);
        break;
      case 'ticket':
        router.push(`/board?ticket=${id}`);
        break;
      case 'user':
        router.push(`/users/${id}`);
        break;
    }
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Search"
      size="lg"
      centered
      styles={{
        title: {
          color: 'var(--mantine-text-heading)',
          fontWeight: 'bold',
          fontSize: '1.25rem',
        },
      }}
    >
      <Stack gap="md">
        <TextInput
          placeholder="Search projects, tickets, or people..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftSection={<Search size={16} />}
          autoFocus
        />

        <Box pos="relative" style={{ minHeight: 200 }}>
          <LoadingOverlay visible={isLoading} />
          
          {searchQuery.length < 2 && (
            <Text c="dimmed" ta="center" py="xl">
              Type at least 2 characters to search
            </Text>
          )}

          {searchQuery.length >= 2 && !isLoading && searchResults && (
            <Stack gap="md">
              {/* Projects */}
              {searchResults.projects && searchResults.projects.length > 0 && (
                <Box>
                  <Group gap="xs" mb="sm">
                    <Folder size={16} />
                    <Text fw={600} size="sm">Projects</Text>
                    <Badge size="xs" variant="light">{searchResults.projects.length}</Badge>
                  </Group>
                  <Stack gap="xs">
                    {searchResults.projects.map((project: any) => (
                      <Card
                        key={project.id}
                        p="sm"
                        withBorder
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleResultClick('project', project.id)}
                      >
                        <Text fw={500} size="sm" lineClamp={1}>{project.name}</Text>
                        {project.description && (
                          <Text size="xs" c="dimmed" lineClamp={1} mt={4}>
                            {project.description}
                          </Text>
                        )}
                        <Text size="xs" c="dimmed" mt={4}>
                          Created {formatDate(project.createdAt)}
                        </Text>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Tickets */}
              {searchResults.tickets && searchResults.tickets.length > 0 && (
                <Box>
                  <Group gap="xs" mb="sm">
                    <MessageSquare size={16} />
                    <Text fw={600} size="sm">Tickets</Text>
                    <Badge size="xs" variant="light">{searchResults.tickets.length}</Badge>
                  </Group>
                  <Stack gap="xs">
                    {searchResults.tickets.map((ticket: any) => (
                      <Card
                        key={ticket.id}
                        p="sm"
                        withBorder
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleResultClick('ticket', ticket.id)}
                      >
                        <Group justify="space-between" align="flex-start">
                          <Box style={{ flex: 1 }}>
                            <Text fw={500} size="sm" lineClamp={1}>{ticket.title}</Text>
                            {ticket.description && (
                              <Text size="xs" c="dimmed" lineClamp={1} mt={4}>
                                {ticket.description}
                              </Text>
                            )}
                          </Box>
                          <Badge size="xs" variant="light" color={
                            ticket.priority === 'high' ? 'red' : 
                            ticket.priority === 'medium' ? 'yellow' : 'blue'
                          }>
                            {ticket.priority}
                          </Badge>
                        </Group>
                        <Text size="xs" c="dimmed" mt={4}>
                          {ticket.status} • {formatDate(ticket.createdAt)}
                        </Text>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Users */}
              {searchResults.users && searchResults.users.length > 0 && (
                <Box>
                  <Group gap="xs" mb="sm">
                    <User size={16} />
                    <Text fw={600} size="sm">People</Text>
                    <Badge size="xs" variant="light">{searchResults.users.length}</Badge>
                  </Group>
                  <Stack gap="xs">
                    {searchResults.users.map((user: any) => (
                      <Card
                        key={user.id}
                        p="sm"
                        withBorder
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleResultClick('user', user.id)}
                      >
                        <Group gap="sm">
                          <Avatar src={user.photoURL} size="sm" radius="xl">
                            {user.name?.charAt(0) || user.email?.charAt(0)}
                          </Avatar>
                          <Box style={{ flex: 1 }}>
                            <Text fw={500} size="sm">{user.name || user.displayName}</Text>
                            <Text size="xs" c="dimmed">{user.email}</Text>
                          </Box>
                        </Group>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}

              {(!searchResults.projects || searchResults.projects.length === 0) &&
               (!searchResults.tickets || searchResults.tickets.length === 0) &&
               (!searchResults.users || searchResults.users.length === 0) && (
                <Text c="dimmed" ta="center" py="xl">
                  No results found for "{searchQuery}"
                </Text>
              )}
            </Stack>
          )}
        </Box>
      </Stack>
    </Modal>
  );
} 