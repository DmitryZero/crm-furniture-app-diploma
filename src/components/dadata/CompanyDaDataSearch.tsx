import { Autocomplete, TextField } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import debounce from 'lodash.debounce';
import { api } from "~/utils/api";
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import handleErrors from "~/utils/handleErrors";
import { Company } from "@prisma/client";
import CompanyTypeToPrismaCompany from "~/utils/CompanyDTO";
import { CompanyType } from "~/schemas/CompanyDaDataType";
import { AppRouter } from "~/server/api/root";

export default function CompanySearchDaData() {

    const [input, setInput] = useState("");
    const [options, setOptions] = useState<CompanyType[]>([]);

    const getCompaniesFromDaData = api.dadata.findCompaniesByInfo.useQuery({ query: input }, {
        enabled: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            const {data: companies} = await getCompaniesFromDaData.refetch();  
            if (companies) setOptions(companies.suggestions);                      
        }

        fetchData()
            .catch(console.error);
    }, [input])

    return (
        <>
            <Autocomplete
                className="mt-2"
                disablePortal
                id="combo-box-demo"
                options={options}
                getOptionLabel={(option) => option.value}
                renderInput={(params) => <TextField {...params} label="Movie" />}
                onChange={(event, value) => setInput(value?.value || "")}
                filterOptions={(x) => x}
            />
        </>
    )
}