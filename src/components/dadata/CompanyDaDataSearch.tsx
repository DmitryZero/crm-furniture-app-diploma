import { Autocomplete, Box, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react"
import type { SyntheticEvent } from "react"
import debounce from 'lodash.debounce';
import { api } from "~/utils/api";
import handleErrors from "~/utils/handleErrors";
import type { CompanyType } from "~/schemas/CompanyDaDataType";

export default function CompanySearchDaData() {

    const [input, setInput] = useState<string>('');
    const [value, setValue] = useState<CompanyType | null>(null);
    const [options, setOptions] = useState<CompanyType[]>([]);

    api.client.getClientCompany.useQuery(undefined, {                               
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: false,
        onSuccess: (data) => {

            if (data && data.company?.companyName) {
                setValue({
                    value: data?.company?.companyName,
                    data: {
                        address: {
                            value: data.company.address
                        },
                        inn: data?.company?.inn
                    } 
                })
                setInput(data.company.companyName)
            }            
        }    
    })

    const getCompaniesFromDaData = api.dadata.findCompaniesByInfo.useQuery({ query: input }, {
        enabled: false,
    });
    const addCompanyToClient = api.company.addCompanyToClient.useMutation();
    const removeCompanyToClient = api.client.removeCompanyFromClient.useMutation();

    const fetch = useMemo(() => debounce(async () => {
        const companies = await getCompaniesFromDaData.refetch();
        if (companies.data) setOptions(companies.data.suggestions);
    }, 400), []);

    useEffect(() => {
        fetch()?.catch((e) => console.log(e));        
    }, [input, value, fetch])

    const handleSelect = handleErrors(async (value: CompanyType | null) => {
        if (value && value.value && value.data && value.data.inn && value.data.address && value.data.address.value) {
            await addCompanyToClient.mutateAsync({
                companyName: value.value,
                address: value.data.address.value,
                inn: value.data.inn
            })
        } else await removeCompanyToClient.mutateAsync();
    })

    return (
        <>
            <Autocomplete
                className="mt-2"
                disablePortal
                id="combo-box-demo"
                options={options}
                getOptionLabel={(option) => option.value}
                renderOption={(props, option) => (
                    <Box component="li" {...props} key={option.data.inn}>
                        <div>
                            {option.value}
                            <div className="flex flex-row gap-2 text-xs">
                                <div>{option.data.inn}</div>
                                <div>{option.data.address.value}</div>
                            </div>
                        </div>
                    </Box>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Выберите компанию"
                    />
                )}
                value={value}
                filterOptions={(x) => x}
                autoComplete
                includeInputInList
                filterSelectedOptions
                noOptionsText="Нет подходящих компаний"
                onChange={(event: SyntheticEvent<Element, Event>, newValue: CompanyType | null) => {
                    setOptions(newValue ? [newValue, ...options] : options);
                    setValue(newValue);
                    handleSelect(newValue);
                }}
                onInputChange={(event, newInputValue) => {
                    setInput(newInputValue);
                }}
                isOptionEqualToValue={(option, current) => value?.data.inn === current.data.inn && value.data.address === current.data.address}
            />
        </>
    )
}