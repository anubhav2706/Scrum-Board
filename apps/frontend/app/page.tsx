"use client";

import { 
  Container, 
  Grid, 
  Card, 
  Text, 
  Group, 
  Badge, 
  Stack, 
  Button, 
  ActionIcon,
  Progress,
  Avatar,
  AvatarGroup,
  useMantineTheme,
  useMantineColorScheme,
  Timeline,
  RingProgress,
  Box,
  Divider,
  Paper,
  SimpleGrid,
  Flex,
  rem
} from '@mantine/core';
import { 
  Plus, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Calendar,
  MessageSquare,
  Star,
  Eye,
  GitBranch,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Award,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../hooks/useProjects';
import LoadingSpinner from '../components/LoadingSpinner';
import "../styles/globals.css";
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { useUsers } from '../hooks/useUsers';

export default function HomePage() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { user } = useAuth();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: users, isLoading: usersLoading, error: usersError } = useUsers();

  // Fetch dashboard summary
  const { data: dashboard, isLoading: dashboardLoading, error: dashboardError } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/summary');
      return data;
    },
  });

  // Handle loading state
  if (projectsLoading || dashboardLoading) {
    return (
      <Container size="xl" py="xl">
        <LoadingSpinner message="Loading dashboard..." />
      </Container>
    );
  }
  if (dashboardError) {
    return (
      <Container size="xl" py="xl">
        <Text c="red">Error loading dashboard data.</Text>
      </Container>
    );
  }

  // Safe user data handling
  const getUserDisplayName = () => {
    if (!user) return 'Guest User';
    if (typeof user === 'string') return user;
    if (typeof user === 'object' && 'displayName' in user && user.displayName) return user.displayName;
    if (typeof user === 'object' && 'email' in user && user.email) return user.email.split('@')[0];
    return 'User';
  };

  // Use API data instead of mock data
  const stats = [
    {
      title: 'Total Projects',
      value: dashboard?.stats?.totalProjects ?? 0,
      change: '+0%',
      changeType: 'increase' as const,
      icon: GitBranch,
      color: 'blue',
      description: 'Active projects this month',
    },
    {
      title: 'Active Tickets',
      value: dashboard?.stats?.activeTickets ?? 0,
      change: '+0%',
      changeType: 'increase' as const,
      icon: Activity,
      color: 'green',
      description: 'Tickets in progress',
    },
    {
      title: 'Completed',
      value: dashboard?.stats?.completed ?? 0,
      change: '+0%',
      changeType: 'increase' as const,
      icon: CheckCircle,
      color: 'teal',
      description: 'Successfully completed',
    },
    {
      title: 'Overdue',
      value: dashboard?.stats?.overdue ?? 0,
      change: '-0%',
      changeType: 'decrease' as const,
      icon: AlertCircle,
      color: 'red',
      description: 'Requires attention',
    },
  ];

  const recentProjects = dashboard?.recentProjects ?? [];
  const teamActivity = dashboard?.teamActivity ?? [];
  // Replace teamMembers with users in the Team Members section
  // Show loading and error states for users

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Unknown';
    }
  };

  // Restore weeklyMetrics definition:
  const weeklyMetrics = dashboard?.weeklyMetrics ?? [];

  return (
    <Container size="xl" py="xl">
      {/* Welcome Header */}
      <Box className="fade-in" mb="xl">
        <Text size="3xl" fw={800} c="var(--mantine-text-heading)" mb="xs">
          Welcome back, {getUserDisplayName()}! 👋
        </Text>
        <Text size="lg" c="var(--mantine-text-subheading)">
          Here's what's happening with your projects today
        </Text>
      </Box>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="xl">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="fade-in"
            p="lg"
            radius="xl"
            withBorder
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <Group justify="space-between" align="flex-start" mb="md">
              <Box>
                <Text size="xs" c="var(--mantine-text-subheading)" fw={500} mb={4}>
                  {stat.title}
                </Text>
                <Text size="2xl" fw={700} c="var(--mantine-text-heading)" mb={4}>
                  {stat.value}
                </Text>
                <Group gap="xs" align="center">
                  <Box
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      color: stat.changeType === 'increase' ? 'var(--mantine-color-green-6)' : 'var(--mantine-color-red-6)',
                    }}
                  >
                    {stat.changeType === 'increase' ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                    <Text size="xs" fw={600}>
                      {stat.change}
                    </Text>
                  </Box>
                  <Text size="xs" c="var(--mantine-text-subheading)">
                    from last month
                  </Text>
                </Group>
              </Box>
              <Box
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: theme.radius.lg,
                  background: `var(--mantine-color-${stat.color}-50)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: `var(--mantine-color-${stat.color}-6)`,
                }}
              >
                <stat.icon size={24} />
              </Box>
            </Group>
            <Text size="xs" c="var(--mantine-text-subheading)" lineClamp={1}>
              {stat.description}
            </Text>
          </Card>
        ))}
      </SimpleGrid>

      {/* Main Content Grid */}
      <Grid gutter="lg">
        {/* Recent Projects */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Card className="fade-in" p="lg" radius="xl" withBorder>
            <Group justify="space-between" align="center" mb="lg">
              <Text size="xl" fw={700} c="var(--mantine-text-heading)">
                Recent Projects
              </Text>
              <Button
                variant="light"
                size="sm"
                leftSection={<Plus size={16} />}
                style={{
                  borderRadius: theme.radius.lg,
                  fontWeight: 500,
                }}
              >
                New Project
              </Button>
            </Group>

            <Stack gap="md">
              {recentProjects.map((project) => (
                <Card
                  key={project.id}
                  p="md"
                  radius="lg"
                  withBorder
                  style={{
                    cursor: 'pointer',
                    transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 'var(--mantine-shadow-lg)',
                    },
                  }}
                >
                  <Group justify="space-between" align="flex-start" mb="md">
                    <Box style={{ flex: 1 }}>
                      <Group gap="sm" mb={8}>
                        <Text fw={600} size="sm" lineClamp={1}>
                          {project.name}
                        </Text>
                        <Badge
                          size="xs"
                          variant="light"
                          color={getPriorityColor(project.priority)}
                        >
                          {getPriorityLabel(project.priority)}
                        </Badge>
                      </Group>
                      
                      <Box mb="md">
                        <Group justify="space-between" mb={4}>
                          <Text size="xs" c="var(--mantine-text-subheading)">
                            Progress
                          </Text>
                          <Text size="xs" fw={600}>
                            {project.progress}%
                          </Text>
                        </Group>
                        <Box
                          style={{
                            width: '100%',
                            height: 6,
                            background: 'var(--mantine-color-gray-200)',
                            borderRadius: theme.radius.full,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            style={{
                              width: `${project.progress}%`,
                              height: '100%',
                              background: 'var(--mantine-color-blue-500)',
                              borderRadius: theme.radius.full,
                              transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                    
                    <ActionIcon
                      variant="subtle"
                      size="sm"
                      color="gray"
                    >
                      <MoreVertical size={16} />
                    </ActionIcon>
                  </Group>

                  <Group justify="space-between" align="center">
                    <Group gap="md">
                      <Group gap="xs">
                        <Users size={14} color="var(--mantine-text-subheading)" />
                        <Text size="xs" c="var(--mantine-text-subheading)">
                          {project.members?.length ?? 0} members
                        </Text>
                      </Group>
                      <Group gap="xs">
                        <MessageSquare size={14} color="var(--mantine-text-subheading)" />
                        <Text size="xs" c="var(--mantine-text-subheading)">
                          {project.tickets} tickets
                        </Text>
                      </Group>
                    </Group>
                    
                    <Group gap="xs">
                      <Calendar size={14} color="var(--mantine-text-subheading)" />
                      <Text size="xs" c="var(--mantine-text-subheading)">
                        Due {project.dueDate}
                      </Text>
                    </Group>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Card>
        </Grid.Col>

        {/* Sidebar Content */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack gap="lg">
            {/* Team Activity */}
            <Card className="fade-in" p="lg" radius="xl" withBorder>
              <Text size="lg" fw={700} c="var(--mantine-text-heading)" mb="lg">
                Team Activity
              </Text>
              
              <Timeline active={1} bulletSize={24} lineWidth={2}>
                {teamActivity.map((activity, index) => (
                  <Timeline.Item
                    key={activity.id || index}
                    bullet={<Avatar size={20} radius="xl" color="blue">{activity.user.charAt(0)}</Avatar>}
                    title={
                      <Text size="sm" fw={600} lineClamp={1}>
                        {activity.user}
                      </Text>
                    }
                  >
                    <Text size="xs" c="var(--mantine-text-subheading)" lineClamp={2} mb={4}>
                      {activity.action}
                    </Text>
                    <Text size="xs" c="var(--mantine-text-subheading)">
                      {activity.time}
                    </Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>

            {/* Team Members */}
            <Card className="fade-in" p="lg" radius="xl" withBorder>
              <Text size="lg" fw={700} c="var(--mantine-text-heading)" mb="lg">
                Team Members
              </Text>
              
              {usersLoading ? (
                <Text>Loading team members...</Text>
              ) : usersError ? (
                <Text color="red">Error loading team members.</Text>
              ) : (
                <Stack gap="sm">
                  {users?.map((member, index) => (
                    <Group key={`${member.id || member.email || index}`} gap="sm">
                      <Avatar
                        size="md"
                        radius="xl"
                        color="blue"
                      >
                        {member.name.charAt(0)}
                      </Avatar>
                      <Box style={{ flex: 1 }}>
                        <Text size="sm" fw={500} lineClamp={1}>
                          {member.name}
                        </Text>
                        <Text size="xs" c="var(--mantine-text-subheading)" lineClamp={1}>
                          {member.role}
                        </Text>
                      </Box>
                    </Group>
                  ))}
                </Stack>
              )}
            </Card>

            {/* Weekly Performance */}
            <Card className="fade-in" p="lg" radius="xl" withBorder>
              <Text size="lg" fw={700} c="var(--mantine-text-heading)" mb="lg">
                Weekly Performance
              </Text>
              
              <Group justify="space-between" align="center" mb="lg">
                <Box>
                  <Text size="2xl" fw={700} c="var(--mantine-text-heading)">
                    81
                  </Text>
                  <Text size="xs" c="var(--mantine-text-subheading)">
                    Tasks completed
                  </Text>
                </Box>
                <RingProgress
                  size={80}
                  thickness={8}
                  sections={[{ value: 81, color: 'var(--mantine-color-blue-6)' }]}
                  label={
                    <Text ta="center" size="xs" fw={600}>
                      81%
                    </Text>
                  }
                />
              </Group>
              
              <Stack gap="xs">
                {weeklyMetrics.slice(0, 5).map((metric, index) => (
                  <Group key={metric.day || index} justify="space-between" align="center">
                    <Text size="xs" fw={500}>
                      {metric.day}
                    </Text>
                    <Group gap="lg">
                      <Text size="xs" c="var(--mantine-color-green-6)">
                        +{metric.completed}
                      </Text>
                      <Text size="xs" c="var(--mantine-color-blue-6)">
                        {metric.created} new
                      </Text>
                    </Group>
                  </Group>
                ))}
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Quick Actions */}
      <Card className="fade-in" p="lg" radius="xl" withBorder mt="xl">
        <Text size="lg" fw={700} c="var(--mantine-text-heading)" mb="lg">
          Quick Actions
        </Text>
        
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
          <Button
            variant="light"
            size="lg"
            leftSection={<Plus size={20} />}
            style={{
              borderRadius: theme.radius.lg,
              fontWeight: 500,
              height: 80,
            }}
          >
            Create Project
          </Button>
          
          <Button
            variant="light"
            size="lg"
            leftSection={<MessageSquare size={20} />}
            style={{
              borderRadius: theme.radius.lg,
              fontWeight: 500,
              height: 80,
            }}
          >
            New Ticket
          </Button>
          
          <Button
            variant="light"
            size="lg"
            leftSection={<Users size={20} />}
            style={{
              borderRadius: theme.radius.lg,
              fontWeight: 500,
              height: 80,
            }}
          >
            Invite Team
          </Button>
          
          <Button
            variant="light"
            size="lg"
            leftSection={<BarChart3 size={20} />}
            style={{
              borderRadius: theme.radius.lg,
              fontWeight: 500,
              height: 80,
            }}
          >
            View Reports
          </Button>
        </SimpleGrid>
      </Card>
    </Container>
  );
} 