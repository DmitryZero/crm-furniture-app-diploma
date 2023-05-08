import type { Category } from "@prisma/client"
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api"

interface IProps {
    category: Category
}

export default function CategoryItem({ category }: IProps) {
    const [childCategoriesVisible, setChildCategoriesVisible] = React.useState(false);
    const [categories, setCategories] = useState<Category[] | undefined>(undefined);
    const childCategories = api.category.getChildrenCategories.useQuery({ parentId: category.categoryId }, {
        enabled: false,
    });

    const getAllCompaniesByClient = api.company.getAllByClient.useQuery(undefined, {
        enabled: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await childCategories.refetch();
            if (data) setCategories(data);
        }

        fetchData()
            .catch(console.error);
    }, [])

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setChildCategoriesVisible(prevState => !prevState);
        e.stopPropagation();
    }

    return (
        <>
            <div className="" onClick={handleClick}>
                <div className="hover:bg-gray-400 cursor-pointer p-3">{category.categoryName}</div>
                <div className="pl-2">
                    {childCategoriesVisible && categories != undefined && categories.map(category => {
                        return (
                            <CategoryItem key={category.categoryId} category={category} />
                        )
                    })
                    }
                </div>
            </div>
        </>
    )
}