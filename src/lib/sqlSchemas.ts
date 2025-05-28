export const sqlSchemas = {
  detail_lulusan: {
    columns: [
      { name: 'id', type: 'uuid' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'tahun', type: 'int2' },
      { name: 'nama', type: 'text' },
      { name: 'jenis_pekerjaan', type: 'text' },
      { name: 'sesuai_bidang', type: 'bool' },
      { name: 'waktu_tunggu', type: 'float4' },
      { name: 'gaji', type: 'int4' },
      {
        name: 'status_bekerja',
        type: 'text',
        enum: ['Bekerja', 'Studi Lanjut', 'Belum Terlacak'],
      },
    ],
  },
  status_lulusan: {
    columns: [
      { name: 'id', type: 'uuid' },
      { name: 'status', type: 'text' },
      { name: 'jumlah', type: 'int4' },
    ],
  },

  program_studi: {
    columns: [
      { name: 'id', type: 'uuid' },
      { name: 'nama_prodi', type: 'text' },
      { name: 'jenjang', type: 'text' },
    ],
  },

  kategori_pekerjaan: {
    columns: [
      { name: 'id', type: 'uuid' },
      { name: 'kategori', type: 'text' },
    ],
  },
};
