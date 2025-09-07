'use client';

import { 
  Group, 
  Text, 
  Avatar, 
  ActionIcon,
  Button,
  Stack,
  Divider,
  ScrollArea,
  Modal,
  TextInput,
  Textarea,
  Select,
  useMantineTheme,
  useMantineColorScheme,
  Tooltip,
  Badge,
  Box,
  Card,
  NavLink,
  Collapse,
  UnstyledButton,
  rem
} from '@mantine/core';
import { 
  Sun, 
  Moon, 
  Plus, 
  Settings, 
  Users,
  Bell,
  Search,
  Home,
  Kanban,
  Calendar,
  BarChart3,
  Folder,
  Star,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  User,
  LogOut,
  HelpCircle,
  Zap
} from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useCreateProject } from '../hooks/useCreateProject';
import { useQueryClient } from '@tanstack/react-query';
import { showNotification } from '@mantine/notifications';
import { useRouter, usePathname } from 'next/navigation';
import InviteTeamModal from './InviteTeamModal';
import UserProfileModal from './UserProfileModal';
import SearchModal from './SearchModal';

export default function Sidebar() {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { user, signOutUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // Modal states
  const [createProjectOpened, { open: openCreateProject, close: closeCreateProject }] = useDisclosure(false);
  const [inviteTeamOpened, { open: openInviteTeam, close: closeInviteTeam }] = useDisclosure(false);
  const [profileOpened, { open: openProfile, close: closeProfile }] = useDisclosure(false);
  const [searchOpened, { open: openSearch, close: closeSearch }] = useDisclosure(false);
  const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false);
  
  // Form states
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectType, setProjectType] = useState<string | null>(null);
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useProjects();
  const createProject = useCreateProject();
  const queryClient = useQueryClient();

  // Safe user data handling
  const getUserDisplayName = () => {
    if (!user) return 'Guest User';
    if (typeof user === 'string') return user;
    if (typeof user === 'object' && 'displayName' in user && user.displayName) return user.displayName;
    if (typeof user === 'object' && 'email' in user && user.email) return user.email.split('@')[0];
    return 'User';
  };

  const getUserEmail = () => {
    if (!user) return 'guest@example.com';
    if (typeof user === 'string') return user;
    if (typeof user === 'object' && user.email) return user.email;
    return 'guest@example.com';
  };

  const getUserAvatar = () => {
    if (!user || typeof user !== 'object') return null;
    return user.photoURL || null;
  };

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
      closeCreateProject();
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

  const handleSignOut = async () => {
    try {
      await signOutUser();
      showNotification({
        title: 'Signed out',
        message: 'You have been signed out successfully.',
        color: 'blue',
      });
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to sign out. Please try again.',
        color: 'red',
      });
    }
  };

  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: '/', active: pathname === '/' },
    { icon: Folder, label: 'Projects', href: '/projects', active: pathname === '/projects' },
    { icon: Kanban, label: 'Board', href: '/board', active: pathname === '/board' },
    { icon: Calendar, label: 'Calendar', href: '/calendar', active: pathname === '/calendar' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics', active: pathname === '/analytics' },
  ];

  const quickActions = [
    { icon: Plus, label: 'New Project', action: openCreateProject },
    { icon: Users, label: 'Invite Team', action: openInviteTeam },
    { icon: Search, label: 'Search', action: openSearch },
    { icon: Settings, label: 'Settings', action: openSettings },
  ];

  const projectTypes = [
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'support', label: 'Support' },
  ];

  return (
    <>
      <Stack gap="md" >
        {/* Branding */}
        <Box className="fade-in">
          <Group justify="space-between" align="center" p="xs">
            <Group gap="xs">
              <Box
                w={32}
                h={32}
                style={{
                  background: 'linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-blue-4))',
                  borderRadius: theme.radius.md,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Zap size={18} color="white" />
              </Box>
              <Text fw={700} size="lg" c="var(--mantine-text-heading)">
                IssueTracker
              </Text>
            </Group>
            
            <Group gap="xs">
              <Tooltip label={`Switch to ${colorScheme === 'dark' ? 'light' : 'dark'} mode`}>
                <ActionIcon
                  variant="subtle"
                  size="md"
                  onClick={toggleColorScheme}
                  color={colorScheme === 'dark' ? 'yellow' : 'blue'}
                >
                  {colorScheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </Box>

        <Divider />

        {/* User Profile Card */}
        <Card className="fade-in" p="md" radius="lg" withBorder>
          <Group gap="md">
            <Avatar
              src={getUserAvatar()}
              size="lg"
              radius="xl"
              color="blue"
            >
              {getUserDisplayName().charAt(0).toUpperCase()}
            </Avatar>
            <Box style={{ flex: 1 }}>
              <Text fw={600} size="sm" c="var(--mantine-text-heading)" lineClamp={1}>
                {getUserDisplayName()}
              </Text>
              <Text size="xs" c="var(--mantine-text-subheading)" lineClamp={1}>
                {getUserEmail()}
              </Text>
              <Badge size="xs" variant="light" color="green" mt={4}>
                Online
              </Badge>
            </Box>
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={openProfile}
              color="gray"
            >
              <Settings size={14} />
            </ActionIcon>
          </Group>
        </Card>

        {/* Navigation */}
        <Box className="slide-in-left">
          <Text fw={600} size="xs" c={colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[6]} mb="xs" px="xs">
            NAVIGATION
          </Text>
          <Stack gap={4}>
  {navigationItems.map((item) => (
    <Button
      key={item.label}
      variant={item.active ? 'filled' : 'subtle'}
      color={item.active ? (colorScheme === 'light' ? 'indigo' : 'blue') : 'gray'}
      size="sm"
      fullWidth
      leftSection={<item.icon size={16} />}
      onClick={() => router.push(item.href)}
      styles={(theme) => ({
        root: {
          display: 'flex',
          borderRadius: theme.radius.md,
          paddingLeft: theme.spacing.md,
          '&:hover': {
            backgroundColor: item.active
              ? colorScheme === 'light'
                ? theme.colors.indigo[0]
                : theme.colors.blue[9]
              : colorScheme === 'light'
              ? theme.colors.gray[1]
              : theme.colors.dark[6],
          },
        },
        leftIcon: {
          marginRight: theme.spacing.sm,
        },
      })}
    >
      {item.label}
    </Button>
  ))}
</Stack>
        </Box>

        {/* Quick Actions */}
        <Box className="slide-in-left">
          <Text fw={600} size="xs" c={colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[6]} mb="xs" px="xs">
            QUICK ACTIONS
          </Text>
          <Stack gap={4}>
            {quickActions.map((action) => (
              <Button
                key={action.label}
                onClick={action.action}
                leftSection={<action.icon size={16} />}
                variant="subtle"
                color="gray"
                size="sm"
                fullWidth
                style={{ display: 'flex', justifyContent: 'flex-start' }}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        </Box>

        {/* Projects Section */}
        <Box className="slide-in-left" style={{ flex: 1 }}>
          <Group justify="space-between" align="center" mb="xs" px="xs">
            <Text fw={600} size="xs" c="var(--mantine-text-subheading)">
              PROJECTS
            </Text>
            <UnstyledButton
              onClick={() => setProjectsExpanded(!projectsExpanded)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 20,
                height: 20,
                borderRadius: theme.radius.sm,
                color: 'var(--mantine-text-subheading)',
                transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'var(--mantine-color-gray-100)',
                },
              }}
            >
              {projectsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </UnstyledButton>
          </Group>
          
          <Collapse in={projectsExpanded}>
            <ScrollArea h={300} scrollbarSize={6}>
              <Stack gap="xs">
                {projectsLoading && <Text c="var(--mantine-text-subheading)" ta="center">Loading projects...</Text>}
                {projectsError && <Text c="var(--mantine-text-subheading)" ta="center" color="red">{projectsError.message}</Text>}
                {projects && projects.length === 0 && (
                  <Text c="var(--mantine-text-subheading)" ta="center">No projects found. Create a new one!</Text>
                )}
                {projects && projects.map((project) => (
                  <Card
                    key={project.id}
                    p="sm"
                    radius="md"
                    withBorder
                    style={{
                      cursor: 'pointer',
                      transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: 'var(--mantine-shadow-md)',
                      },
                    }}
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <Group justify="space-between" align="flex-start" mb="xs">
                      <Box style={{ flex: 1 }}>
                        <Group gap="xs" mb={4}>
                          <Text fw={500} size="sm" lineClamp={1}>
                            {project.name}
                          </Text>
                        </Group>
                        {project.description && (
                          <Text size="xs" c="var(--mantine-text-subheading)" mb="xs" lineClamp={2}>
                            {project.description}
                          </Text>
                        )}
                      </Box>
                      <ActionIcon
                        variant="subtle"
                        size="xs"
                        color="gray"
                      >
                        <MoreHorizontal size={12} />
                      </ActionIcon>
                    </Group>
                    <Group justify="space-between" align="center">
                      <Text size="xs" c="var(--mantine-text-subheading)">
                        {project.members?.length ?? 1} member{(project.members?.length ?? 1) > 1 ? 's' : ''}
                      </Text>
                      <Text size="xs" c="var(--mantine-text-subheading)">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </Text>
                    </Group>
                  </Card>
                ))}
              </Stack>
            </ScrollArea>
          </Collapse>
        </Box>

        {/* Footer Actions */}
        <Box className="slide-in-left">
          <Divider mb="md" />
          <Stack gap={4}>
            <UnstyledButton
              onClick={() => console.log('Help & Support')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                borderRadius: theme.radius.lg,
                color: 'var(--mantine-text-subheading)',
                fontSize: theme.fontSizes.sm,
                fontWeight: 500,
                transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'var(--mantine-color-gray-50)',
                  color: 'var(--mantine-text-heading)',
                },
              }}
            >
              <HelpCircle size={16} />
              <span>Help & Support</span>
            </UnstyledButton>
            
            <UnstyledButton
              onClick={handleSignOut}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                borderRadius: theme.radius.lg,
                color: 'var(--mantine-color-red-6)',
                fontSize: theme.fontSizes.sm,
                fontWeight: 500,
                transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'var(--mantine-color-red-50)',
                  color: 'var(--mantine-color-red-7)',
                },
              }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </UnstyledButton>
          </Stack>
        </Box>
      </Stack>

      {/* Create Project Modal */}
      <Modal
        opened={createProjectOpened}
        onClose={closeCreateProject}
        title="Create New Project"
        style={{color: 'var(--mantine-text-heading)'}}
        styles={{
          title: {
            color: 'var(--mantine-text-heading)',
            fontWeight: 'bold',
            fontSize: '1.25rem',
          },
        }}
        size="md"
        centered
      >
        <Stack gap="md">
          <TextInput
            label="Project Name"
            style={{ color: 'var(--mantine-text-heading)' }}
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
          
          <Textarea
            label="Description"
            placeholder="Enter project description"
            style={{ color: 'var(--mantine-text-heading)' }}
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
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
            <Button variant="light" onClick={closeCreateProject}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject} disabled={!projectName}>
              Create Project
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Modals */}
      <InviteTeamModal opened={inviteTeamOpened} onClose={closeInviteTeam} />
      <UserProfileModal opened={profileOpened} onClose={closeProfile} />
      <SearchModal opened={searchOpened} onClose={closeSearch} />
    </>
  );
}
