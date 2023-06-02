import { Chip } from "@mui/material";
import type { ManufacturingOrderStatus, OrderStatus, OrderType } from "@prisma/client";
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import FiberNewOutlinedIcon from '@mui/icons-material/FiberNewOutlined';

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