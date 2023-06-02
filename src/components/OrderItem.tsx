import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Link, Paper, Step, StepLabel, Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Order, OrderStatus, OrderType, Product, ProductsInCart, productsOfOrder } from "@prisma/client";

import OrderTable from "./tables/OrderTable";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StatusChip from "./StatusChip";
import { useState } from "react";

const dictOrder = {
    "new": "На распределении",
    "processing": "На подтверждении",
    "prepayment": "Предоплата",
    "delivery": "Доставка",
    "postpayment": "Постоплата",
    "success": "Закрыт успешно",
    "rejected": "Отклонён"
}

const manufacturingStatus = {
    "new": "На распределении",
    "processing": "На подтверждении",
    "costEstimate": "На оценке",
    "approval": "На согласовании оценки",
    "prepayment": "Предоплата",
    "manufacturing": "На производстве",
    "delivery": "Доставка",
    "postpayment": "Постоплата",
    "success": "Закрыт успешно",
    "rejected": "Отклонён"
}

interface IProps {
    item: Order & {
        productsOfOrder: (productsOfOrder & {
            product: Product;
        })[];
    }
}

export default function OrderItem({ item }: IProps) {
    let label: string = "";
    if (item.orderType === "order" && item.orderStatus) label = dictOrder[item.orderStatus];
    else if (item.manufacturingStatus) label = manufacturingStatus[item.manufacturingStatus];        

    const [activeStep, setActiveStep] = useState((item.orderType === "order"
        ? Object.values(dictOrder).findIndex((value) => value === label)
        : Object.values(manufacturingStatus).findIndex((value) => value === label)))

    const steps = item.orderType === "order" ? Object.values(dictOrder).slice(0, -1) : Object.values(manufacturingStatus).slice(0, -1);

    return (
        <Accordion key={item.orderId} sx={{ border: '1px solid #7C7C7C', borderRadius: '12px' }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography component={'span'} className="text-sm">
                    <div className="flex items-center gap-3">
                        <div>
                            Заказ на {item.summ.toLocaleString()} РУБ.
                        </div>
                        <StatusChip isDeclined={label === "Отклонён"} label={label} {...(label === "Закрыт успешно" ? { color: 'success' } : { color: 'primary' })} />
                    </div>
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                {
                    label !== "Отклонён" &&
                    <Box sx={{ width: '100%', marginBottom: '20px' }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                }
                <OrderTable order={item} />
            </AccordionDetails>
        </Accordion>
    )
}