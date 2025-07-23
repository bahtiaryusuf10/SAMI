// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformLulusanBekerjaData(rawData: { LokasiBekerja: any; StatusLulusan: any; WaktuTungguBekerja: any; Penghasilan: any; InfoAgregatLulusan: any; }) {
  return {
    lokasiBekerja: {
      data: rawData.LokasiBekerja,
      isLoading: false,
      error: null,
    },
    statusLulusan: {
      data: rawData.StatusLulusan,
      isLoading: false,
      error: null,
    },
    waktuTungguBekerja: {
      data: rawData.WaktuTungguBekerja,
      isLoading: false,
      error: null,
    },
    rentangPenghasilan: {
      data: rawData.Penghasilan,
      isLoading: false,
      error: null,
    },
    infoAgregatLulusan: {
      data: rawData.InfoAgregatLulusan,
      isLoading: false,
      error: null,
    },
    importLog: { data: [], isLoading: false, error: null },
  };
}