'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Pagination from '@/components/universals/pagination/Pagination.component';

type ImagePaginationClientProps = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages?: number; // Optional: kann aus API-Metadaten kommen
  filter?: { isPublic?: boolean; tag?: string[] };
};

export default function ImagePaginationClient(props: ImagePaginationClientProps) {
  const { currentPage, pageSize, totalItems, totalPages: totalPagesProp, filter } = props;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Falls currentPage aus Props nicht korrekt ist, versuche aus URL zu lesen
  const urlPage = searchParams.get('page');
  const actualCurrentPage = urlPage ? parseInt(urlPage) : currentPage;

  // Baue URL mit aktuellen Filtern + neuer Seite
  const buildUrl = (page: number, newPageSize?: number) => {
    const params = new URLSearchParams(searchParams);

    // Seite aktualisieren
    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }

    // Page Size aktualisieren (falls geändert)
    if (newPageSize) {
      params.set('limit', newPageSize.toString());
    }

    // Filter beibehalten
    if (filter?.isPublic !== undefined) {
      params.set('isPublic', filter.isPublic.toString());
    }
    if (filter?.tag?.length) {
      params.set('tag', filter.tag.join(','));
    }

    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    router.push(buildUrl(page));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    // Bei Page Size Wechsel: zur Seite 1 zurück
    router.push(buildUrl(1, newPageSize));
  };

  // Berechne totalPages: zuerst aus Props, dann berechnen
  const totalPages = totalPagesProp ?? Math.max(1, Math.ceil(totalItems / pageSize));
  const hasNextPage = actualCurrentPage < totalPages;

  return (
    <Pagination
      currentPage={actualCurrentPage}
      pageSize={pageSize}
      totalItems={totalItems}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      hasNextPage={hasNextPage}
    />
  );
}
