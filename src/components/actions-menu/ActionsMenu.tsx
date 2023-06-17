import { motion, AnimatePresence } from "framer-motion";
import { useActionsMenu } from "@/hooks/useActionsMenu";

export default function ActionsMenu({ selected }: any) {
  const { xPos, yPos, showMenu } = useActionsMenu();

  const handleAction = (action: string) => {
    console.log({ action, selected });
  };

  const ActionMenuPanel = () => (
    <div className="flex flex-col gap-1 bg-white text-black p-2 rounded-lg bg-opacity-80 text-xs">
      <div
        className="hover:bg-blue-500"
        onClick={() => handleAction("new-folder")}
      >
        <span>New folder</span>
      </div>
      <div
        className="hover:bg-blue-500"
        onClick={() => handleAction("new-file")}
      >
        <span>New file</span>
      </div>
      <div className="hover:bg-red-300" onClick={() => handleAction("delete")}>
        <span>Delete</span>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {showMenu && (
        <motion.div
          style={{
            position: "absolute",
            top: yPos,
            left: xPos,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ActionMenuPanel />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
