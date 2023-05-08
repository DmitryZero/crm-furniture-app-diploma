import { api } from "~/utils/api"
import CategoryTree from "../categoryTree/CategoryTree";
import { useEffect, useState } from "react";
import { Category } from "@prisma/client";

export default function ProductsFilterCard() {
    const [categories, setCategories] = useState<Category[] | undefined>(undefined);
    const parentCategories = api.category.getAll.useQuery(undefined, {
        enabled: false
    });

    useEffect(() => {
        const fetchData = async () => {
            const dataApi = await parentCategories.refetch();
            if (dataApi.data) setCategories(dataApi.data?.filter(category => category.parentCategoryId === null));
        }

        fetchData()
            .catch(console.error);
    }, [])

    return (
        <>
            <div className="bg-white p-3 rounded-md">
                <div>Категории</div>
                <div className="pl-2">
                    {categories && <CategoryTree parentCategories={categories} />}
                </div>
            </div>
        </>
    )
}