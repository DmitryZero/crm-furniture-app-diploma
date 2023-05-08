import { TextField } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import debounce from 'lodash.debounce';
import { api } from "~/utils/api";
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import handleErrors from "~/utils/handleErrors";
import { Company } from "@prisma/client";
import CompanyTypeToPrismaCompany from "~/utils/CompanyDTO";
import { CompanyType } from "~/schemas/CompanyDaDataType";

export default function CompanySearchDaData() {
    const [input, setInput] = useState("");
    const [hintsVisible, setHintsVisible] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [currentCompany, setCurrentCompany] = useState<CompanyType | undefined>(undefined);
    const [allCompanies, setAllCompanies] = useState<Company[]>([]);

    const getAllCompaniesByClient = api.company.getAllByClient.useQuery(undefined, {
        enabled: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            const companies = await getAllCompaniesByClient.refetch();
            if (companies.data) setAllCompanies(companies.data);
        }

        fetchData()
            .catch(console.error);
    }, [])

    const findCompanyByInfo = api.dadata.findCompaniesByInfo.useQuery({ query: input }, {
        enabled: false,
    });
    const addCompany = api.company.addCompanyToClient.useMutation();
    const removeCompany = api.company.removeCompanyFromClient.useMutation();

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setInput(e.target.value);
        debounceFn(e.target.value);
    }
    const handleDebounceChange = handleErrors(async (inputData: string) => {
        inputData = "";
        await findCompanyByInfo.refetch();
    })
    const debounceFn = useCallback(debounce(handleDebounceChange, 1000), []);

    const handleClickHint = (item: CompanyType) => {
        setCurrentCompany(item);
        setInput(item.value);
        setIsDisabled(true);
    }

    const handleOnBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setHintsVisible(false);
        }
    }

    const handleClearButtonClick = () => {
        setIsDisabled(false);
        setInput("");
        setCurrentCompany(undefined);
    }

    const handleSaveButtonClick = handleErrors(async () => {
        if (currentCompany) {
            setAllCompanies(prevState => [...prevState, CompanyTypeToPrismaCompany(currentCompany)]);
            await addCompany.mutateAsync({ address: currentCompany.data.address.value || "", companyName: currentCompany.value, inn: currentCompany.data.inn || "" });
        }
        handleClearButtonClick();
    })

    const handleClearButtonClickFromList = handleErrors(async (inn: string | undefined) => {
        if (inn) {
            setAllCompanies(prevState => prevState.filter(item => item.inn != inn));
            await removeCompany.mutateAsync({ inn });
        }
    })

    return (
        <>
            <div className="relative" onFocus={() => { setHintsVisible(true) }} onBlur={(e) => handleOnBlur(e)}>
                <div className="grid grid-cols-12 gap-4">
                    <TextField
                        className="col-span-10"
                        onChange={handleInputChange}
                        id="dadata"
                        label="Компания"
                        value={input}
                        disabled={isDisabled}
                    />
                    <div onClick={handleSaveButtonClick} className="col-span-1 flex bg-gray-100 w-fit px-4 py-2 border-2 rounded-lg hover:bg-gray-600 hover:text-white cursor-pointer transition-all justify-center">
                        <SaveIcon className="self-center" />
                    </div>
                    <div onClick={handleClearButtonClick} className="col-span-1 flex bg-gray-100 w-fit px-4 py-2 border-2 rounded-lg hover:bg-gray-600 hover:text-white cursor-pointer transition-all justify-center">
                        <ClearIcon className="self-center" />
                    </div>
                </div>
                {
                    hintsVisible && findCompanyByInfo.data?.suggestions && findCompanyByInfo.data.suggestions.length > 0 &&
                    <div tabIndex={0} className="absolute bg-white w-full h-fit border-gray-300 border-2 mt-1 transition-all">
                        <div className="max-h-[150px] overflow-auto">
                            {
                                findCompanyByInfo.data?.suggestions.map(item => {
                                    return (
                                        <div onClick={() => handleClickHint(item)} key={item?.data?.inn} className="p-2 hover:bg-slate-300 transition-all cursor-pointer">
                                            <div className="text-xl">{item.value || ""}</div>
                                            <div className="flex flex-row text-sm gap-3">
                                                <div>
                                                    ИНН: {item?.data?.inn}
                                                </div>
                                                <div>
                                                    Адрес: {item?.data?.address?.value}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                }


            </div>
            {
                allCompanies.length > 0 &&
                allCompanies.map(item => {
                    return (
                        <div key={item.inn} className="mt-2 grid grid-cols-12 gap-4">
                            <div className="col-span-11 p-2 hover:bg-slate-300 transition-all cursor-pointer">
                                <div className="text-xl">{item.companyName || ""}</div>
                                <div className="flex flex-row text-sm gap-3">
                                    <div>
                                        ИНН: {item.inn}
                                    </div>
                                    <div>
                                        Адрес: {item.address}
                                    </div>
                                </div>
                            </div>
                            <div onClick={() => handleClearButtonClickFromList(item.inn)} className="col-span-1 flex self-center align-middle bg-gray-100 w-fit px-4 py-2 border-2 rounded-lg hover:bg-gray-600 hover:text-white cursor-pointer transition-all justify-center">
                                <ClearIcon className="self-center" />
                            </div>
                        </div>
                    )
                })
            }
        </>
    )
}