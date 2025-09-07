import { useAuthCheck } from "../hooks/useAuthCheck";
import { Button, Center, Loader, Stack, Text } from "@mantine/core";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { status, signInWithGoogle, signOut } = useAuthCheck();

  if (status === "loading") {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Center h="100vh">
        <Stack align="center">
          <Text size="lg" mb="md">Sign in to continue</Text>
          <Button onClick={signInWithGoogle} size="md" variant="filled">
            Sign in with Google
          </Button>
        </Stack>
      </Center>
    );
  }

  // Authenticated
  return <>
    {/* <Button onClick={signOut} size="xs" variant="light" style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>Sign out</Button> */}
    {children}
  </>;
} 