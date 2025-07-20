// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformKerjaSamaGlobalData(rawData: { InfoAgregatKerjaSama: any; TrenKerjaSamaPerTahun: any; DistribusiStatusKerjaSama: any; DistribusiTingkatKerjaSama: any; DistribusiJenisMitra: any;
}) {
    return {
        infoAgregatKerjaSama: {
            data: rawData.InfoAgregatKerjaSama,
            isLoading: false,
            error: null,
        },
        trenKerjaSamaPerTahun: {
            data: rawData.TrenKerjaSamaPerTahun,
            isLoading: false,
            error: null,
        },
        distribusiStatusKerjaSama: {
            data: rawData.DistribusiStatusKerjaSama,
            isLoading: false,
            error: null,
        },
        distribusiTingkatKerjaSama: {
            data: rawData.DistribusiTingkatKerjaSama,
            isLoading: false,
            error: null,
        },
        distribusiJenisMitra: {
            data: rawData.DistribusiJenisMitra,
            isLoading: false,
            error: null,
        },
    };
}