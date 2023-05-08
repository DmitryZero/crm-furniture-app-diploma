import React, { useContext, useEffect, useRef, useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { api } from '~/utils/api';
import { Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import UserContext from '~/Context/UserContext';
import debounce from 'lodash.debounce';

type IProps = {
    productId: string,
    clickAddItem?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    clickRemoveItem?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}

export default function AddToCardButton({ productId, clickAddItem, clickRemoveItem: clickRemoveIem }: IProps) {
    const contextController = useContext(UserContext);
    const [counter, setCounter] = useState(0);

    const amountApi = api.cart.getAmountOfProductsByClient.useQuery({
        productId: productId
    }, {
        enabled: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await amountApi.refetch();
            if (data) setCounter(data);
        }

        fetchData()
            .catch(console.error);
    }, [])

    const updateCart = api.cart.updateCart.useMutation();

    const handleClickNewCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        handleClickAddItem(e);
    }

    const handleClickAddItem = debounce((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();

        setCountDbDebounced.current(counter + 1);
        setCounter(counter + 1);
        if (clickAddItem) clickAddItem(e);
    })

    const handleClickRemoveItem = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();

        setCountDbDebounced.current(counter - 1);
        setCounter(counter - 1);
        if (clickRemoveIem) clickRemoveIem(e);
    }

    const changeCounterInDb = (value: number) => {
        if (contextController.client?.clientId) {
            updateCart.mutate({ productId: productId, amount: value });
        }
    }

    const setCountDbDebounced = useRef(debounce(changeCounterInDb, 1000));

    return (
        <div>
            {contextController.client?.clientId && <div className='mt-3'>
                {counter === 0 && <Button className='flex justify-center w-full p-3 text-white bg-blue-400 hover:bg-red-500
       hover:text-black transition duration-300 ease-in-out' onClick={handleClickNewCart}>
                    <ShoppingCartIcon></ShoppingCartIcon>
                </Button>}
                {counter !== 0 &&
                    <div className='flex flex-row items-center w-full justify-center text-2xl'>
                        <Button onClick={handleClickRemoveItem} className='m-3 text-secondary hover:bg-secondary
            hover:text-primary transition duration-300 ease-in-out'><RemoveCircleOutlineIcon /></Button>
                        <div className='m-3'>{counter}</div>
                        <Button onClick={handleClickAddItem} className='m-3 text-secondary hover:bg-secondary
            hover:text-primary transition duration-300 ease-in-out'><AddCircleOutlineIcon /></Button>
                    </div>
                }
            </div>}
        </div>
    )
}