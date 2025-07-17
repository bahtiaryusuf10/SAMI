// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformAktivitasDosenData(rawData: { InfoAgregatAktivitasDosen: any; DistribusiPersentaseAktivitasDosen: any; DistribusiAktivitasDosen: any; DistribusiMembinaLomba: any; SumberDanaPenelitianPkm: any;
}) {
    return {
        infoAgregatAktivitasDosen: {
            data: rawData.InfoAgregatAktivitasDosen,
            isLoading: false,
            error: null,
        },
        distribusiPersentaseAktivitasDosen: {
            data: rawData.DistribusiPersentaseAktivitasDosen,
            isLoading: false,
            error: null,
        },
        distribusiAktivitasDosen: {
            data: rawData.DistribusiAktivitasDosen,
            isLoading: false,
            error: null,
        },
        distribusiMembinaLomba: {
            data: rawData.DistribusiMembinaLomba,
            isLoading: false,
            error: null,
        },
        sumberDanaPenelitianPkm: {
            data: rawData.SumberDanaPenelitianPkm,
            isLoading: false,
            error: null,
        },
    };
}