import CategoryTree from "../categoryTree/CategoryTree";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Box, Button, Input, Slider, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import IFilter from "~/interfaces/IFilter";

interface IProps {
    categoryId?: string,
    setProductFilter?: Dispatch<SetStateAction<IFilter>>,
    handleUpdateFilterChange?: () => void
}

export default function ProductsFilterCard({ categoryId, setProductFilter, handleUpdateFilterChange }: IProps) {
    const [value, setValue] = useState<number[]>([0, 100000]);

    const maxValue = 100000;
    const minValue = 0;
    const minDistance = 10;

    const handleChange = (
        event: Event,
        newValue: number | number[],
        activeThumb: number,
    ) => {
        if (!Array.isArray(newValue) || newValue[0] === undefined || newValue[1] === undefined) {
            return;
        }

        if (activeThumb === 0) {
            setValue([Math.min(newValue[0], value[1]! - minDistance), value[1]!]);
        } else {
            setValue([value[0]!, Math.max(newValue[1], value[0]! + minDistance)]);
        }

        if (setProductFilter) setProductFilter(prevState => ({
            ...prevState,
            currentFilter: {
                ...prevState.currentFilter,
                minPrice: newValue[0],
                maxPrice: newValue[1]
            }
        }));
    };

    const handlePriceInputChange = (e: ChangeEvent<HTMLInputElement>, type: "min" | "max") => {
        const newValue = Number(e.target.value);
        if (isNaN(newValue) || (type === "min" && newValue < minValue) || (type === "max" && newValue > maxValue)) return;

        if (type === "min") {
            setValue([Math.min(newValue, value[1]! - minDistance), value[1]!]);
            if (setProductFilter) setProductFilter(prevState => ({
                ...prevState,
                currentFilter: {
                    ...prevState.currentFilter,
                    minPrice: newValue
                }
            }));
            if (setProductFilter) setProductFilter(prevState => ({ ...prevState, minPrice: newValue }));
        } else {
            setValue([value[0]!, Math.max(newValue, value[0]! + minDistance)]);
            if (setProductFilter) setProductFilter(prevState => ({
                ...prevState,
                currentFilter: {
                    ...prevState.currentFilter,
                    maxPrice: newValue
                }
            }));
        }
    }

    const handleQueryInputChange = (query: string) => {
        if (setProductFilter) setProductFilter((prevValue) => ({
            ...prevValue,
            currentFilter: ({ ...prevValue.currentFilter, query: query })
        }))
    }

    return (
        <>
            <div className="bg-secondary p-6 rounded-md shadow-md">
                <div className="text-xl">Категории</div>
                <div className="flex flex-col gap-3">
                    <CategoryTree categoryId={categoryId} setProductFilter={setProductFilter} />
                    <Box className="px-5">
                        <Slider
                            // getAriaLabel={() => 'Minimum distance'}
                            value={value}
                            onChange={handleChange}
                            valueLabelDisplay="auto"
                            disableSwap
                            min={0}
                            max={100000}
                            valueLabelFormat={(x) => `${x} РУБ.`}
                        />
                    </Box>
                    <div className="grid grid-cols-9 gap-3 items-center">
                        <div className="col-span-4 flex gap-2 items-baseline">
                            <div>от</div>
                            <div className="">
                                <input type="text" onChange={(e) => handlePriceInputChange(e, "min")} value={value[0]} className="text-xs w-full p-2 rounded-full" />
                            </div>
                        </div>
                        <div className="h-[1px] w-full bg-primary col-span-1"></div>
                        <div className="col-span-4">
                            <div className="col-span-4 flex gap-2 items-baseline">
                                <div>до</div>
                                <div>
                                    <input type="text" onChange={(e) => handlePriceInputChange(e, "max")} value={value[1]} className="text-xs w-full p-2 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <TextField onChange={(e) => handleQueryInputChange(e.target.value)} type="text" id="query" label="Название" variant="standard" />
                </div>
                <Button onClick={handleUpdateFilterChange} className="bg-primary border-2 border-solid text-white mt-5 px-5 py-2 rounded-full hover:bg-secondary hover:border-primary hover:text-accent">
                    <SearchIcon /> Поиск
                </Button>
            </div>
        </>
    )
}