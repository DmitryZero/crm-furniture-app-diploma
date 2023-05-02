import { api } from "~/utils/api"
import CategoryTree from "../categoryTree/CategoryTree";

export default function ProductsFilterCard() {
    const parentCategories = api.category.getAll.useQuery().data?.filter(category => category.parentCategoryId === null);

    return (
        <>
            <div className="bg-white p-3 rounded-md">
                <div>Категории</div>
                <div className="pl-2">
                    {parentCategories && <CategoryTree parentCategories={parentCategories} />}
                </div>
            </div>
        </>
    )
}