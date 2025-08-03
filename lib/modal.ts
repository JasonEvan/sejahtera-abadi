import { useModalStore } from "@/hooks/useModalStore";

const { open, close } = useModalStore.getState();

export const modals = {
  open,
  close,
};
