"use client";
import { useEffect } from "react";

export default function useResizeObserver(targetRef, callback) {
  useEffect(() => {
    const target = targetRef?.current;
    if (!target || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      if (!Array.isArray(entries) || !entries.length) return;
      callback(entries[0]);
    });

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [targetRef, callback]);
}
