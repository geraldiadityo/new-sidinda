import SkpdWrapper from "@/components/master/skpd/SkpdWrapper";

const SkpdPage = ({searchParams}: { searchParams: { page?: string, pageSize?: string, search?: string } }) => {
    const page = Number(searchParams.page) || 1;
    const pageSize = Number(searchParams.pageSize) || 10;
    const searchQuery = searchParams.search || '';

    const initData = {
        metadata: {
            page,
            pageSize,
            searchQuery
        }
    };

    return (
        <div className="container mx-auto py-6">
            <SkpdWrapper initData={initData} />
        </div>
    )
}

export default SkpdPage;
