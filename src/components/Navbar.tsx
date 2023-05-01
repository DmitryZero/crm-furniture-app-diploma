import ChairIcon from '@mui/icons-material/Chair';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import SearchBar from './SearchBar';

export default function Navbar() {
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
                <div className="col-span-2 flex items-center justify-center gap-1 hover:bg-gray-200 cursor-pointer">
                    <ChairIcon />
                    E-Shop
                </div>
                <div className="col-span-4 text-center"><SearchBar/></div>
                <div className="col-span-2 flex items-center justify-center gap-1 hover:bg-gray-200 cursor-pointer">
                    <CategoryIcon />
                    Категории
                </div>
                <div className="col-span-2 flex items-center justify-center gap-1 hover:bg-gray-200 cursor-pointer">
                    <ShoppingCartIcon />
                    Корзина
                </div>
                <div className="col-span-2 flex items-center justify-center gap-1 hover:bg-gray-200 cursor-pointer">
                    <PersonIcon />
                    Личный кабинет
                </div>
            </div>
        </>
    )
}