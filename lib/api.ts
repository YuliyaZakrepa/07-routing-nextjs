import type { Note, NoteTag } from "@/types/note";

import axios from "axios";
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const API = axios.create({ baseURL: "https://notehub-public.goit.study/api" });

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
interface CreateNote {
  title: string;
  content: string;
  tag: NoteTag;
}

export async function fetchNotes(
  search: string,
  page: number,
  perPage: number,
  tag?: NoteTag,
  sortBy?: string,
): Promise<FetchNotesResponse> {
  const { data } = await API.get<FetchNotesResponse>("/notes", {
    params: { search, page, perPage, tag, sortBy},
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function fetchNoteById(id: Note["id"]): Promise<Note> {
  const { data } = await API.get<Note>(`/notes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function createNote(newNote: CreateNote): Promise<Note> {
  const { data } = await API.post<Note>("/notes", newNote, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
export async function deleteNote(noteId: Note["id"]): Promise<Note> {
  const { data } = await API.delete<Note>(`/notes/${noteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
