export type AlignmentStatus = 'verified' | 'provisional' | 'enrichment';
export type CurriculumActivity = {
  activityId: string; slug: string; title: string; activityType: 'game'; route: string;
  countryCode: string; countryName: string; curriculumId: string; curriculumName: string; curriculumVersion: string;
  schoolLevel: string; schoolType: string; schoolYear: string; subjectId: string; subjectName: string;
  learningStandards: { code: string; functionalDescription: string; wordingVerified: boolean }[];
  learningObjectives: string[]; skillsPractised: string[]; assessmentMethods: string[];
  sourceReferences: { title: string; url: string }[]; alignmentStatus: AlignmentStatus;
  verificationNotes: string; printableResources: { title: string; path: string }[]; availabilityStatus: 'available';
};
export const malaysiaCurriculumPath = '/learning/malaysia/curriculum';
export const bahasaMelayuPath = malaysiaCurriculumPath + '/primary/tahun-1/bahasa-melayu';
export const detektifBunyiPath = bahasaMelayuPath + '/detektif-bunyi';
export const dengarSebutPilihPath = bahasaMelayuPath + '/dengar-sebut-pilih';
export const alignmentDisclosure = 'Berdasarkan bahan penataran KP2027; pengesahan terhadap Dokumen Kurikulum akhir masih belum selesai.';
export const detektifBunyi: CurriculumActivity = {
  activityId: 'my-bm-sound-detective', slug: 'detektif-bunyi', title: 'Detektif Bunyi', activityType: 'game', route: detektifBunyiPath,
  countryCode: 'MY', countryName: 'Malaysia', curriculumId: 'my-kp', curriculumName: 'Kurikulum Persekolahan 2027', curriculumVersion: 'KP2027',
  schoolLevel: 'Sekolah Rendah', schoolType: 'Sekolah Kebangsaan (SK)', schoolYear: 'Tahun 1', subjectId: 'bahasa-melayu', subjectName: 'Bahasa Melayu',
  learningStandards: [
    { code: 'SP 1.1.1', functionalDescription: 'Mengenal pasti bunyi persekitaran melalui aktiviti mendengar.', wordingVerified: false },
    { code: 'SP 2.1.1', functionalDescription: 'Meniru bunyi persekitaran melalui latihan bertutur.', wordingVerified: false },
  ],
  learningObjectives: ['Mendengar dan mengenal pasti sumber bunyi persekitaran.', 'Mencuba meniru bunyi dengan bimbingan pendamping.'],
  skillsPractised: ['Mendengar', 'Mengenal pasti', 'Meniru bunyi'],
  assessmentMethods: ['Pilihan jawapan untuk aktiviti mendengar', 'Catatan latihan bertutur dan pemerhatian pendamping secara pilihan'],
  sourceReferences: [
    { title: 'KPM: Kurikulum Persekolahan 2027', url: 'https://www.moe.gov.my/kurikulum-persekolahan-2027' },
    { title: 'Bahan penataran BM Tahun 1 Johor Bahru 2026', url: 'https://sites.google.com/moe-dl.edu.my/kpbmthn1jb2027/home' },
  ],
  alignmentStatus: 'provisional', verificationNotes: alignmentDisclosure,
  printableResources: [{ title: 'Detektif Bunyi - Aktiviti Mendengar dan Bertutur (A4 PDF)', path: '/downloads/detektif-bunyi-aktiviti.pdf' }],
  availabilityStatus: 'available',
};
export const dengarSebutPilih: CurriculumActivity = {
  ...detektifBunyi,
  activityId:'my-bm-listen-say-choose',slug:'dengar-sebut-pilih',title:'Dengar, Sebut dan Pilih',route:dengarSebutPilihPath,
  learningStandards:[
    {code:'SP 1.1.2',functionalDescription:'Mendengar untuk mengenal nama huruf dan bunyi suku kata melalui rentak dan permainan bahasa.',wordingVerified:false},
    {code:'SP 1.1.3',functionalDescription:'Mendengar sebutan perkataan, frasa dan ujaran dengan intonasi yang sesuai.',wordingVerified:false},
    {code:'SP 2.1.2',functionalDescription:'Berlatih menyebut huruf dan suku kata melalui rentak dan permainan bahasa.',wordingVerified:false},
    {code:'SP 2.1.3',functionalDescription:'Berlatih menyebut semula perkataan, frasa dan ujaran yang didengar dengan sebutan dan intonasi yang sesuai.',wordingVerified:false},
  ],
  learningObjectives:['Membezakan nama huruf daripada bunyi suku kata.','Mengenal perkataan, frasa dan ujaran yang didengar.','Mendengar perbezaan intonasi dalam konteks yang jelas.','Mencuba sebutan semula dengan bimbingan pilihan.'],
  skillsPractised:['Mendengar','Nama huruf','Suku kata','Perkataan dan ujaran','Intonasi','Latihan bertutur'],
  assessmentMethods:['Pilihan jawapan berasaskan audio dalam tiga misi mendengar','Latihan lisan kendiri dan pemerhatian pendamping secara pilihan'],
  printableResources:[{title:'Dengar, Sebut dan Pilih - Aktiviti Pendamping (A4 PDF)',path:'/downloads/dengar-sebut-pilih-aktiviti.pdf'}],
};
export const curriculumActivities: readonly CurriculumActivity[] = [detektifBunyi,dengarSebutPilih];
// School-year labels live in collection data, never in shared route/progress logic.
export const learningCollections = [{ countryCode: 'MY', countrySlug: 'malaysia', countryName: 'Malaysia', yearLabel: 'Tahun 1', schoolLabel: 'Sekolah Rendah' }] as const;
export const learningPages = [
  { path: '/learning', title: 'Learning Collections', description: 'Choose a structured learning collection by country and curriculum. General games remain a separate, flexible pathway.', paragraphs: ['Start with the Malaysian collection for a short Bahasa Melayu listening and speaking activity. Each activity explains its curriculum references, assessment limits and local progress.', 'Prefer open-ended practice? General Learning Games, Learning Missions and Worksheet Studio remain available without a curriculum alignment claim.'], next: '/learning/malaysia', nextLabel: 'Explore Malaysia' },
  { path: '/learning/malaysia', title: 'Pembelajaran Malaysia', description: 'Aktiviti untuk keluarga dan pendidik di Malaysia, disusun mengikut koleksi kurikulum yang dinyatakan.', paragraphs: ['Mulakan dengan koleksi sekolah rendah. Detektif Bunyi ialah aktiviti pertama untuk Bahasa Melayu Tahun 1 SK.', 'Permainan umum Zalea Studio tetap boleh digunakan sebagai aktiviti tambahan. Permainan tersebut tidak dilabel secara automatik sebagai sejajar dengan KP2027.'], next: malaysiaCurriculumPath, nextLabel: 'Kurikulum sekolah Malaysia' },
  { path: malaysiaCurriculumPath, title: 'Kurikulum Sekolah Malaysia', description: 'Pilih koleksi mengikut peringkat sekolah, tahun dan subjek. Hanya aktiviti yang tersedia dipaparkan.', paragraphs: ['Koleksi pertama menggunakan rujukan penataran Kurikulum Persekolahan 2027. Status penjajaran setiap aktiviti dinyatakan supaya ibu bapa dan guru dapat menilai kesesuaiannya.', alignmentDisclosure], next: malaysiaCurriculumPath + '/primary', nextLabel: 'Sekolah Rendah' },
  { path: malaysiaCurriculumPath + '/primary', title: 'Koleksi Sekolah Rendah', description: 'Latihan ringkas yang boleh dilakukan bersama pendamping, tanpa akaun atau pemasa.', paragraphs: ['Koleksi kini tersedia untuk Tahun 1: Bahasa Melayu di Sekolah Kebangsaan. Aktiviti mendengar menggunakan rakaman bunyi sebenar; latihan bertutur dilakukan secara lisan tanpa mikrofon.', 'Pilih tahun untuk melihat objektif, cara bermain dan bahan cetak yang berkaitan. Tiada koleksi tahun lain diterbitkan buat masa ini.'], next: malaysiaCurriculumPath + '/primary/tahun-1', nextLabel: 'Tahun 1' },
  { path: malaysiaCurriculumPath + '/primary/tahun-1', title: 'Pembelajaran Tahun 1', description: 'Aktiviti Bahasa Melayu untuk murid Tahun 1 Sekolah Kebangsaan, sekitar umur tujuh tahun.', paragraphs: ['Mulakan dengan bunyi yang biasa didengar di rumah, sekitar sekolah dan alam. Pendamping boleh membantu membaca arahan dan melaraskan kelantangan.', 'Kesukaran permainan ialah tetapan Zalea Studio. Ia bukan gred atau Tahap Penguasaan rasmi KPM.'], next: bahasaMelayuPath, nextLabel: 'Bahasa Melayu Tahun 1 (SK)' },
  { path: bahasaMelayuPath, title: 'Bahasa Melayu Tahun 1 (SK)', description: 'Terokai bunyi persekitaran, nama huruf, suku kata dan ujaran melalui dua aktiviti mendengar dan bertutur.', paragraphs: ['Misi mendengar menyemak pilihan jawapan secara interaktif. Misi bertutur merekod latihan yang telah dicuba; sebutan tidak dinilai secara automatik.', 'Gunakan bahan A4 bersama audio atau bunyi yang dihasilkan oleh pendamping. Padanan gambar sahaja tidak membuktikan kemahiran mendengar.'], next: detektifBunyiPath, nextLabel: 'Main Detektif Bunyi' },
] as const;
export const curriculumRoutes = [...learningPages.map(page => page.path), ...curriculumActivities.map(activity=>activity.route)];
