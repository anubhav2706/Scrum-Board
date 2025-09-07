'use client';

import { 
  Container, 
  Text, 
  Card, 
  Group, 
  Badge, 
  Stack, 
  Button, 
  ActionIcon,
  useMantineTheme,
  useMantineColorScheme,
  Box,
  SimpleGrid,
  Paper,
  Divider,
  Modal,
  TextInput,
  Textarea,
  Select,
  Avatar,
  AvatarGroup,
  Progress,
  Menu,
  Tooltip
} from '@mantine/core';
import { 
  Plus, 
  MoreHorizontal,
  Users,
  Calendar,
  Star,
  Eye,
  GitBranch,
  Zap,
  Filter,
  Search,
  SortAsc,
  Settings,
  Archive,
  Trash2,
  Edit,
  Copy,
  Share,
  Lock,
  Unlock,
  Folder,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useUsers } from '../../hooks/useUsers';
import { useCreateProject } from '../../hooks/useCreateProject';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';

export default function ProjectsPage() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const router = useRouter();
  
  // Fetch data
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: users, isLoading: usersLoading } = useUsers();
  const createProject = useCreateProject();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('createdAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modal state
  const [createModalOpened, { open: openCreateModal, close: closeCreateModal }] = useDisclosure(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectType, setProjectType] = useState<string | null>(null);

  // Handle loading state
  if (projectsLoading || usersLoading) {
    return (
      <Container size="xl" py="xl">
        <LoadingSpinner message="Loading projects..." />
      </Container>
    );
  }

  const handleCreateProject = async () => {
    if (!projectName) return;
    try {
      await createProject.mutateAsync({
        name: projectName,
        description: projectDescription,
      });
      showNotification({
        title: 'Project created',
        message: 'Your project was created successfully.',
        color: 'green',
      });
      closeCreateModal();
      setProjectName('');
      setProjectDescription('');
      setProjectType(null);
    } catch (err) {
      showNotification({
        title: 'Error',
        message: 'Failed to create project.',
        color: 'red',
      });
    }
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  const getProjectProgress = (project: any) => {
    // Mock progress calculation - projects don't have ticket counts in the interface
    return Math.floor(Math.random() * 100); // Mock progress for now
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'paused': return 'yellow';
      case 'completed': return 'blue';
      case 'archived': return 'gray';
      default: return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Filter and sort projects
  const filteredProjects = projects?.filter(project => {
    if (searchQuery && !project.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  }) || [];

  const projectTypes = [
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'support', label: 'Support' },
  ];



  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <Group justify="space-between" align="center" mb="xl">
        <Box>
          <Text fw={700} size="xl" c="var(--mantine-text-heading)">
            Projects
          </Text>
          <Text c="var(--mantine-text-subheading)" size="sm">
            Manage and track your projects
          </Text>
        </Box>
        
        <Button
          leftSection={<Plus size={16} />}
          onClick={openCreateModal}
        >
          New Project
        </Button>
      </Group>

      {/* Filters and Search */}
      <Card mb="lg" p="md" withBorder>
        <Group gap="md" wrap="wrap">
          <TextInput
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftSection={<Search size={16} />}
            style={{ flex: 1, minWidth: 200 }}
          />
          
          <Select
            placeholder="Sort by"
            data={[
              { value: 'name', label: 'Name' },
              { value: 'createdAt', label: 'Created Date' },
            ]}
            value={sortBy}
            onChange={(value) => setSortBy(value as any)}
            size="sm"
          />
          
          <Group gap={4}>
            <ActionIcon
              variant={viewMode === 'grid' ? 'filled' : 'light'}
              onClick={() => setViewMode('grid')}
              size="sm"
            >
              <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                <Box w={3} h={3} bg="currentColor" />
                <Box w={3} h={3} bg="currentColor" />
                <Box w={3} h={3} bg="currentColor" />
                <Box w={3} h={3} bg="currentColor" />
              </Box>
            </ActionIcon>
            <ActionIcon
              variant={viewMode === 'list' ? 'filled' : 'light'}
              onClick={() => setViewMode('list')}
              size="sm"
            >
              <Box style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box w={12} h={2} bg="currentColor" />
                <Box w={12} h={2} bg="currentColor" />
                <Box w={12} h={2} bg="currentColor" />
              </Box>
            </ActionIcon>
          </Group>
        </Group>
      </Card>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <Card p="xl" withBorder>
          <Stack align="center" gap="md">
            <Folder size={48} color={theme.colors.gray[4]} />
            <Text size="lg" fw={500} c="dimmed">
              {searchQuery ? 'No projects found' : 'No projects yet'}
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              {searchQuery 
                ? 'Try adjusting your search'
                : 'Create your first project to get started'
              }
            </Text>
            {!searchQuery && (
              <Button onClick={openCreateModal}>
                Create Project
              </Button>
            )}
          </Stack>
        </Card>
      ) : (
        <SimpleGrid cols={viewMode === 'grid' ? { base: 1, sm: 2, lg: 3 } : 1} spacing="lg">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              p="md"
              withBorder
              style={{
                cursor: 'pointer',
                transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 'var(--mantine-shadow-lg)',
                },
              }}
              onClick={() => handleProjectClick(project.id)}
            >
              <Group justify="space-between" align="flex-start" mb="md">
                <Box style={{ flex: 1 }}>
                  <Text fw={600} size="lg" lineClamp={1} mb={4}>
                    {project.name}
                  </Text>
                  
                  {project.description && (
                    <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                      {project.description}
                    </Text>
                  )}
                </Box>
                
                <Menu shadow="md" width={200} position="bottom-end">
                  <Menu.Target>
                    <ActionIcon
                      variant="subtle"
                      size="sm"
                      color="gray"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  
                  <Menu.Dropdown>
                    <Menu.Item leftSection={<Eye size={16} />}>
                      View Project
                    </Menu.Item>
                    <Menu.Item leftSection={<Edit size={16} />}>
                      Edit Project
                    </Menu.Item>
                    <Menu.Item leftSection={<Share size={16} />}>
                      Share Project
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item leftSection={<Archive size={16} />} color="yellow">
                      Archive Project
                    </Menu.Item>
                    <Menu.Item leftSection={<Trash2 size={16} />} color="red">
                      Delete Project
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>

              {/* Progress */}
              <Box mb="md">
                <Group justify="space-between" mb={4}>
                  <Text size="xs" c="dimmed">Progress</Text>
                  <Text size="xs" fw={500}>
                    {getProjectProgress(project).toFixed(0)}%
                  </Text>
                </Group>
                <Progress
                  value={getProjectProgress(project)}
                  size="sm"
                  color="blue"
                />
              </Box>

              {/* Project Stats */}
              <Group justify="space-between" align="center">
                <Group gap="lg">
                  <Group gap={4}>
                    <Users size={14} />
                    <Text size="xs" c="dimmed">
                      {project.members?.length || 1} member{(project.members?.length || 1) > 1 ? 's' : ''}
                    </Text>
                  </Group>
                  
                  <Group gap={4}>
                    <CheckCircle size={14} />
                    <Text size="xs" c="dimmed">
                      {Math.floor(Math.random() * 20) + 5} tickets
                    </Text>
                  </Group>
                </Group>
                
                <Text size="xs" c="dimmed">
                  {formatDate(project.createdAt)}
                </Text>
              </Group>

              {/* Team Members */}
              {project.members && project.members.length > 0 && (
                <Group gap="xs" mt="md">
                  <AvatarGroup>
                    {project.members.slice(0, 3).map((member: any) => (
                      <Avatar
                        key={member.id}
                        src={member.photoURL}
                        size="sm"
                        radius="xl"
                      >
                        {member.name?.charAt(0) || 'U'}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                  {project.members.length > 3 && (
                    <Text size="xs" c="dimmed">
                      +{project.members.length - 3} more
                    </Text>
                  )}
                </Group>
              )}
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* Create Project Modal */}
      <Modal
        opened={createModalOpened}
        onClose={closeCreateModal}
        title="Create New Project"
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
        <Stack gap="md">
          <TextInput
            label="Project Name"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
          
          <Textarea
            label="Description"
            placeholder="Enter project description"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            rows={3}
          />
          
          <Select
            label="Project Type"
            placeholder="Select project type"
            data={projectTypes}
            value={projectType}
            onChange={setProjectType}
            clearable
          />
          
          <Group justify="flex-end" gap="sm">
            <Button variant="light" onClick={closeCreateModal}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject} disabled={!projectName}>
              Create Project
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
} 