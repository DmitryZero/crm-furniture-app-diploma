import CategoryTree from "../categoryTree/CategoryTree";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Box, Input, Slider, TextField } from "@mui/material";

interface IProps {
    categoryId: string,
    setCategoryId: Dispatch<SetStateAction<string>>,
    setMinPrice: Dispatch<SetStateAction<number | undefined>>,
    setMaxPrice: Dispatch<SetStateAction<number | undefined>>,
    setQuery: Dispatch<SetStateAction<string>>
}

function valuetext(value: number) {
    return `${value}|||`;
}

export default function ProductsFilterCard({ categoryId, setCategoryId, setMinPrice, setMaxPrice, setQuery }: IProps) {
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

        setMinPrice(newValue[0]);
        setMaxPrice(newValue[1]);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, type: "min" | "max") => {
        const newValue = Number(e.target.value);
        if (isNaN(newValue) || (type === "min" && newValue < minValue) || (type === "max" && newValue > maxValue)) return;
        
        if (type === "min") {
            setValue([Math.min(newValue, value[1]! - minDistance), value[1]!]);
            setMinPrice(newValue)
        } else {
            setValue([value[0]!, Math.max(newValue, value[0]! + minDistance)]);
            setMaxPrice(newValue);
        }
    }

    return (
        <>
            <div className="bg-secondary p-6 rounded-md shadow-md">
                <div className="text-xl">Категории</div>
                <div className="flex flex-col gap-3">
                    <CategoryTree categoryId={categoryId} setCategoryId={setCategoryId} />
                    <Box className="px-5">
                        <Slider
                            // getAriaLabel={() => 'Minimum distance'}
                            value={value}
                            onChange={handleChange}
                            valueLabelDisplay="auto"
                            getAriaValueText={valuetext}
                            disableSwap
                            min={0}
                            max={100000}
                            valueLabelFormat={(x) => `${x} РУБ.`}
                        />
                    </Box>
                    <div className="grid grid-cols-9 gap-3 items-center">
                        <div className="col-span-4 flex gap-2 items-baseline">
                            <div>от</div>
                            <div>
                                <input type="text" onChange={(e) => handleInputChange(e, "min")} value={value[0]} className="w-full p-2 rounded-full" />
                            </div>
                        </div>
                        <div className="h-[1px] w-full bg-primary col-span-1"></div>
                        <div className="col-span-4">
                            <div className="col-span-4 flex gap-2 items-baseline">
                                <div>до</div>
                                <div>
                                    <input type="text" onChange={(e) => handleInputChange(e, "max")} value={value[1]} className="w-full p-2 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <TextField onChange={(e) => setQuery(e.target.value)} type="text" id="query" label="Название" variant="standard" />
                </div>
            </div>
        </>
    )
}