// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformKelasKolaboratifData(rawData: { InfoAgregatKelasKolaboratif: any; DistribusiCaseProject: any; Top5DosenCaseProject: any; DistribusiJenisMataKuliah: any; DistribusiMetodeMataKuliah: any;
}) {
    return {
        infoAgregatKelasKolaboratif: {
            data: rawData.InfoAgregatKelasKolaboratif,
            isLoading: false,
            error: null,
        },
        distribusiCaseProject: {
            data: rawData.DistribusiCaseProject,
            isLoading: false,
            error: null,
        },
        top5DosenCaseProject: {
            data: rawData.Top5DosenCaseProject,
            isLoading: false,
            error: null,
        },
        distribusiJenisMataKuliah: {
            data: rawData.DistribusiJenisMataKuliah,
            isLoading: false,
            error: null,
        },
        distribusiMetodeMataKuliah: {
            data: rawData.DistribusiMetodeMataKuliah,
            isLoading: false,
            error: null,
        },
    };
}