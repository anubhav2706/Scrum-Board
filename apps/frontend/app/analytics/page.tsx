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
  Progress,
  RingProgress,
  Select
} from '@mantine/core';
import { 
  TrendingUp, 
  TrendingDown,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  Award,
  BarChart3,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useTickets } from '../../hooks/useTickets';
import { useUsers } from '../../hooks/useUsers';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

export default function AnalyticsPage() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  // Fetch data
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: users, isLoading: usersLoading } = useUsers();
  
  // Select the first project for now (TODO: add project selection)
  const currentProject = projects && projects.length > 0 ? projects[0] : null;
  const projectId = currentProject?.id;
  
  const { data: tickets, isLoading: ticketsLoading } = useTickets(projectId);

  // Analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics', projectId],
    queryFn: async () => {
      const { data } = await api.get(`/dashboard/analytics${projectId ? `?projectId=${projectId}` : ''}`);
      return data;
    },
    enabled: !!projectId,
  });

  // State
  const [selectedProject, setSelectedProject] = useState<string | null>(projectId);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Handle loading state
  if (projectsLoading || ticketsLoading || usersLoading || analyticsLoading) {
    return (
      <Container size="xl" py="xl">
        <LoadingSpinner message="Loading analytics..." />
      </Container>
    );
  }

  // Calculate metrics from tickets data
  const calculateMetrics = () => {
    if (!tickets) return null;

    const totalTickets = tickets.length;
    const completedTickets = tickets.filter(t => t.status === 'done').length;
    const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length;
    const todoTickets = tickets.filter(t => t.status === 'todo').length;
    const highPriorityTickets = tickets.filter(t => t.priority === 'high').length;

    const completionRate = totalTickets > 0 ? (completedTickets / totalTickets) * 100 : 0;
    const averageCompletionTime = 5.2; // Mock data - would calculate from actual data

    return {
      totalTickets,
      completedTickets,
      inProgressTickets,
      todoTickets,
      highPriorityTickets,
      completionRate,
      averageCompletionTime,
    };
  };

  const metrics = calculateMetrics();

  const projectOptions = projects?.map(project => ({
    value: project.id,
    label: project.name,
  })) || [];

  const timeframeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
  ];

  // Mock chart data
  const ticketStatusData = [
    { name: 'To Do', value: metrics?.todoTickets || 0, color: 'gray' },
    { name: 'In Progress', value: metrics?.inProgressTickets || 0, color: 'blue' },
    { name: 'Review', value: 5, color: 'yellow' },
    { name: 'Done', value: metrics?.completedTickets || 0, color: 'green' },
  ];

  const priorityData = [
    { name: 'High', value: metrics?.highPriorityTickets || 0, color: 'red' },
    { name: 'Medium', value: 15, color: 'yellow' },
    { name: 'Low', value: 8, color: 'blue' },
  ];

  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <Group justify="space-between" align="center" mb="xl">
        <Box>
          <Text fw={700} size="xl" c="var(--mantine-text-heading)">
            Analytics
          </Text>
          <Text c="var(--mantine-text-subheading)" size="sm">
            Track project performance and team productivity
          </Text>
        </Box>
        
        <Group gap="sm">
          <Select
            placeholder="Select project"
            data={projectOptions}
            value={selectedProject}
            onChange={setSelectedProject}
            size="sm"
          />
          <Select
            placeholder="Timeframe"
            data={timeframeOptions}
            value={timeframe}
            onChange={(value) => setTimeframe(value as any)}
            size="sm"
          />
          <Button
            variant="light"
            leftSection={<Download size={16} />}
            size="sm"
          >
            Export
          </Button>
          <Button
            variant="light"
            leftSection={<RefreshCw size={16} />}
            size="sm"
          >
            Refresh
          </Button>
        </Group>
      </Group>

      {/* Key Metrics */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="xl">
        <Card p="md" withBorder>
          <Group justify="space-between" align="flex-start">
            <Box>
              <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                Total Tickets
              </Text>
              <Text fw={700} size="xl">
                {metrics?.totalTickets || 0}
              </Text>
              <Text size="xs" c="green" fw={500}>
                +12% from last month
              </Text>
            </Box>
            <ActionIcon variant="light" color="blue" size="lg">
              <BarChart3 size={20} />
            </ActionIcon>
          </Group>
        </Card>

        <Card p="md" withBorder>
          <Group justify="space-between" align="flex-start">
            <Box>
              <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                Completion Rate
              </Text>
              <Text fw={700} size="xl">
                {metrics?.completionRate.toFixed(1) || 0}%
              </Text>
              <Text size="xs" c="green" fw={500}>
                +5% from last month
              </Text>
            </Box>
            <ActionIcon variant="light" color="green" size="lg">
              <CheckCircle size={20} />
            </ActionIcon>
          </Group>
        </Card>

        <Card p="md" withBorder>
          <Group justify="space-between" align="flex-start">
            <Box>
              <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                Avg. Completion Time
              </Text>
              <Text fw={700} size="xl">
                {metrics?.averageCompletionTime || 0}d
              </Text>
              <Text size="xs" c="red" fw={500}>
                +2d from last month
              </Text>
            </Box>
            <ActionIcon variant="light" color="yellow" size="lg">
              <Clock size={20} />
            </ActionIcon>
          </Group>
        </Card>

        <Card p="md" withBorder>
          <Group justify="space-between" align="flex-start">
            <Box>
              <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                High Priority
              </Text>
              <Text fw={700} size="xl">
                {metrics?.highPriorityTickets || 0}
              </Text>
              <Text size="xs" c="red" fw={500}>
                +3 from last week
              </Text>
            </Box>
            <ActionIcon variant="light" color="red" size="lg">
              <AlertCircle size={20} />
            </ActionIcon>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Charts */}
      <SimpleGrid cols={{ base: 1, lg: 2 }} mb="xl">
        {/* Ticket Status Distribution */}
        <Card p="md" withBorder>
          <Text fw={600} size="lg" mb="md">
            Ticket Status Distribution
          </Text>
          <Box style={{ height: 300 }}>
            <RingProgress
              size={200}
              thickness={16}
              sections={ticketStatusData.map(item => ({
                value: (item.value / (metrics?.totalTickets || 1)) * 100,
                color: theme.colors[item.color][6],
                tooltip: `${item.name}: ${item.value}`,
              }))}
              label={
                <Text ta="center" size="lg" fw={700}>
                  {metrics?.totalTickets || 0}
                </Text>
              }
            />
          </Box>
          <Stack gap="xs" mt="md">
            {ticketStatusData.map((item) => (
              <Group key={item.name} justify="space-between">
                <Group gap="xs">
                  <Box
                    w={12}
                    h={12}
                    style={{
                      backgroundColor: theme.colors[item.color][6],
                      borderRadius: '50%',
                    }}
                  />
                  <Text size="sm">{item.name}</Text>
                </Group>
                <Text size="sm" fw={500}>
                  {item.value}
                </Text>
              </Group>
            ))}
          </Stack>
        </Card>

        {/* Priority Distribution */}
        <Card p="md" withBorder>
          <Text fw={600} size="lg" mb="md">
            Priority Distribution
          </Text>
          <Box style={{ height: 300 }}>
            <RingProgress
              size={200}
              thickness={16}
              sections={priorityData.map(item => ({
                value: (item.value / (metrics?.totalTickets || 1)) * 100,
                color: theme.colors[item.color][6],
                tooltip: `${item.name}: ${item.value}`,
              }))}
              label={
                <Text ta="center" size="lg" fw={700}>
                  {metrics?.totalTickets || 0}
                </Text>
              }
            />
          </Box>
          <Stack gap="xs" mt="md">
            {priorityData.map((item) => (
              <Group key={item.name} justify="space-between">
                <Group gap="xs">
                  <Box
                    w={12}
                    h={12}
                    style={{
                      backgroundColor: theme.colors[item.color][6],
                      borderRadius: '50%',
                    }}
                  />
                  <Text size="sm">{item.name}</Text>
                </Group>
                <Text size="sm" fw={500}>
                  {item.value}
                </Text>
              </Group>
            ))}
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Team Performance */}
      <Card p="md" withBorder>
        <Text fw={600} size="lg" mb="md">
          Team Performance
        </Text>
        
        <Stack gap="md">
          {users?.slice(0, 5).map((user) => (
            <Paper key={user.id} p="md" withBorder>
              <Group justify="space-between" align="center">
                <Group gap="md">
                  <Box
                    w={40}
                    h={40}
                    style={{
                      backgroundColor: theme.colors.blue[6],
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  >
                    {user.name?.charAt(0) || 'U'}
                  </Box>
                  <Box>
                    <Text fw={500} size="sm">
                      {user.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {user.email}
                    </Text>
                  </Box>
                </Group>
                
                <Group gap="lg">
                  <Box ta="center">
                    <Text fw={600} size="lg">
                      {Math.floor(Math.random() * 20) + 10}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Tickets
                    </Text>
                  </Box>
                  <Box ta="center">
                    <Text fw={600} size="lg">
                      {Math.floor(Math.random() * 100) + 70}%
                    </Text>
                    <Text size="xs" c="dimmed">
                      Completion
                    </Text>
                  </Box>
                  <Box ta="center">
                    <Text fw={600} size="lg">
                      {Math.floor(Math.random() * 5) + 2}d
                    </Text>
                    <Text size="xs" c="dimmed">
                      Avg. Time
                    </Text>
                  </Box>
                </Group>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Card>

      {/* Recent Activity */}
      <Card p="md" withBorder mt="lg">
        <Text fw={600} size="lg" mb="md">
          Recent Activity
        </Text>
        
        <Stack gap="sm">
          {[
            { action: 'Ticket completed', user: 'John Doe', time: '2 hours ago', type: 'success' },
            { action: 'New ticket created', user: 'Jane Smith', time: '4 hours ago', type: 'info' },
            { action: 'Comment added', user: 'Mike Johnson', time: '6 hours ago', type: 'info' },
            { action: 'Priority changed', user: 'Sarah Wilson', time: '1 day ago', type: 'warning' },
            { action: 'Assignee updated', user: 'Tom Brown', time: '2 days ago', type: 'info' },
          ].map((activity, index) => (
            <Group key={index} justify="space-between" align="center">
              <Group gap="sm">
                <Box
                  w={8}
                  h={8}
                  style={{
                    backgroundColor: theme.colors[activity.type][6],
                    borderRadius: '50%',
                  }}
                />
                <Text size="sm">
                  <Text component="span" fw={500}>
                    {activity.user}
                  </Text>
                  {' '}{activity.action}
                </Text>
              </Group>
              <Text size="xs" c="dimmed">
                {activity.time}
              </Text>
            </Group>
          ))}
        </Stack>
      </Card>
    </Container>
  );
} 