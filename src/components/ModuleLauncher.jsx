import { useEffect } from "react";
import API from "../api";

const ModuleLauncher = ({ url, onClose }) => {
  useEffect(() => {
    if (url) {
      window.open(
        url,
        "_blank",
        "noopener,noreferrer,width=1200,height=800"
      );
    }
    onClose(); // close modal automatically
  }, []);

  return <p className="text-muted">Opening module in a new window...</p>;
};

export default ModuleLauncher;
