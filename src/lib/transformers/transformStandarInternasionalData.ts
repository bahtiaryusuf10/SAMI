// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformStandarInternasionalData(rawData: { InfoAkreditasi: any;
}) {
    return {
        infoAkreditasi: {
            data: rawData.InfoAkreditasi,
            isLoading: false,
            error: null,
        },
        importLog: { data: [], isLoading: false, error: null },
    };
}