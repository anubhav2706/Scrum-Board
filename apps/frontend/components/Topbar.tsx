'use client';

import { 
  Group, 
  Text, 
  ActionIcon, 
  Avatar, 
  Menu, 
  TextInput, 
  Breadcrumbs,
  Anchor,
  useMantineTheme,
  useMantineColorScheme,
  Tooltip,
  Badge,
  Button,
  Box,
  Divider,
  UnstyledButton,
  Stack,
  Collapse
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  Bell, 
  Search, 
  LogOut, 
  User, 
  Settings,
  ChevronRight,
  Plus,
  Filter,
  Grid3X3,
  List,
  MoreHorizontal,
  HelpCircle,
  Menu as MenuIcon,
  X,
  Zap,
  TrendingUp,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  useNotifications, 
  useUnreadNotificationCount, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead 
} from '../hooks/useNotifications';
import { showNotification } from '@mantine/notifications';
import SearchModal from './SearchModal';
import UserProfileModal from './UserProfileModal';
import InviteTeamModal from './InviteTeamModal';
import { useAuthCheck } from '@/hooks/useAuthCheck';

export default function Topbar() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { user, signOutUser } = useAuth();  
  const { status, signInWithGoogle, signOut } = useAuthCheck();
  const router = useRouter();
  const pathname = usePathname();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchExpanded, { toggle: toggleSearch }] = useDisclosure(false);
  
  // Modal states
  const [searchModalOpened, { open: openSearchModal, close: closeSearchModal }] = useDisclosure(false);
  const [profileModalOpened, { open: openProfileModal, close: closeProfileModal }] = useDisclosure(false);
  const [inviteTeamModalOpened, { open: openInviteTeamModal, close: closeInviteTeamModal }] = useDisclosure(false);
  
  // Notifications
  const { data: notifications = [] } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

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
    if (typeof user === 'object' && 'email' in user && user.email) return user.email;
    return 'guest@example.com';
  };

  const getUserAvatar = () => {
    if (!user || typeof user !== 'object') return null;
    return 'photoURL' in user ? user.photoURL : null;
  };

  const getBreadcrumbItems = () => {
    const items = [];
    
    if (pathname === '/') {
      items.push({ title: 'Dashboard', href: '/' });
    } else if (pathname === '/projects') {
      items.push({ title: 'Projects', href: '/projects' });
    } else if (pathname === '/board') {
      items.push({ title: 'Board', href: '/board' });
    } else if (pathname === '/calendar') {
      items.push({ title: 'Calendar', href: '/calendar' });
    } else if (pathname === '/analytics') {
      items.push({ title: 'Analytics', href: '/analytics' });
    } else if (pathname.startsWith('/projects/')) {
      items.push({ title: 'Projects', href: '/projects' });
      items.push({ title: 'Project Details', href: pathname });
    }
    
    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      openSearchModal();
    }
  };

  const handleViewModeToggle = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
    // TODO: Implement view mode change logic
    console.log('View mode changed to:', viewMode === 'grid' ? 'list' : 'grid');
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      await markAsRead.mutateAsync(notification.id);
    }
    // TODO: Navigate to notification action URL
    console.log('Notification clicked:', notification);
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead.mutateAsync();
      showNotification({
        title: 'Notifications marked as read',
        message: 'All notifications have been marked as read.',
        color: 'green',
      });
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to mark notifications as read.',
        color: 'red',
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
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

  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <>
      <Box
        style={{
          height: '100%',
          borderBottom: `1px solid var(--mantine-color-gray-200)`,
          padding: `0 ${theme.spacing.md}`,
        }}
      >
        <Group justify="space-between" align="center" h="100%" gap="md">
          {/* Left Section - Mobile Menu & Breadcrumbs */}
          <Group gap="lg" style={{ flex: 1 }}>
            {/* Mobile Menu Button */}
            <Box className="md:hidden">
              <ActionIcon
                variant="subtle"
                size="md"
                color="gray"
              >
                <MenuIcon size={18} />
              </ActionIcon>
            </Box>

            {/* Breadcrumbs */}
            <Box className="hidden sm:block">
              <Breadcrumbs
                separator={<ChevronRight size={14} />}
                separatorMargin="md"
                mt="xs"
              >
                {breadcrumbItems.map((item, index) => (
                  <Anchor
                    key={index}
                    onClick={() => router.push(item.href)}
                    size="sm"
                    c={index === breadcrumbItems.length - 1 ? 'var(--mantine-text-heading)' : 'var(--mantine-text-subheading)'}
                    fw={index === breadcrumbItems.length - 1 ? 600 : 400}
                    style={{
                      textDecoration: 'none',
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {item.title}
                  </Anchor>
                ))}
              </Breadcrumbs>
            </Box>
          </Group>

          {/* Center Section - Search Bar */}
          <Box style={{ flex: 1, maxWidth: 500 }} className="hidden md:block">
            <Group gap="xs">
              <TextInput
                placeholder="Search projects, tickets, or people..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                leftSection={<Search size={16} />}
                size="sm"
                style={{ flex: 1 }}
                styles={{
                  input: {
                    borderRadius: theme.radius.lg,
                    border: '1px solid var(--mantine-color-gray-300)',
                    transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:focus': {
                      borderColor: 'var(--mantine-color-blue-500)',
                      boxShadow: '0 0 0 3px rgb(59 130 246 / 0.1)',
                    },
                  },
                }}
              />
              <Collapse in={searchExpanded}>
                <Group gap="xs">
                  <Button
                    variant="light"
                    size="sm"
                    leftSection={<Filter size={14} />}
                    style={{
                      borderRadius: theme.radius.lg,
                      fontWeight: 500,
                    }}
                  >
                    Filters
                  </Button>
                </Group>
              </Collapse>
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={toggleSearch}
                color="gray"
              >
                {searchExpanded ? <X size={16} /> : <Filter size={16} />}
              </ActionIcon>
            </Group>
          </Box>

          {/* Right Section - Actions & User Menu */}
          <Group gap="sm" className="hidden lg:flex">
            {/* View Mode Toggle */}
            <Group gap={4} style={{ border: '1px solid var(--mantine-color-gray-200)', borderRadius: theme.radius.lg }}>
              <ActionIcon
                variant={viewMode === 'grid' ? 'light' : 'subtle'}
                size="sm"
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'blue' : 'gray'}
                style={{ borderRadius: 0 }}
              >
                <Grid3X3 size={16} />
              </ActionIcon>
              <ActionIcon
                variant={viewMode === 'list' ? 'light' : 'subtle'}
                size="sm"
                onClick={() => setViewMode('list')}
                color={viewMode === 'list' ? 'blue' : 'gray'}
                style={{ borderRadius: 0 }}
              >
                <List size={16} />
              </ActionIcon>
            </Group>

            {/* Create Button */}
            <Button
              leftSection={<Plus size={16} />}
              size="sm"
              onClick={openInviteTeamModal}
              style={{
                borderRadius: theme.radius.lg,
                fontWeight: 500,
              }}
            >
              Create
            </Button>
          </Group>

          {/* Notifications */}
          <Menu shadow="md" width={320} position="bottom-end">
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                size="md"
                color="gray"
                style={{ position: 'relative' }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <Badge
                    size="xs"
                    variant="filled"
                    color="red"
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      minWidth: 18,
                      height: 18,
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  >
                    {unreadCount}
                  </Badge>
                )}
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Box p="md">
                <Group justify="space-between" align="center" mb="md">
                  <Text fw={600} size="sm">Notifications</Text>
                  {unreadCount > 0 && (
                    <Button variant="subtle" size="xs" color="blue" onClick={handleMarkAllRead}>
                      Mark all read
                    </Button>
                  )}
                </Group>
                
                <Stack gap="xs">
                  {notifications.length === 0 ? (
                    <Text c="dimmed" ta="center" py="md">
                      No notifications
                    </Text>
                  ) : (
                    notifications.map((notification) => (
                      <Box
                        key={notification.id}
                        p="sm"
                        style={{
                          borderRadius: theme.radius.md,
                          background: !notification.read ? 'var(--mantine-color-blue-50)' : 'transparent',
                          border: !notification.read ? '1px solid var(--mantine-color-blue-200)' : 'none',
                          cursor: 'pointer',
                          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            background: 'var(--mantine-color-gray-50)',
                          },
                        }}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <Text size="sm" fw={!notification.read ? 600 : 400} lineClamp={2}>
                          {notification.title}
                        </Text>
                        {notification.message && (
                          <Text size="xs" c="dimmed" mt={2} lineClamp={1}>
                            {notification.message}
                          </Text>
                        )}
                        <Text size="xs" c="var(--mantine-text-subheading)" mt={4}>
                          {formatNotificationTime(notification.createdAt)}
                        </Text>
                      </Box>
                    ))
                  )}
                </Stack>
                
                <Button variant="light" size="sm" fullWidth mt="md">
                  View all notifications
                </Button>
              </Box>
            </Menu.Dropdown>
          </Menu>

          {/* Help Icon */}
          <Tooltip label="Help & Support">
            <ActionIcon
              variant="subtle"
              size="md"
              color="gray"
            >
              <HelpCircle size={18} />
            </ActionIcon>
          </Tooltip>

          {/* User Menu */}
          <Menu shadow="md" width={280} position="bottom-end">
            <Menu.Target>
              <Group gap="sm" style={{ cursor: 'pointer' }}>
                <Avatar
                  src={getUserAvatar()}
                  size="md"
                  radius="xl"
                  color="blue"
                >
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </Avatar>
                <Box className="hidden sm:block">
                  <Text size="sm" fw={500} lineClamp={1}>
                    {getUserDisplayName()}
                  </Text>
                  <Text size="xs" c="var(--mantine-text-subheading)" lineClamp={1}>
                    {getUserEmail()}
                  </Text>
                </Box>
              </Group>
            </Menu.Target>

            <Menu.Dropdown>
              <Box p="md">
                <Group gap="md" mb="md">
                  <Avatar
                    src={getUserAvatar()}
                    size="lg"
                    radius="xl"
                    color="blue"
                  >
                    {getUserDisplayName().charAt(0).toUpperCase()}
                  </Avatar>
                  <Box style={{ flex: 1 }}>
                    <Text fw={600} size="sm" lineClamp={1}>
                      {getUserDisplayName()}
                    </Text>
                    <Text size="xs" c="var(--mantine-text-subheading)" lineClamp={1}>
                      {getUserEmail()}
                    </Text>
                    <Badge size="xs" variant="light" color="green" mt={4}>
                      Online
                    </Badge>
                  </Box>
                </Group>
                
                <Divider mb="md" />
                
                <Stack gap={4}>
                  <Menu.Item
                    leftSection={<User size={16} />}
                    onClick={openProfileModal}
                    style={{
                      borderRadius: theme.radius.md,
                      margin: '2px 0',
                    }}
                  >
                    Profile Settings
                  </Menu.Item>
                  
                  <Menu.Item
                    leftSection={<Settings size={16} />}
                    style={{
                      borderRadius: theme.radius.md,
                      margin: '2px 0',
                    }}
                  >
                    Account Settings
                  </Menu.Item>
                  
                  <Menu.Item
                    leftSection={<LogOut size={16} />}
                    color="red"
                    onClick={handleSignOut}
                    style={{
                      borderRadius: theme.radius.md,
                      margin: '2px 0',
                    }}
                  >
                    Sign Out
                  </Menu.Item>
                </Stack>
              </Box>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Box>

      {/* Modals */}
      <SearchModal opened={searchModalOpened} onClose={closeSearchModal} />
      <UserProfileModal opened={profileModalOpened} onClose={closeProfileModal} />
      <InviteTeamModal opened={inviteTeamModalOpened} onClose={closeInviteTeamModal} />
    </>
  );
}
