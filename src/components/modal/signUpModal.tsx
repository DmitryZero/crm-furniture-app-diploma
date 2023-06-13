import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import type { Dispatch, SetStateAction } from 'react';
import { TextField } from '@mui/material';
import { api } from '~/utils/api';
import handleErrors from '~/utils/handleErrors';
import UserContext from '~/Context/UserContext';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '5px'
};

type IProps = {
    state: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

export default function SignUpModal({ state, setOpen }: IProps) {
    const [fullName, setFullName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorVisible, setIsErrorVisible] = React.useState(false);
    const contextController = React.useContext(UserContext);

    const signUpRequest = api.client.signUp.useMutation()

    api.client.getClientByCookie.useQuery(undefined, {
        enabled: false,
    });

    const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        setOpen(false);
    }

    const handleClick = handleErrors(async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        const result = await signUpRequest.mutateAsync({ email: email, password: password, fullName: fullName },
            {
                onError: () => {
                    setIsErrorVisible(true);
                }
            });
        if (contextController.clientSetter && result) contextController.clientSetter(result);
        if (result) setOpen(false);
    });

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={state}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={state}>
                    <Box sx={style}>
                        <div className='text-2xl font-roboto mb-3'>Авторизация</div>
                        <div className="flex flex-col gap-3">
                            <TextField onChange={(e) => { setFullName(e.target.value); setIsErrorVisible(false) }} id="fullName" label="ФИО" variant="outlined" />
                            <TextField onChange={(e) => { setEmail(e.target.value); setIsErrorVisible(false) }} id="email" label="Email" variant="outlined" />
                            <TextField onChange={(e) => { setPassword(e.target.value); setIsErrorVisible(false) }} id="password" type="password" label="Пароль" variant="outlined" />
                            {errorVisible &&
                                <div className="text-red-600 text-xl font-roboto ">Были указаны некорректные данные при регистрации</div> 
                            }
                            <button onClick={handleClick} className='bg-blue-500 text-white self-end
                                 px-4 py-2 rounded-xl hover:bg-blue-100
                                hover:text-black transition-all'>Зарегистрироваться</button>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}