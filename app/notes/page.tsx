import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
interface NotesProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function Notes({ searchParams }: NotesProps) {
  const params = await searchParams;
  const search = params.search || "";
  const page = Number(params.page) || 1;
  const perPage = 12;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", search, page, perPage],
    queryFn: () => fetchNotes(search, page, perPage),
    retry: false,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}
