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
  MultiSelect
} from '@mantine/core';
import { 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  User,
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
  Unlock
} from 'lucide-react';
import { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useTickets } from '../../hooks/useTickets';
import { useUsers } from '../../hooks/useUsers';
import LoadingSpinner from '../../components/LoadingSpinner';
import { TicketPriority, TicketStatus } from 'types';

export default function CalendarPage() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  // Fetch data
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: users, isLoading: usersLoading } = useUsers();
  
  // Select the first project for now (TODO: add project selection)
  const currentProject = projects && projects.length > 0 ? projects[0] : null;
  const projectId = currentProject?.id;
  
  const { data: tickets, isLoading: ticketsLoading } = useTickets(projectId);

  // State
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterAssignee, setFilterAssignee] = useState<string[]>([]);

  // Handle loading state
  if (projectsLoading || ticketsLoading || usersLoading) {
    return (
      <Container size="xl" py="xl">
        <LoadingSpinner message="Loading calendar..." />
      </Container>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'gray';
      case 'in-progress': return 'blue';
      case 'review': return 'yellow';
      case 'done': return 'green';
      default: return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTicketsForDate = (date: Date) => {
    if (!tickets) return [];
    
    const dateStr = date.toISOString().split('T')[0];
    return tickets.filter(ticket => {
      const ticketDate = new Date(ticket.dueDate || ticket.createdAt).toISOString().split('T')[0];
      return ticketDate === dateStr;
    });
  };

  const filteredTickets = tickets?.filter(ticket => {
    if (filterStatus && ticket.status !== filterStatus) return false;
    if (filterPriority && ticket.priority !== filterPriority) return false;
    if (filterAssignee.length > 0) {
      const ticketAssigneeIds = ticket.assignees?.map(a => a.id) || [];
      return filterAssignee.some(id => ticketAssigneeIds.includes(id));
    }
    return true;
  }) || [];

  // Simple calendar grid for demonstration
  const renderCalendarGrid = () => {
    const currentDate = selectedDate || new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return (
      <SimpleGrid cols={7} spacing="xs">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Box key={day} p="xs" ta="center" fw={600} size="sm">
            {day}
          </Box>
        ))}
        {days.map((date, index) => (
          <Box
            key={index}
            p="xs"
            h={80}
            style={{
              border: '1px solid var(--mantine-color-gray-200)',
              cursor: date ? 'pointer' : 'default',
              background: date ? 'var(--mantine-color-white)' : 'var(--mantine-color-gray-50)',
            }}
          >
            {date && (
              <>
                <Text size="sm" fw={500} mb={4}>
                  {date.getDate()}
                </Text>
                {getTicketsForDate(date).length > 0 && (
                  <Stack gap={2}>
                    {getTicketsForDate(date).slice(0, 2).map((ticket) => (
                      <Badge
                        key={ticket.id}
                        size="xs"
                        variant="light"
                        color={getPriorityColor(ticket.priority)}
                        style={{
                          fontSize: 10,
                          padding: '2px 4px',
                          cursor: 'pointer',
                        }}
                        title={ticket.title}
                      >
                        {ticket.title.substring(0, 15)}...
                      </Badge>
                    ))}
                    {getTicketsForDate(date).length > 2 && (
                      <Text size="xs" c="dimmed">
                        +{getTicketsForDate(date).length - 2} more
                      </Text>
                    )}
                  </Stack>
                )}
              </>
            )}
          </Box>
        ))}
      </SimpleGrid>
    );
  };

  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <Group justify="space-between" align="center" mb="xl">
        <Box>
          <Text fw={700} size="xl" c="var(--mantine-text-heading)">
            Calendar
          </Text>
          <Text c="var(--mantine-text-subheading)" size="sm">
            View and manage your project timeline
          </Text>
        </Box>
        
        <Group gap="sm">
          <Button
            variant="light"
            leftSection={<Filter size={16} />}
            onClick={() => {/* TODO: Open filters */}}
          >
            Filters
          </Button>
          <Button
            leftSection={<Plus size={16} />}
            onClick={() => {/* TODO: Create new ticket */}}
          >
            New Ticket
          </Button>
        </Group>
      </Group>

      {/* Filters */}
      <Card mb="lg" p="md" withBorder>
        <Group gap="md">
          <Select
            label="Status"
            placeholder="Filter by status"
            data={[
              { value: 'todo', label: 'To Do' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'review', label: 'Review' },
              { value: 'done', label: 'Done' },
            ]}
            value={filterStatus}
            onChange={setFilterStatus}
            clearable
            size="sm"
          />
          
          <Select
            label="Priority"
            placeholder="Filter by priority"
            data={[
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' },
            ]}
            value={filterPriority}
            onChange={setFilterPriority}
            clearable
            size="sm"
          />
          
          <MultiSelect
            label="Assignee"
            placeholder="Filter by assignee"
            data={users?.map(user => ({ value: user.id, label: user.name })) || []}
            value={filterAssignee}
            onChange={setFilterAssignee}
            clearable
            size="sm"
          />
        </Group>
      </Card>

      {/* Calendar View */}
      <Card p="md" withBorder>
        <Group justify="space-between" mb="md">
          <Group gap="sm">
            <Button
              variant={viewMode === 'month' ? 'filled' : 'light'}
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Month
            </Button>
            <Button
              variant={viewMode === 'week' ? 'filled' : 'light'}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              Week
            </Button>
            <Button
              variant={viewMode === 'day' ? 'filled' : 'light'}
              size="sm"
              onClick={() => setViewMode('day')}
            >
              Day
            </Button>
          </Group>
          
          <Text fw={600} size="lg">
            {selectedDate?.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </Text>
        </Group>

        {/* Calendar Component */}
        <Box>
          {renderCalendarGrid()}
        </Box>
      </Card>

      {/* Upcoming Tickets */}
      <Card mt="lg" p="md" withBorder>
        <Text fw={600} size="lg" mb="md">
          Upcoming Tickets
        </Text>
        
        <Stack gap="sm">
          {filteredTickets.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              No tickets found for the selected filters
            </Text>
          ) : (
            filteredTickets.slice(0, 10).map((ticket) => (
              <Paper
                key={ticket.id}
                p="sm"
                withBorder
                style={{
                  cursor: 'pointer',
                  transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: 'var(--mantine-shadow-md)',
                  },
                }}
              >
                <Group justify="space-between" align="flex-start">
                  <Box style={{ flex: 1 }}>
                    <Text fw={500} size="sm" lineClamp={1}>
                      {ticket.title}
                    </Text>
                    {ticket.description && (
                      <Text size="xs" c="dimmed" lineClamp={1} mt={4}>
                        {ticket.description}
                      </Text>
                    )}
                    <Group gap="xs" mt={8}>
                      <Badge size="xs" variant="light" color={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                      <Badge size="xs" variant="light" color={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      {ticket.dueDate && (
                        <Text size="xs" c="dimmed">
                          Due: {formatDate(ticket.dueDate)}
                        </Text>
                      )}
                    </Group>
                  </Box>
                  
                  <Group gap="xs">
                    {ticket.assignees && ticket.assignees.length > 0 && (
                      <Group gap={4}>
                        {ticket.assignees.slice(0, 2).map((assignee) => (
                          <Badge key={assignee.id} size="xs" variant="light">
                            {assignee.name}
                          </Badge>
                        ))}
                        {ticket.assignees.length > 2 && (
                          <Text size="xs" c="dimmed">
                            +{ticket.assignees.length - 2}
                          </Text>
                        )}
                      </Group>
                    )}
                  </Group>
                </Group>
              </Paper>
            ))
          )}
        </Stack>
      </Card>
    </Container>
  );
} 