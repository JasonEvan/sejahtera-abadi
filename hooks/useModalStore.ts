import { create } from "zustand";

interface ModalProps {
  title: string;
  text?: string | string[];
  size: "sm" | "md" | "lg";
  type: "text" | "form";
  children: React.ReactNode;
}

interface ModalStore {
  isOpen: boolean;
  props: ModalProps | null;
  open: (props: ModalProps) => void;
  close: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  props: null,

  open: (props) => set({ isOpen: true, props }),

  close: () => set({ isOpen: false, props: null }),
}));
