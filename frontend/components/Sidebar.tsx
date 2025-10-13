'use client';

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { ChevronDown, ChevronLeft, ChevronRight, LogOut, Menu } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

type MenuItem = {
    title: string;
    href: string;
    icon?: React.ReactNode;
    items?: MenuItem[];
};

export type MenurGroup = {
    title?: string;
    items: MenuItem[];
}

interface SidebarProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    menuGroup: MenurGroup[];
};

function MenuItemComponent({ item, isActive, level, collapsed }: {
    item: MenuItem,
    isActive: (href: string) => boolean,
    level: number,
    collapsed: boolean
}) {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = item.items && item.items.length > 0;
    
    if(collapsed && level === 0) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href={item.href}
                            className={cn(
                                "flex items-center justify-center px-3 py-2 text-sm font-medium rounded-sm transition-colors",
                                isActive(item.href)
                                    ? "bg-accent text-accent-foreground"
                                    : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                            )}
                        >
                            {item.icon}
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>{item.title}</p>
                        {hasChildren && item.items?.map(child => (
                            <p key={child.href} className="text-xs text-muted-foreground">{child.title}</p>
                        ))}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return (
        <div>
            <Link
                href={item.href}
                className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-sm transition-colors",
                    isActive(item.href)
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
                    level > 0 && `pl-${level * 4}`
                )}
            >
                {item.icon && <span className="mr-3">{item.icon}</span>}
                <span className="flex-1">{item.title}</span>
                {hasChildren && (
                    <span
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setExpanded(!expanded)
                        }}
                    >
                        {expanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ): (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </span>
                )}
            </Link>

            {hasChildren && expanded && !collapsed && (
                <div className="ml-4 mt-1 space-y-1">
                    {item.items?.map((child, index) => (
                        <MenuItemComponent
                            key={index}
                            item={child}
                            isActive={isActive}
                            level={level + 1}
                            collapsed={collapsed}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export function Sidebar({
    className,
    menuGroup
}: SidebarProps) {
    const pathName = usePathname();
    const [expadedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const { logout, user } = useAuth();

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768)
            if (window.innerWidth < 768){
                setIsCollapsed(false)
            }
        }
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile)
    }, []);

    useEffect(() => {
        const savedState = localStorage.getItem('sidebarCollapsed');
        if(savedState && !isMobile){
            setIsCollapsed(savedState === 'true');
        }
    }, [isMobile]);

    useEffect(() => {
        if(!isMobile){
            localStorage.setItem('sidebarCollapsed', String(isCollapsed));
        }
    }, [isCollapsed, isMobile]);

    // toggleGroup
    const toggleGroup = (title: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    }

    const isActive = (href: string) => {
        return pathName === href;
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };


    const sidebarContent = (
        <>
            <div className="flex-1 overflow-y-auto py-4">
                <div className={cn("flex items-center px-4", isCollapsed ? "justify-center" : "justify-between")}>
                    {!isCollapsed && <h2 className="text-lg font-semibold tracking-tight">Dashboard</h2>}
                    {!isMobile && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleCollapse}
                            className="p-2"
                        >
                            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                        </Button>
                    )}
                </div>
                <div className="mt-6">
                    {menuGroup.map((group, groupIndex) => (
                        <div key={groupIndex} className={cn("px-3 py-2", isCollapsed && "px-2")}>
                            {group.title && !isCollapsed && (
                                <div
                                    className="flex items-center justify-between px-2 py-2 text-sm font-medium text-muted-foreground cursor-pointer"
                                    onClick={() => toggleGroup(group.title!)}
                                >
                                    <span>{group.title}</span>
                                    {expadedGroups[group.title] ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ): (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                </div>
                            )}

                            {(group.title ? expadedGroups[group.title] !== false : true) && (
                                <div className="space-y-1">
                                    {group.items.map((item, itemIndex) => (
                                        <MenuItemComponent
                                            key={itemIndex}
                                            item={item}
                                            isActive={isActive}
                                            level={0}
                                            collapsed={isCollapsed}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {user && (
                <div className={cn('p-4 border-t', isCollapsed && "p-2")}>
                    {isCollapsed ? (
                        <div className="flex justify-center">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>{user.nama.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                    ): (
                        <>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback>{user.nama.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{user.nama}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.skpd.nama}</p>
                                </div>
                            </div>
                            <Separator className="my-3" />
                            <div className="flex justify-between">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground"
                                    onClick={logout}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    {!isCollapsed && "logout"}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    )

    const desktopSidebar = (
        <div
            className={cn(
                "flex flex-col h-full border-r bg-background transition-all duration-300 ease-in-out",
                isCollapsed ? "w-20" : "w-64",
                className
            )}
        >
            {sidebarContent}
        </div>
    )

    const mobileSidebar = (
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className="fixed left-4 top-4 z-50 md:hidden"
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
                <SheetHeader className="text-left p-4 border-b">
                    <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                    {sidebarContent}
                </div>
            </SheetContent>
        </Sheet>
    )

    return (
        <>
            {isMobile ? mobileSidebar : desktopSidebar}
        </>
    )
}