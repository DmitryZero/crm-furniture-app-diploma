import CategoryTree from "../categoryTree/CategoryTree";
import { Dispatch, SetStateAction } from "react";
import { TextField } from "@mui/material";

interface IProps {
    categoryId: string,
    setCategoryId: Dispatch<SetStateAction<string>>,
    setMinPrice: Dispatch<SetStateAction<number | undefined>>,
    setMaxPrice: Dispatch<SetStateAction<number | undefined>>,
    setQuery: Dispatch<SetStateAction<string>>
}

export default function ProductsFilterCard({categoryId, setCategoryId, setMinPrice, setMaxPrice, setQuery}: IProps) {
    return (
        <>
            <div className="bg-white p-3 rounded-md">
                <div>Категории</div>
                <div className="flex flex-col gap-3">
                    <CategoryTree categoryId={categoryId} setCategoryId={setCategoryId} />
                    <TextField onChange={(e) => setMinPrice(Number(e.target.value))} type="number" id="minPrice" label="Минимальная сумма" variant="standard" />
                    <TextField onChange={(e) => setMaxPrice(Number(e.target.value))} type="number" id="maxPrice" label="Максимальная сумма" variant="standard" />
                    <TextField onChange={(e) => setQuery(e.target.value)} type="text" id="query" label="Название" variant="standard" />
                </div>
            </div>
        </>
    )
}