import ChairIcon from '@mui/icons-material/Chair';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import SearchBar from './SearchBar';
import Link from 'next/link';
import { Badge } from '@mui/material';
import { useContext } from 'react';
import UserContext from '~/Context/UserContext';

export default function Navbar() {
    const contextController = useContext(UserContext);
    // console.log("NavBar " + contextController.cartQuantity);
    return (
        <>
            <div className="h-18
                          border-b-gray-300 
                            border-solid 
                            border-2
                            grid
                            grid-cols-12
                            divide-x-[1px]
                          divide-gray-300
                          bg-white">
                <Link href="/" className="col-span-2 flex items-center justify-center gap-1 hover:bg-gray-200 cursor-pointer">
                    <ChairIcon />
                    E-Shop
                </Link>
                <div className="col-span-4 text-center"><SearchBar /></div>
                <Link href="/productSearch" className="col-span-2 flex items-center justify-center gap-1 hover:bg-gray-200 cursor-pointer">
                    <CategoryIcon />
                    Категории
                </Link>
                <div className="col-span-2 flex items-center justify-center gap-1 hover:bg-gray-200 cursor-pointer">
                    <ShoppingCartIcon />
                    <Badge badgeContent={0} color="primary">
                        Корзина
                    </Badge>
                </div>
                <div className="col-span-2 flex items-center justify-center gap-1 hover:bg-gray-200 cursor-pointer">
                    <PersonIcon />
                    Личный кабинет
                </div>
            </div >
        </>
    )
}