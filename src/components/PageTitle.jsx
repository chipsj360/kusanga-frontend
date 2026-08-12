// src/components/PageTitle.jsx
import { useEffect } from "react";

export default function PageTitle({ title }) {
  useEffect(() => {
    document.title = title
      ? `${title} | Kusanga`
      : "Kusanga";
  }, [title]);

  return null;
}