"use client";

import { useEffect, useState, useCallback } from "react";
import { getAllEvents } from "./events";
import type { EventData } from "./eventsData";

export function usePublicEvents() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat event");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { events, loading, error, reload: load };
}
