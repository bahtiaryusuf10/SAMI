// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformMainData(rawData: { InfoAgregatRingkasan: any; InfoAgregatTambahan: any; DetailCapaianKpi: any; DistribusiCapaianKpi: any; TrenSkorCapaianKpi: any; }) {
  return {
    infoAgregatRingkasan: {
      data: rawData.InfoAgregatRingkasan,
      isLoading: false,
      error: null,
    },
    infoAgregatTambahan: {
      data: rawData.InfoAgregatTambahan,
      isLoading: false,
      error: null,
    },
    detailCapaianKpi: {
      data: rawData.DetailCapaianKpi,
      isLoading: false,
      error: null,
    },
    distribusiCapaianKpi: {
      data: rawData.DistribusiCapaianKpi,
      isLoading: false,
      error: null,
    },
    trenSkorCapaianKpi: {
      data: rawData.TrenSkorCapaianKpi,
      isLoading: false,
      error: null,
    },
  };
}