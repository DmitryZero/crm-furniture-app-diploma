import SearchIcon from '@mui/icons-material/Search';
import { TextField } from '@mui/material';

export default function SearchBar() {
    return (
        <>
            <div className=''>
                <TextField
                    fullWidth
                    id="standard-basic"
                    label={<><SearchIcon />Поиск</>}
                    variant="filled"
                    sx={{
                        input: {
                            color: "black",
                            background: "#fff",
                            fontFamily: "font-garamond"
                        }
                    }}
                />
            </div>
        </>
    )
}