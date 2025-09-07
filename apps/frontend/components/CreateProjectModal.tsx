"use client";
import { Modal, Button } from "@mantine/core";

export default function CreateProjectModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Modal
      opened={open}
      onClose={() => onOpenChange(false)}
      title="Create Project"
      centered
    >
      {/* Add your form here */}
      <Button fullWidth mt="md" onClick={() => onOpenChange(false)}>
        Close
      </Button>
    </Modal>
  );
}
