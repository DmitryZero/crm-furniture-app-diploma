import { Chip } from "@mui/material";

interface IProps {
    label: string,
    color: "primary" | "success",
    isDeclined: boolean
}

export default function StatusChip({ label, color, isDeclined }: IProps) {
    return (
        <Chip
            label={label}
            variant="filled"
            color={color}                
            {...(isDeclined ? {className: "bg-red-700"} : {})}      
        />
    )
}