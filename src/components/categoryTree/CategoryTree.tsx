import type { Category } from "@prisma/client"
import CategoryItem from "./CategoryItem"

interface IProps {
    parentCategories: Category[]
}

export default function CategoryTree({parentCategories}: IProps) {   
    return (
        <>
            {parentCategories.map(parentCategory => {
                return (
                    <CategoryItem key={parentCategory.categoryId} category={parentCategory}/>
                )
            })}
        </>
    )
}