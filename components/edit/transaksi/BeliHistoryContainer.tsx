import ListHistory from "./ListHistory";
import { useEditBeliStore } from "@/hooks/edit/useEditBeliStore";

/**
 * BeliHistoryContainer component must subscribe to the edit beli store
 * to trigger re-rendering when the history changes.
 * @returns Component to display the history of transactions
 */
export default function BeliHistoryContainer() {
  const { history, fetchHistory } = useEditBeliStore();

  return <ListHistory history={history} fetchHistory={fetchHistory} />;
}
