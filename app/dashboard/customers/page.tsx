import Table from '@/app/ui/customers/table';
import { TableRowSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchFilteredCustomers } from '@/app/lib/data';
 
export default async function Page(props: {

    searchParams?: Promise<{
      query?: string;
      page?: string;
    }>;
  }) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';

    const customers = await fetchFilteredCustomers(query)

  return (
    <div className="w-full">
       <Suspense >
        <Table customers={customers} />
      </Suspense>
    </div>
  );
}