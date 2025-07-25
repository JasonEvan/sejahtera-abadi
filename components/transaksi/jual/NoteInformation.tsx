import { useJualStore } from "@/hooks/useJualStore";
import { Box } from "@mui/material";
import NoteForm from "./NoteForm";
import NoteTable from "./NoteTable";
import NoteSummary from "./NoteSummary";

export default function NoteInformation() {
  const { clientInformationDone } = useJualStore();
  return (
    <Box
      sx={{ marginTop: 2, display: clientInformationDone ? "block" : "none" }}
    >
      <NoteForm />
      <NoteTable />
      <NoteSummary />
    </Box>
  );
}
