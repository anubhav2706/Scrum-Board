'use client';

import { Button, Card, Text, Group, Container } from '@mantine/core';

export default function TestPage() {
  return (
    <Container size="md" py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text size="xl" fw={700} mb="md">
          CSS Test Page
        </Text>
        <Text mb="md">
          This page tests if Mantine and Tailwind CSS are working properly.
        </Text>
        <Group>
          <Button color="blue">Mantine Button</Button>
          <Button color="red" variant="light">Light Button</Button>
          <div className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Tailwind Button
          </div>
        </Group>
      </Card>
    </Container>
  );
} 