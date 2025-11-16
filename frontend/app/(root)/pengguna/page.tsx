import UserWrapper from "@/components/master/user/UserWrapper";

const PenggunaPage = ({searchParams}: {searchParams: { page?: string, pageSize?: string, search?: string }}) => {
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
            <UserWrapper initData={initData} />
        </div>
    )
};

export default PenggunaPage;