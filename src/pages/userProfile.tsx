import type { NextPage } from "next";
import Head from "next/head";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useContext, useState } from "react";
import { Alert, Snackbar, TextField } from "@mui/material";
import UserContext from "~/Context/UserContext";
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import handleErrors from "~/utils/handleErrors";
import CompanySearchDaData from "~/components/dadata/CompanySearchDaData";

const UserProfilePage: NextPage = () => {
    const contextController = useContext(UserContext);
    const router = useRouter();

    const [successAlert, setSuccessAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);

    const logout = api.client.clearTokenCookie.useMutation();
    const updateUserInfo = api.client.updateUserInfo.useMutation();

    const [isEdit, setIsEdit] = useState(false);
    const [fullName, setFullName] = useState(contextController.client?.fullName || "");
    const [email, setEmail] = useState(contextController.client?.email || "");
    const [phone, setPhone] = useState(contextController.client?.phone || "");

    const handleClickEdit = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        setIsEdit(prevState => !prevState);
    }

    const handleLogout = handleErrors(async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        await logout.mutateAsync();
        if (contextController.clientSetter) contextController.clientSetter(null);
    });

    const handleSaveAttempt = handleErrors(async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        const newUser = await updateUserInfo.mutateAsync({ email: email, fullName: fullName, phone: phone }, {
            onSuccess: () => {
                setIsEdit(false);
                setSuccessAlert(true);
            },
            onError: () => {
                setErrorAlert(true);
            }
        });
        if (contextController.clientSetter) contextController.clientSetter(newUser);
    });

    if (!contextController.client) router.push('/').catch((e) => console.log(e));

    return (
        <>
            <Head>
                <title>E-Shop</title>
                <meta name="description" content="CRM Furniture" />
            </Head>
            <main>
                <div className="bg-white rounded-xl w-3/4 h-3/4 mx-auto p-5 my-5 relative">
                    <div className="absolute right-3 flex flex-row gap-3">
                        {
                            isEdit ?
                                <div onClick={handleSaveAttempt} className="bg-gray-100 w-fit p-2 border-2 rounded-lg hover:bg-gray-600 hover:text-white cursor-pointer transition-all">
                                    <SaveIcon />
                                </div> :
                                <div onClick={handleClickEdit} className="bg-gray-100 w-fit p-2 border-2 rounded-lg hover:bg-gray-600 hover:text-white cursor-pointer transition-all">
                                    <EditIcon />
                                </div>
                        }
                        <div onClick={handleLogout} className="bg-gray-100 w-fit p-2 border-2 rounded-lg hover:bg-gray-600 hover:text-white cursor-pointer transition-all">
                            <LogoutIcon />
                        </div>
                    </div>
                    <div>
                        <div className="text-xl font-roboto">Данные пользователя</div>
                        <div className="flex flex-col gap-3 mt-6">
                            <TextField disabled={!isEdit} onChange={(e) => { setFullName(e.target.value) }} value={fullName} id="fullName" label="ФИО" variant="outlined" />
                            <TextField disabled={!isEdit} onChange={(e) => { setEmail(e.target.value) }} value={email} id="email" label="Email" variant="outlined" />
                            <TextField disabled={!isEdit} onChange={(e) => { setPhone(e.target.value) }} value={phone} id="phone" label="Phone" variant="outlined" />
                        </div>
                    </div>
                </div>
                <Snackbar open={successAlert} autoHideDuration={3000} onClose={() => setSuccessAlert(false)}>
                    <Alert severity="success">
                        Изменения были сохранены
                    </Alert>
                </Snackbar>
                <Snackbar open={errorAlert} autoHideDuration={3000} onClose={() => setErrorAlert(false)}>
                    <Alert severity="error">
                        Изменения не были сохранены
                    </Alert>
                </Snackbar>
                <div className="bg-white rounded-xl w-3/4 h-3/4 mx-auto p-5 my-5">
                    <div className="text-xl font-roboto">Мои юридические лица</div>
                    <div className="w-full">
                        <CompanySearchDaData />
                    </div>
                </div>
            </main>

        </>
    );
};

export default UserProfilePage;
