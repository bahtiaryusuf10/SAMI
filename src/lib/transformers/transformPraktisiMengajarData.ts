// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformPraktisiMengajarData(rawData: { InfoAgregatPraktisi: any; DistribusiJabatanDosen: any; Top5MataKuliah: any; DistribusiPerusahaan: any; SertifikasiProfesi: any;
}) {
    return {
        infoAgregatPraktisi: {
            data: rawData.InfoAgregatPraktisi,
            isLoading: false,
            error: null,
        },
        distribusiJabatanDosen: {
            data: rawData.DistribusiJabatanDosen,
            isLoading: false,
            error: null,
        },
        top5MataKuliah: {
            data: rawData.Top5MataKuliah,
            isLoading: false,
            error: null,
        },
        distribusiPerusahaan: {
            data: rawData.DistribusiPerusahaan,
            isLoading: false,
            error: null,
        },
        sertifikasiProfesi: {
            data: rawData.SertifikasiProfesi,
            isLoading: false,
            error: null,
        },
        importLog: { data: [], isLoading: false, error: null },
    };
}