import { Category } from "@prisma/client"
import React from "react";
import { api } from "~/utils/api"

interface IProps {
    category: Category
}

export default function CategoryItem({ category }: IProps) {    
    const [childCategoriesVisible, setChildCategoriesVisible] = React.useState(false);
    const childCategories = api.category.getChildrenCategories.useQuery({ parentId: category.categoryId }, {
        enabled: childCategoriesVisible
    });

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setChildCategoriesVisible(prevState => !prevState);
        e.stopPropagation();
    }

    return (
        <>
            <div className="" onClick={handleClick}>
                <div className="hover:bg-gray-400 cursor-pointer p-3">{category.categoryName}</div> 
                <div className="pl-2">
                    {childCategoriesVisible && (childCategories.data?.length || 0) > 0 &&
                        childCategories.data?.map(category => {
                            return (
                                <CategoryItem key={category.categoryId} category={category}/>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}