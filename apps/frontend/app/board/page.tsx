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
  Avatar,
  AvatarGroup,
  useMantineTheme,
  useMantineColorScheme,
  Box,
  Divider,
  Paper,
  SimpleGrid,
  Flex,
  rem,
  ScrollArea,
  Menu,
  Tooltip,
  Modal,
  TextInput,
  Textarea,
  Select,
  MultiSelect
} from '@mantine/core';
import { 
  Plus, 
  MoreHorizontal,
  MessageSquare,
  Calendar,
  User,
  Clock,
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
import { useCreateTicket } from '../../hooks/useCreateTicket';
import { useUpdateTicket } from '../../hooks/useUpdateTicket';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useTickets } from '../../hooks/useTickets';
import LoadingSpinner from '../../components/LoadingSpinner';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { TicketPriority, TicketStatus } from 'types';
import { useUsers } from '../../hooks/useUsers';

export default function BoardPage() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  // Fetch projects
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useProjects();
  // Select the first project for now (TODO: add project selection)
  const currentProject = projects && projects.length > 0 ? projects[0] : null;
  const projectId = currentProject?.id;

  // Fetch tickets for the selected project
  const { data: tickets, isLoading: ticketsLoading, error: ticketsError } = useTickets(projectId);
  const { data: users, isLoading: usersLoading } = useUsers();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createStatus, setCreateStatus] = useState('todo');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketPriority, setTicketPriority] = useState('medium');
  const createTicket = useCreateTicket(projectId);
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);

  const updateTicket = useUpdateTicket();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('medium');
  const [editStatus, setEditStatus] = useState('todo');

  const sensors = useSensors(useSensor(PointerSensor));
  const [activeTicket, setActiveTicket] = useState(null);

  const handleOpenCreate = (status) => {
    setCreateStatus(status);
    setCreateModalOpen(true);
    setAssigneeIds([]);
  };
  const handleCloseCreate = () => {
    setCreateModalOpen(false);
    setTicketTitle('');
    setTicketDescription('');
    setTicketPriority('medium');
    setAssigneeIds([]);
  };
  const handleCreateTicket = async () => {
    if (!ticketTitle) return;
    try {
      await createTicket.mutateAsync({
        title: ticketTitle,
        description: ticketDescription,
        projectId,
        status: createStatus as TicketStatus,
        priority: ticketPriority as TicketPriority,
        assigneeIds,
      });
      showNotification({ title: 'Ticket created', message: 'Your ticket was created successfully.', color: 'green' });
      handleCloseCreate();
    } catch (err) {
      showNotification({ title: 'Error', message: 'Failed to create ticket.', color: 'red' });
    }
  };

  const handleOpenEdit = (ticket) => {
    setEditingTicket(ticket);
    setEditTitle(ticket.title);
    setEditDescription(ticket.description);
    setEditPriority(ticket.priority);
    setEditStatus(ticket.status);
    setEditModalOpen(true);
  };
  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setEditingTicket(null);
    setEditTitle('');
    setEditDescription('');
    setEditPriority('medium');
    setEditStatus('todo');
  };
  const handleUpdateTicket = async () => {
    if (!editingTicket) return;
    try {
      await updateTicket.mutateAsync({
        id: editingTicket.id,
        title: editTitle,
        description: editDescription,
        priority: editPriority as TicketPriority,
        status: editStatus as TicketStatus,
      });
      showNotification({ title: 'Ticket updated', message: 'Your ticket was updated successfully.', color: 'green' });
      handleCloseEdit();
    } catch (err) {
      showNotification({ title: 'Error', message: 'Failed to update ticket.', color: 'red' });
    }
  };

  // Drag handlers
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveTicket(tickets?.find(t => t.id === active.id) || null);
  };
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTicket(null);
    if (!over || !active || active.id === over.id) return;
    const ticket = tickets?.find(t => t.id === active.id);
    if (!ticket || ticket.status === over.id) return;
    try {
      await updateTicket.mutateAsync({ id: ticket.id, status: over.id });
      showNotification({ title: 'Ticket updated', message: 'Ticket moved to ' + over.id, color: 'green' });
    } catch (err) {
      showNotification({ title: 'Error', message: 'Failed to move ticket.', color: 'red' });
    }
  };

  // Define columns based on backend statuses
  const columns = [
    { id: 'todo', title: 'To Do', color: 'gray' },
    { id: 'in-progress', title: 'In Progress', color: 'blue' },
    { id: 'done', title: 'Done', color: 'green' },
  ];

  // Group tickets by status
  const getColumnTickets = (columnId: string) => {
    if (!tickets) return [];
    return tickets.filter(ticket => ticket.status === columnId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `${diffDays} days`;
    return date.toLocaleDateString();
  };

  const getDateColor = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'red';
    if (diffDays <= 3) return 'yellow';
    return 'green';
  };

  // Loading and error states
  if (projectsLoading || ticketsLoading) {
    return (
      <Container size="xl" py="xl">
        <LoadingSpinner message="Loading board..." />
      </Container>
    );
  }
  if (projectsError || ticketsError) {
    return (
      <Container size="xl" py="xl">
        <Text c="red">Error loading board data.</Text>
      </Container>
    );
  }
  if (!currentProject) {
    return (
      <Container size="xl" py="xl">
        <Text>No projects found. Create a project to get started.</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <Box className="fade-in" mb="xl">
        <Group justify="space-between" align="center" mb="lg">
          <Box>
            <Text size="2xl" fw={700} c="var(--mantine-text-heading)" mb="xs">
              Kanban Board
            </Text>
            <Text size="md" c="var(--mantine-text-subheading)">
              Manage your project tasks and track progress
            </Text>
          </Box>
          
          <Group gap="sm">
            <Button
              variant="light"
              size="sm"
              leftSection={<Filter size={16} />}
              style={{
                borderRadius: theme.radius.lg,
                fontWeight: 500,
              }}
            >
              Filter
            </Button>
            <Button
              leftSection={<Plus size={16} />}
              size="sm"
              style={{
                borderRadius: theme.radius.lg,
                fontWeight: 500,
              }}
            >
              New Ticket
            </Button>
          </Group>
        </Group>
      </Box>

      {/* Mobile Empty State */}
      <Box className="lg:hidden fade-in" mb="xl">
        <Card p="xl" radius="xl" withBorder>
          <Stack align="center" gap="md">
            <Box
              style={{
                width: 64,
                height: 64,
                borderRadius: theme.radius.xl,
                background: 'var(--mantine-color-blue-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--mantine-color-blue-6)',
              }}
            >
              <GitBranch size={32} />
            </Box>
            <Text size="lg" fw={600} ta="center">
              Switch to Desktop View
            </Text>
            <Text size="sm" c="var(--mantine-text-subheading)" ta="center">
              The Kanban board is optimized for larger screens. Please switch to desktop view for the best experience.
            </Text>
          </Stack>
        </Card>
      </Box>

      {/* Desktop Kanban Board */}
      <Box className="hidden lg:block">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <Grid gutter="lg">
            {columns.map((column) => (
              <Grid.Col key={column.id} span={3}>
                <Card className="fade-in" p="md" radius="xl" withBorder>
                  {/* Column Header */}
                  <Group justify="space-between" align="center" mb="lg">
                    <Group gap="sm">
                      <Box
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: `var(--mantine-color-${column.color}-6)`,
                        }}
                      />
                      <Text fw={600} size="sm" c="var(--mantine-text-heading)">
                        {column.title}
                      </Text>
                    </Group>
                    <Badge
                      size="sm"
                      variant="light"
                      color={column.color}
                      style={{ fontWeight: 600 }}
                    >
                      {getColumnTickets(column.id).length}
                    </Badge>
                  </Group>

                  {/* Tickets */}
                  <ScrollArea h={600} scrollbarSize={6}>
                    <Stack gap="md">
                      {getColumnTickets(column.id).map((ticket) => (
                        <Card
                          key={ticket.id}
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
                          {/* Ticket Header */}
                          <Group justify="space-between" align="flex-start" mb="sm">
                            <Box style={{ flex: 1 }}>
                              <Text fw={600} size="sm" lineClamp={2} mb="xs">
                                {ticket.title}
                              </Text>
                              <Group gap="xs" mb="sm">
                                <Badge
                                  size="xs"
                                  variant="light"
                                  color={getPriorityColor(ticket.priority)}
                                >
                                  {ticket.priority}
                                </Badge>
                              </Group>
                            </Box>
                            <Menu shadow="md" width={200} position="bottom-end">
                              <Menu.Target>
                                <ActionIcon
                                  variant="subtle"
                                  size="sm"
                                  color="gray"
                                >
                                  <MoreHorizontal size={14} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item leftSection={<Edit size={14} />} onClick={() => handleOpenEdit(ticket)}>
                                  Edit Ticket
                                </Menu.Item>
                                <Menu.Item leftSection={<Copy size={14} />}>
                                  Duplicate
                                </Menu.Item>
                                <Menu.Item leftSection={<Share size={14} />}>
                                  Share
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item leftSection={<Archive size={14} />} color="orange">
                                  Archive
                                </Menu.Item>
                                <Menu.Item leftSection={<Trash2 size={14} />} color="red">
                                  Delete
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Group>

                          {/* Ticket Description */}
                          <Text size="xs" c="var(--mantine-text-subheading)" lineClamp={2} mb="md">
                            {ticket.description}
                          </Text>

                          {/* Tags */}
                          <Group gap="xs" mb="md">
                            {ticket.tags.map((tag) => (
                              <Badge
                                key={tag}
                                size="xs"
                                variant="light"
                                color="gray"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </Group>

                          {/* Ticket Footer */}
                          <Group justify="space-between" align="center">
                            <Group gap="sm">
                              <Avatar
                                size="sm"
                                radius="xl"
                                color="blue"
                              >
                                {ticket.assignees && ticket.assignees.length > 0 ? ticket.assignees[0].name.charAt(0) : '?'}
                              </Avatar>
                              <Box>
                                <Text size="xs" fw={500} lineClamp={1}>
                                  {ticket.assignees && ticket.assignees.length > 0 ? ticket.assignees[0].name : 'Unassigned'}
                                </Text>
                              </Box>
                            </Group>
                            
                            <Group gap="sm">
                              <Group gap="xs">
                                <Calendar size={12} color="var(--mantine-color-gray-5)" />
                                <Text
                                  size="xs"
                                  c={`var(--mantine-color-${getDateColor(ticket.dueDate)}-6)`}
                                  fw={500}
                                >
                                  {formatDate(ticket.dueDate)}
                                </Text>
                              </Group>
                            </Group>
                          </Group>
                        </Card>
                      ))}

                      {/* Add Ticket Button */}
                      <Button
                        variant="light"
                        size="sm"
                        leftSection={<Plus size={14} />}
                        fullWidth
                        style={{
                          borderRadius: theme.radius.lg,
                          fontWeight: 500,
                          border: '2px dashed var(--mantine-color-gray-300)',
                          background: 'transparent',
                          color: 'var(--mantine-text-subheading)',
                          '&:hover': {
                            background: 'var(--mantine-color-gray-50)',
                            borderColor: 'var(--mantine-color-gray-400)',
                          },
                        }}
                        onClick={() => handleOpenCreate(column.id)}
                      >
                        Add Ticket
                      </Button>
                    </Stack>
                  </ScrollArea>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
          <DragOverlay>
            {activeTicket ? (
              <Card
                p="md"
                radius="lg"
                withBorder
                style={{
                  border: '1px solid var(--mantine-color-gray-300)',
                  boxShadow: 'var(--mantine-shadow-lg)',
                  background: 'var(--mantine-color-white)',
                  zIndex: 1000,
                }}
              >
                <Group justify="space-between" align="flex-start" mb="sm">
                  <Box style={{ flex: 1 }}>
                    <Text fw={600} size="sm" lineClamp={2} mb="xs">
                      {activeTicket.title}
                    </Text>
                    <Group gap="xs" mb="sm">
                      <Badge
                        size="xs"
                        variant="light"
                        color={getPriorityColor(activeTicket.priority)}
                      >
                        {activeTicket.priority}
                      </Badge>
                    </Group>
                  </Box>
                  <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        color="gray"
                      >
                        <MoreHorizontal size={14} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<Edit size={14} />} onClick={() => handleOpenEdit(activeTicket)}>
                        Edit Ticket
                      </Menu.Item>
                      <Menu.Item leftSection={<Copy size={14} />}>
                        Duplicate
                      </Menu.Item>
                      <Menu.Item leftSection={<Share size={14} />}>
                        Share
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item leftSection={<Archive size={14} />} color="orange">
                        Archive
                      </Menu.Item>
                      <Menu.Item leftSection={<Trash2 size={14} />} color="red">
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>

                {/* Ticket Description */}
                <Text size="xs" c="var(--mantine-text-subheading)" lineClamp={2} mb="md">
                  {activeTicket.description}
                </Text>

                {/* Tags */}
                <Group gap="xs" mb="md">
                  {activeTicket.tags.map((tag) => (
                    <Badge
                      key={tag}
                      size="xs"
                      variant="light"
                      color="gray"
                    >
                      {tag}
                    </Badge>
                  ))}
                </Group>

                {/* Ticket Footer */}
                <Group justify="space-between" align="center">
                  <Group gap="sm">
                    <Avatar
                      size="sm"
                      radius="xl"
                      color="blue"
                    >
                      {activeTicket.assignees && activeTicket.assignees.length > 0 ? activeTicket.assignees[0].name.charAt(0) : '?'}
                    </Avatar>
                    <Box>
                      <Text size="xs" fw={500} lineClamp={1}>
                        {activeTicket.assignees && activeTicket.assignees.length > 0 ? activeTicket.assignees[0].name : 'Unassigned'}
                      </Text>
                    </Box>
                  </Group>
                  
                  <Group gap="sm">
                    <Group gap="xs">
                      <Calendar size={12} color="var(--mantine-color-gray-5)" />
                      <Text
                        size="xs"
                        c={`var(--mantine-color-${getDateColor(activeTicket.dueDate)}-6)`}
                        fw={500}
                      >
                        {formatDate(activeTicket.dueDate)}
                      </Text>
                    </Group>
                  </Group>
                </Group>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Box>

      <Modal
        opened={createModalOpen}
        onClose={handleCloseCreate}
        title={`Create Ticket (${createStatus.replace('-', ' ')})`}
        styles={{
          title: {
            color: 'var(--mantine-text-heading)',
          },
        }}
        centered
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Title"
            placeholder="Enter ticket title"
            styles={{
              label: {
                color: 'var(--mantine-text-subheading)',
              },
            }}
            value={ticketTitle}
            onChange={e => setTicketTitle(e.target.value)}
            required
          />
          <Textarea
            label="Description"
            placeholder="Enter ticket description"
            styles={{
              label: {
                color: 'var(--mantine-text-subheading)',
              },
            }}
            value={ticketDescription}
            onChange={e => setTicketDescription(e.target.value)}
          />
          <MultiSelect
            label="Assignees"
            data={Array.isArray(users) ? users.filter(u => u && u.id && u.name).map(u => ({ value: u.id, label: u.name })) : []}
            value={assigneeIds}
            onChange={setAssigneeIds}
            placeholder="Select assignees"
            styles={{
              label: {
                color: 'var(--mantine-text-subheading)',
              },
            }}
            searchable
            disabled={usersLoading}
            nothingFoundMessage={usersLoading ? 'Loading...' : 'No users found'}
          />
          <Select
            label="Priority"
            value={ticketPriority}
            onChange={setTicketPriority}
            styles={{
              label: {
                color: 'var(--mantine-text-subheading)',
              },
            }}
            data={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'critical', label: 'Critical' },
            ]}
          />
          <Group justify="flex-end" gap="sm">
            <Button variant="light" onClick={handleCloseCreate} disabled={createTicket.isPending}>
              Cancel
            </Button>
            <Button onClick={handleCreateTicket} loading={createTicket.isPending} disabled={!ticketTitle}>
              Create Ticket
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={editModalOpen}
        onClose={handleCloseEdit}
        title="Edit Ticket"
        centered
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Title"
            placeholder="Enter ticket title"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            required
          />
          <Textarea
            label="Description"
            placeholder="Enter ticket description"
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
          />
          <Select
            label="Priority"
            value={editPriority}
            onChange={setEditPriority}
            data={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'critical', label: 'Critical' },
            ]}
          />
          <Select
            label="Status"
            value={editStatus}
            onChange={setEditStatus}
            data={[
              { value: 'todo', label: 'To Do' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'done', label: 'Done' },
            ]}
          />
          <Group justify="flex-end" gap="sm">
            <Button variant="light" onClick={handleCloseEdit} disabled={updateTicket.isPending}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTicket} loading={updateTicket.isPending} disabled={!editTitle}>
              Update Ticket
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
} 