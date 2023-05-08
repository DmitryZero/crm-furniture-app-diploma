import { Company } from "@prisma/client";
import { CompanyType } from "~/schemas/CompanyDaDataType";

export default function CompanyTypeToPrismaCompany(companyType: CompanyType): Company {
    const company: Company = {
        address: companyType.data.address.value || "",
        companyName: companyType.value,
        inn: companyType.data.inn || "",
        companyId: ""
    }

    return company;
}