import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import { NoteTag } from "@/types/note";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
interface NotesProps {
  searchParams: Promise<{ search?: string; page?: string }>;
  params: Promise<{ slug?: string[]}>;
}

export default async function Notes({ searchParams, params }: NotesProps) {
  const query = await searchParams;
  const search = query.search || "";
  const page = Number(query.page) || 1;
  const perPage = 12;
   const {slug}= await params;
  const currentSlug = slug && slug.length > 0 ? slug[0] : 'all'; 
   
  const tag = currentSlug === 'all' ? undefined : (currentSlug as NoteTag);
 
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", search, page, perPage, tag],
    queryFn: () => fetchNotes(search, page, perPage, tag),
    retry: false,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag}/>
    </HydrationBoundary>
  );
}
