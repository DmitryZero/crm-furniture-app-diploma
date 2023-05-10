type CompanySuggestionType = {
    suggestions: Array<CompanyType>
}

type CompanyType = {
    value: string,
    unrestricted_value: string,
    data: {
        kpp: string,
        capital: null,
        invalid: null,
        management: null,
        founders: null,
        managers: null,
        predecessors: null,
        successors: null,
        branch_type: "MAIN",
        branch_count: 0,
        source: null,
        qc: null,
        hid: "string",
        type: "LEGAL",
        state: {
            status: "ACTIVE",
            code: null,
            actuality_date: number,
            registration_date: number,
            liquidation_date: null
        },
        opf: {
            type: string,
            code: string,
            full: string,
            short: string
        },
        name: {
            full_with_opf: string,
            short_with_opf: string,
            latin: null,
            full: string,
            short: string
        },
        inn: string,
        ogrn: string,
        okpo: string,
        okato: string,
        oktmo: string,
        okogu: string,
        okfs: string,
        okved: string,
        okveds: null,
        authorities: null,
        documents: null,
        licenses: null,
        finance: null,
        address: {
            value: string,
            unrestricted_value: string,
            invalidity: null,
            data: {
                postal_code: string,
                country: string,
                country_iso_code: string,
                federal_district: string,
                region_fias_id: string,
                region_kladr_id: string,
                region_iso_code: string,
                region_with_type: string,
                region_type: string,
                region_type_full: string,
                region: string,
                area_fias_id: string,
                area_kladr_id: string,
                area_with_type: string,
                area_type: string,
                area_type_full: string,
                area: string,
                city_fias_id: string,
                city_kladr_id: string,
                city_with_type: string,
                city_type: string,
                city_type_full: string,
                city: string,
                city_area: null,
                city_district_fias_id: null,
                city_district_kladr_id: null,
                city_district_with_type: null,
                city_district_type: null,
                city_district_type_full: null,
                city_district: null,
                settlement_fias_id: null,
                settlement_kladr_id: null,
                settlement_with_type: null,
                settlement_type: null,
                settlement_type_full: null,
                settlement: null,
                street_fias_id: string,
                street_kladr_id: string,
                street_with_type: string,
                street_type: string,
                street_type_full: string,
                street: string,
                stead_fias_id: null,
                stead_cadnum: null,
                stead_type: null,
                stead_type_full: null,
                stead: null,
                house_fias_id: null,
                house_kladr_id: null,
                house_cadnum: null,
                house_type: null,
                house_type_full: null,
                house: null,
                block_type: null,
                block_type_full: null,
                block: null,
                entrance: null,
                floor: null,
                flat_fias_id: null,
                flat_cadnum: null,
                flat_type: null,
                flat_type_full: null,
                flat: null,
                flat_area: null,
                square_meter_price: null,
                flat_price: null,
                room_fias_id: null,
                room_cadnum: null,
                room_type: null,
                room_type_full: null,
                room: null,
                postal_box: null,
                fias_id: string,
                fias_code: string,
                fias_level: string,
                fias_actuality_state: string,
                kladr_id: string,
                geoname_id: string,
                capital_marker: string,
                okato: string,
                oktmo: string,
                tax_office: string,
                tax_office_legal: string,
                timezone: string,
                geo_lat: string,
                geo_lon: string,
                beltway_hit: null,
                beltway_distance: null,
                metro: null,
                divisions: null,
                qc_geo: string,
                qc_complete: null,
                qc_house: null,
                history_values: null,
                unparsed_parts: null,
                source: string,
                qc: string,
                emails: null,
                ogrn_date: number,
                okved_typestring2014stringemployee_count: null
            }
        }
    }
}

export type {CompanyType, CompanySuggestionType};