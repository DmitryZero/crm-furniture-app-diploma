import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Switch, FormControlLabel, Checkbox, TextFieldProps } from "@mui/material";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import FileLoader from "./FileLoader";
import { api } from "~/utils/api";
import { Company } from "@prisma/client";
import handleErrors from "~/utils/handleErrors";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import client from "~/s3/s3Client";

interface IProps {
    openDialog: boolean,
    setOpenDialog: Dispatch<SetStateAction<boolean>>,
    entity: Company | null,
    setCurrentEntity: React.Dispatch<React.SetStateAction<Company | null>>
}

export default function ManufacturingOrderDialog({ openDialog, setOpenDialog, entity, setCurrentEntity }: IProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isEntity, setIsEntity] = useState(false);
    const commentRef = useRef<HTMLInputElement>(null);
    const personalOrderApi = api.order.createPersonalOrder.useMutation();

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsEntity(e.target.checked);
    }

    function _arrayBufferToBase64(buffer: ArrayBuffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            const number = bytes[i];
            if (number === undefined) continue;

            binary += String.fromCharCode(number);
        }
        return window.btoa(binary);
    }

    const handleCreatePersonalOrder = handleErrors(async () => {
        const buffers = await Promise.all(files.map(item => item.arrayBuffer()));
        const base64Arr = buffers.map(item => _arrayBufferToBase64(item));

        const filesObj = files.map((item, index) => {
            return {
                name: files[index]?.name || "",
                body: base64Arr[index]
            }
        });

        await personalOrderApi.mutateAsync({
            company: entity,
            comment: (commentRef && commentRef.current) ? commentRef.current.value : "",
            files: filesObj
        })

        handleClose();
    })

    return (
        <>
            <Dialog open={openDialog} maxWidth="md" fullWidth onClose={handleClose} disableScrollLock>
                <DialogTitle>Индивидуальный заказ</DialogTitle>
                <DialogContent>
                    <DialogContentText className="mb-2">
                        Опишите товар, который вы хотите заказать и приложите соответсвующие документы
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        id="name"
                        label="Описание"
                        type="text"
                        fullWidth
                        multiline
                        placeholder="Описание заказа"
                        rows={5}
                        variant="outlined"
                        inputRef={commentRef}
                    />
                    {
                        entity !== null &&
                        <>
                            <FormControlLabel required control={
                                <Checkbox
                                    checked={isEntity}
                                    onChange={handleSwitchChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            } label={`Совершить покупку от имении ${entity.companyName} ${entity?.inn}`} />
                        </>
                    }
                    <FileLoader files={files} setFiles={setFiles} />
                </DialogContent>
                <DialogActions>
                    <button onClick={handleCreatePersonalOrder} className="p-3 w-fit rounded-xl text-white bg-primary hover:bg-accent
                                   hover:text-black transition duration-300 ease-in-out">Заказать</button>
                </DialogActions>
            </Dialog>
        </>
    )
}