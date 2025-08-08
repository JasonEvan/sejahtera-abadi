import { useEditJualStore } from "@/hooks/edit/useEditTransaksiStore";
import ListHistory from "./ListHistory";

/**
 * JualHistoryContainer component must subscribe to the edit jual store
 * to trigger re-rendering when the history changes.
 * @returns Component to display the history of transactions
 */
export default function JualHistoryContainer() {
  const { history, fetchHistory } = useEditJualStore();

  return <ListHistory history={history} fetchHistory={fetchHistory} />;
}
