import { Divider, TextField } from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from "~/utils/api";

interface IFile {
    name: string,
    file: File
}

interface IProps {
    files: File[],
    setFiles: React.Dispatch<React.SetStateAction<File[]>>
}

export default function FileLoader({ files, setFiles }: IProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFileLoad = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const newArray: File[] = [];

        for (const file of e.target.files) {
            newArray.push(file);
        }

        let finalArray = [...files, ...newArray];
        finalArray = finalArray.filter((item, index) => finalArray.findLastIndex(file => file.name === item.name) === index);

        setFiles(finalArray);
    }

    const handleFileDelete = (fileName: string) => {
        setFiles(prevValue => prevValue.filter(item => item.name !== fileName));
    }

    return (
        <>
            <input
                type="file"
                multiple
                ref={inputRef}
                onChange={handleFileLoad}
                className="hidden"
            />
            <div className="flex justify-center my-3">
                <button onClick={() => inputRef.current?.click()} className="p-3 border-2 border-primary w-fit rounded-lg text-primary bg-secondary hover:bg-primary
                                       hover:text-secondary hover:border-black transition duration-300 ease-in-out">
                    Загрузить документы к заказу
                </button>
            </div>
            {
                files && files.length > 0 &&
                <div className="border-[1px] border-primary rounded-md p-4 my-3 flex flex-col gap-3">
                    {
                        files.map((file, index) => (
                            <div key={index}>
                                <div className="flex flex-row gap-2 items-center">
                                    <DescriptionRoundedIcon className="w-fit flex-initial" />
                                    <div className="flex-1">
                                        {file.name}
                                    </div>
                                    <div onClick={() => handleFileDelete(file.name)} className="w-fit flex-initial cursor-pointer rounded-full bg-primary text-secondary
                                 hover:bg-secondary hover:text-primary border-2 border-primary transition-all p-1">
                                        <DeleteIcon />
                                    </div>
                                </div>
                                <Divider />
                            </div>
                        ))
                    }
                </div>
            }

        </>
    )
}