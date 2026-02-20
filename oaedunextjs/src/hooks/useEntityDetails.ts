import { useState } from "react";

export interface EntityService<T> {
  getById: (id: number) => Promise<T>;
}

export function useEntityDetails<T = Record<string, unknown>>(): {
  modalOpen: boolean;
  modalTitle: string;
  modalData: T | { error: string } | null;
  loading: boolean;
  showDetails: (
    title: string,
    service: EntityService<T>,
    id: number
  ) => Promise<void>;
  close: () => void;
} {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState<T | { error: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const showDetails = async (
    title: string,
    service: EntityService<T>,
    id: number
  ) => {
    setModalTitle(title);
    setModalOpen(true);
    setLoading(true);
    try {
      const data = await service.getById(id);
      setModalData(data);
    } catch {
      setModalData({ error: "Не вдалося отримати дані" });
    } finally {
      setLoading(false);
    }
  };

  const close = () => setModalOpen(false);

  return { modalOpen, modalTitle, modalData, loading, showDetails, close };
}
