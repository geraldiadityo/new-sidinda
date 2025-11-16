import { MenurGroup, Sidebar } from "@/components/Sidebar";
import { FileText, HomeIcon, Landmark } from "lucide-react";
import { PrimeReactProvider } from 'primereact/api';
export default async function RootLayout({
    children
}: { children: React.ReactNode }){
    
    const menuGroup: MenurGroup[] = [
        {
            items: [
                {
                    title: 'Dashboard',
                    href: '/',
                    icon: <HomeIcon className="h-4 w-4" />
                },
                {
                    title: 'Skpd',
                    href: '/skpd',
                    icon: <Landmark className="h-4 w-4" />
                }
            ],
        },
        {
            title: 'Pengguna',
            items: [
                {
                    title: 'role',
                    href: '/role',
                    icon: <FileText className="h-4 w-4" />
                },
                {
                    title: 'User',
                    href: '/user',
                    // icon: <User className="h-4 w-4" />
                }
            ]
        }
    ];

    return (
        <PrimeReactProvider>
            <main className="flex h-screen w-full">
                <Sidebar menuGroup={menuGroup} className="hidden md:block" />
                <div className="flex-1 overflow-y-auto md:ml-0">
                    {children}
                </div>
            </main>
        </PrimeReactProvider>
    )
}