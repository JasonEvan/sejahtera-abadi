"use client";

import { useModalStore } from "@/hooks/useModalStore";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function ModalProvider() {
  const { isOpen, props, close } = useModalStore();

  if (!props) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      scroll="paper"
      fullWidth
      maxWidth={props.size}
    >
      <DialogTitle id="scroll-dialog-title">{props.title}</DialogTitle>
      <DialogContent dividers>
        {props.text &&
          (typeof props.text === "string" ? (
            <DialogContentText tabIndex={-1}>{props.text}</DialogContentText>
          ) : (
            props.text.map((text, index) => (
              <DialogContentText tabIndex={-1} key={index}>
                {text}
              </DialogContentText>
            ))
          ))}
        {props.children}
      </DialogContent>
      {props.type === "text" && (
        <DialogActions>
          <Button onClick={close}>OK</Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
