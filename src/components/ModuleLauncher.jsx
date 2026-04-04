import { useEffect, useRef } from "react";

const ModuleLauncher = ({ url, onClose }) => {
  const openedRef = useRef(false);

  useEffect(() => {
    if (!url || openedRef.current) return;

    openedRef.current = true;

    const popup = window.open(
      url,
      "moduleLauncherWindow",
      "width=1200,height=800,noopener,noreferrer"
    );

    if (popup) {
      onClose();
    }
  }, [url, onClose]);

  return <p className="text-muted">Opening module in a new window...</p>;
};

export default ModuleLauncher;