import RoleWrapper from "@/components/master/role/RoleWrapper";
import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<Role>[] = [
    {
        accessorKey: 'id',
        header: 'ID'
    },
    {
        accessorKey: 'nama',
        header: 'Nama Role'
    }
]

const RolePage = () => {
    const dataRoles = {
        columns
    };

    return (
        <div className="container mx-auto py-10">
            <RoleWrapper
                initialData={dataRoles}
            />
        </div>
    )
}

export default RolePage;