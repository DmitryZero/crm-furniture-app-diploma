import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Divider, Step, StepLabel, Stepper, Typography } from "@mui/material";
import type { Order, Product, productsOfOrder, Document } from "@prisma/client";

import OrderTable from "./tables/OrderTable";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StatusChip from "./StatusChip";
import { useEffect, useState } from "react";
import PaymentIcon from '@mui/icons-material/Payment';
import handleErrors from "~/utils/handleErrors";
import { api } from "~/utils/api";
import router from "next/router";
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import Link from "next/link";

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
    "costestimate": "На оценке",
    "approval": "На согласовании оценки",
    "prepayment": "Предоплата",
    "manufacturing": "На производстве",
    "delivery": "Доставка",
    "postpayment": "Постоплата",
    "success": "Закрыт успешно",
    "rejected": "Отклонён"
}

const documentTypes = {
    "clientDocument": "Приложенный документ",
    "contract": "Договор на предоставление услуг",
    "appraisal": "Оценка"
}

interface IProps {
    item: (Order & {
        productsOfOrder: (productsOfOrder & {
            product: Product;
        })[];
        clientDocuments: Document[]
    })
}

export default function OrderItem({ item }: IProps) {
    const yokassa = api.payment.createPaymentInYookassa.useMutation();

    let labelStatus = "";
    let orderType: "Заказ товаров" | "Индвидуальный заказ" = "Заказ товаров";

    if (item.orderType === "regularOrder" && item.regularOrderStatus) {
        labelStatus = dictOrder[item.regularOrderStatus];
        orderType = "Заказ товаров";
    }
    else if (item.personalOrderStatus) {
        labelStatus = manufacturingStatus[item.personalOrderStatus];
        orderType = "Индвидуальный заказ";
    }

    const [activeStep, setActiveStep] = useState(0)

    useEffect(() => {
        const index = (item.orderType === "regularOrder"
            ? Object.values(dictOrder).findIndex((value) => value === labelStatus)
            : Object.values(manufacturingStatus).findIndex((value) => value === labelStatus));
        setActiveStep(index);
    }, [item])

    const steps = item.orderType === "regularOrder" ? Object.values(dictOrder).slice(0, -1) : Object.values(manufacturingStatus).slice(0, -1);

    const handlePayment = handleErrors(async () => {
        const summ = labelStatus === "Предоплата" ? (item.prepaymentSumm || 0) : (item.postpaymentSumm || 0);
        const idempotence = labelStatus === "Предоплата" ? "prepayment" : "postpayment";

        const payment = await yokassa.mutateAsync({ summ: summ, orderId: item.orderId, type: idempotence });
        if (payment?.confirmation.confirmation_url && !payment.paid) await router.push(payment?.confirmation.confirmation_url);
    })

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
                            {
                                orderType === "Заказ товаров"
                                    ? `Заказ на ${(item.totalSumm || 0).toLocaleString()} РУБ. от ${item.orderDate.toLocaleDateString()}`
                                    : `Индвидуальный заказ от ${item.orderDate.toLocaleDateString()}`
                            }
                        </div>
                        <Chip
                            label={orderType}
                            variant="filled"
                            className="bg-yellow-300"
                        />
                        <StatusChip isDeclined={labelStatus === "Отклонён"} label={labelStatus} {...(labelStatus === "Закрыт успешно" ? { color: 'success' } : { color: 'primary' })} />
                    </div>
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                {
                    labelStatus !== "Отклонён" &&
                    <>
                        <Box sx={{ width: '100%', marginBottom: '20px' }}>
                            <Stepper activeStep={activeStep} alternativeLabel>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                        {
                            (labelStatus === "Предоплата" || labelStatus === "Постоплата") &&
                            <div className="rounded-xl border-2 border-primary p-4 my-4">
                                <div className="flex flex-row items-center gap-3">
                                    <div className="text-xl font-rubik">
                                        Сумма {
                                            labelStatus === "Предоплата"
                                                ? item.prepaymentSumm?.toLocaleString()
                                                : item.postpaymentSumm?.toLocaleString()
                                        } Руб.
                                    </div>
                                    <Button onClick={handlePayment} className="bg-primary border-2 border-solid text-white px-5 py-2 rounded-full hover:bg-secondary hover:border-primary hover:text-accent">
                                        <div className="flex gap-2">
                                            <PaymentIcon /> Оплатить
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        }
                    </>
                }
                {
                    item.orderType === "regularOrder" &&
                    <OrderTable order={item} />
                }
                <div>
                    {
                        item.comment &&
                        <div className="border-[1px] border-primary rounded-md p-4 my-3 flex flex-col gap-3">
                            <div>
                                <div className="text-lg font-rubik">Ваш комментарий к заказу</div>
                                <div>
                                    <pre>{item.comment}</pre>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        item.clientDocuments && item.clientDocuments.length > 0 &&
                        <div className="border-[1px] border-primary rounded-md p-4 my-3 flex flex-col gap-3">
                            <div className="text-lg font-rubik">Документы к заказу</div>
                            {
                                item.clientDocuments.map((file) => (
                                    <div key={file.documentId}>
                                        <Link href={file.documentSrc} passHref>
                                            <div className="flex flex-row gap-2 items-center hover:bg-primary p-3 hover:text-secondary transition-all">
                                                <DescriptionRoundedIcon className="w-fit flex-initial" />
                                                <div className="">
                                                    {file.documentName}
                                                </div>
                                                <Chip
                                                    label={documentTypes[file.documentType]}
                                                    variant="filled"
                                                    className="bg-yellow-300"
                                                />
                                            </div>
                                        </Link>
                                        <Divider className="mt-2" />
                                    </div>
                                ))
                            }
                        </div>
                    }
                </div>
            </AccordionDetails>
        </Accordion>
    )
}