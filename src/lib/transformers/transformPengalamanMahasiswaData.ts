// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformPengalamanMahasiswaData(rawData: { InfoAgregatMahasiswa: any; PrestasiMahasiswa: any; Top5MitraMbkm: any; DistribusiMbkm: any; KorelasiPrestasiDanIpk: any;
}) {
    return {
        infoAgregatMahasiswa: {
            data: rawData.InfoAgregatMahasiswa,
            isLoading: false,
            error: null,
        },
        prestasiMahasiswa: {
            data: rawData.PrestasiMahasiswa,
            isLoading: false,
            error: null,
        },
        top5MitraMbkm: {
            data: rawData.Top5MitraMbkm,
            isLoading: false,
            error: null,
        },
        distribusiMbkm: {
            data: rawData.DistribusiMbkm,
            isLoading: false,
            error: null,
        },
        korelasiPrestasiDanIpk: {
            data: rawData.KorelasiPrestasiDanIpk,
            isLoading: false,
            error: null,
        },
        importLog: { data: [], isLoading: false, error: null },
    };
}