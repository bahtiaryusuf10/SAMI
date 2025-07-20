// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformKaryaDosenTerdampakData(rawData: { InfoAgregatKaryaDosen: any; DistribusiTingkatPublikasi: any; TrenPublikasiPerTahun: any; TrenSitasiPerDosen: any; Top5DosenPublikasi: any;
}) {
    return {
        infoAgregatKaryaDosen: {
            data: rawData.InfoAgregatKaryaDosen,
            isLoading: false,
            error: null,
        },
        distribusiTingkatPublikasi: {
            data: rawData.DistribusiTingkatPublikasi,
            isLoading: false,
            error: null,
        },
        trenPublikasiPerTahun: {
            data: rawData.TrenPublikasiPerTahun,
            isLoading: false,
            error: null,
        },
        trenSitasiPerDosen: {
            data: rawData.TrenSitasiPerDosen,
            isLoading: false,
            error: null,
        },
        top5DosenPublikasi: {
            data: rawData.Top5DosenPublikasi,
            isLoading: false,
            error: null,
        },
    };
}