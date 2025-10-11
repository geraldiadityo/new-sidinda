"use client";
import Link from "next/link";
import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "./ui/breadcrumb";
import { ChevronRight, HomeIcon } from "lucide-react";

type BreadcrumbItems = {
    title: string;
    href?: string;
}

interface BreadcrumbProps {
    data: BreadcrumbItems[];
};

const BreadcrumbWrapper = ({ data }: BreadcrumbProps) => {
    const lastIndex = data.length - 1;
    return (
        <Breadcrumb>
            {data.map((item, index) => (
                <React.Fragment key={index}>
                    <BreadcrumbItem>
                        {index === 0 ? (
                            <BreadcrumbLink asChild>
                                <Link href={item.href ?? '#'} className="flex items-center gap-1 text-xs">
                                    <HomeIcon className="h-4 w-4" />
                                    {item.title}
                                </Link>
                            </BreadcrumbLink>
                        ) : index !== lastIndex && item.href ? (
                            <BreadcrumbLink asChild>
                                    <Link href={item.href} className="text-xs hover:text-blue-800">
                                        {item.title}
                                    </Link>
                            </BreadcrumbLink>
                        ) : (
                            <span className="text-xs">{item.title}</span>
                        )}
                    </BreadcrumbItem>
                    {index !== lastIndex && <BreadcrumbSeparator><ChevronRight className="w-4 h-4" /></BreadcrumbSeparator>}
                </React.Fragment>
            ))}
        </Breadcrumb>
    )
}

export default BreadcrumbWrapper;
