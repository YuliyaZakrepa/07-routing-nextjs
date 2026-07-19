"use client";

import NoteList from "@/components/NoteList/NoteList";
import css from "./Notes.module.css";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import { fetchNotes } from "@/lib/api";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export default function NotesClient() {
  const perPage = 12;
  const [search, setSearch] = useState<string | "">("");
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data, isSuccess } = useQuery({
    queryKey: ["notes", search, page, perPage],
    queryFn: () => fetchNotes(search, page, perPage),
    retry: false,
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  const handleSearch = useDebouncedCallback((search: string) => {
    setSearch(search);
    setPage(1);
  }, 1000);

  return (
    <div className={css.notes}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            page={page}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </header>
      <div>
        {isSuccess && notes.length > 0 && <NoteList notes={notes} />}
        {isSuccess && notes.length === 0 && (
          <p>No notes found for your request.</p>
        )}
      </div>
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          {<NoteForm onClose={handleCloseModal} />}
        </Modal>
      )}
    </div>
  );
}
