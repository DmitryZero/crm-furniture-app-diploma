import ChairIcon from '@mui/icons-material/Chair';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import Link from 'next/link';
import { Badge } from '@mui/material';
import { useContext, useState } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import UserContext from '~/Context/UserContext';
import SignInModal from './modal/signInModal';
import SignUpModal from './modal/signUpModal';

export default function Navbar() {
    const contextController = useContext(UserContext);
    const [openSignInModal, setOpenSignInModal] = useState(false);
    const [openSignUpModal, setOpenSignUpModal] = useState(false);

    return (
        <>
            <div className="h-14
                          border-b-gray-300 
                            border-solid 
                            border-2
                            grid
                            grid-cols-12
                            divide-x-[1px]
                          divide-gray-300
                          bg-secondary
                          sticky top-0 z-10
                          shadow-md">
                <Link href="/" className="col-span-2 flex items-center justify-center gap-1 hover:bg-gray-200 cursor-pointer">
                    <ChairIcon />
                    E-Shop
                </Link>
                <div className="col-span-4 text-center"></div>
                <Link href="/productSearch" className="col-span-2 flex items-center justify-center gap-1 hover:bg-gray-200 cursor-pointer">
                    <CategoryIcon />
                    Категории
                </Link>
                {contextController.client ?
                    <Link href="/userCartAndOrders" className="col-span-2 flex items-center justify-center gap-1 hover:bg-gray-200 cursor-pointer">
                        <ShoppingCartIcon />
                        <Badge badgeContent={0} color="primary">
                            Заказы
                        </Badge>
                    </Link> :
                    <button onClick={() => setOpenSignInModal(true)} className="col-span-2 flex items-center justify-center gap-1 hover:bg-gray-200 cursor-pointer">
                        <LoginIcon />
                        Войти
                    </button>
                }
                {contextController.client ?
                    <Link href="/userProfile" className="col-span-2 flex items-center justify-center gap-1 hover:bg-gray-200 cursor-pointer">
                        <PersonIcon />
                        Личный кабинет
                    </Link> :
                    <button onClick={() => setOpenSignUpModal(true)} className="col-span-2 flex items-center justify-center gap-1 hover:bg-gray-200 cursor-pointer">
                        <HowToRegIcon />
                        Регистрация
                    </button>
                }
            </div >
            <SignInModal state={openSignInModal} setOpen={setOpenSignInModal} />
            <SignUpModal state={openSignUpModal} setOpen={setOpenSignUpModal} />
        </>
    )
}