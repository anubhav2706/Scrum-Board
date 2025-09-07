"use client";

import { useAuthCheck } from "@/hooks/useAuthCheck";
import { Center, Stack, Text, Button } from "@mantine/core";

interface UnauthorizedProps {
  onSignIn?: () => void; // optional, since we’ll use hook’s signIn
}

export default function Unauthorized({ onSignIn }: UnauthorizedProps) {
  const { signInWithGoogle } = useAuthCheck(); // ✅ inside component

  return (
    <Center h="100vh">
      <Stack align="center" gap="md">
        <Text size="lg">Sign in to continue</Text>
        <Button onClick={onSignIn ?? signInWithGoogle} size="md" variant="filled">
          Sign in with Google
        </Button>
      </Stack>
    </Center>
  );
}