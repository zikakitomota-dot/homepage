"""Original A4 listening/speaking companion, kept separate from Detektif Bunyi."""
import json,os
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph,Table,TableStyle
from reportlab.lib.styles import ParagraphStyle
from pypdf import PdfReader
pdfmetrics.registerFont(TTFont('DengarArial','C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('DengarBold','C:/Windows/Fonts/arialbd.ttf'))
W,H=A4;M=42
styles={size:ParagraphStyle('d'+str(size),fontName='DengarArial',fontSize=size,leading=size*1.5,textColor='#111827')for size in [9,10,11,12,14,22,28]}
items=json.loads(Path('lib/learning/dengar-sebut-pilih-audio.json').read_text(encoding='utf-8'))
dest=Path('public/downloads/dengar-sebut-pilih-aktiviti.pdf');dest.parent.mkdir(parents=True,exist_ok=True)
c=canvas.Canvas(str(dest),pagesize=A4);c.setTitle('Dengar, Sebut dan Pilih - Aktiviti Pendamping');c.setAuthor('Zalea Studio')
def text(value,x,y,width=W-2*M,size=12):
 p=Paragraph(value,styles[size]);_,h=p.wrap(width,H);p.drawOn(c,x,y-h);return y-h
def header(number,title,note):
 c.setFont('DengarBold',10);c.drawString(M,H-35,'ZALEA STUDIO / BAHASA MELAYU TAHUN 1 (SK)')
 text(title,M,H-67,size=22);text(note,M,H-116,size=11)
 c.setStrokeColorRGB(.2,.2,.2);c.line(M,45,W-M,45);c.setFont('DengarArial',9);c.drawString(M,29,'Latihan mendengar dan bertutur bersama pendamping');c.drawRightString(W-M,29,str(number)+' / 8')
def end():c.showPage()
def cards(values,cols,top,height,font=22):
 gap=12;width=(W-2*M-gap*(cols-1))/cols
 for i,value in enumerate(values):
  row,col=divmod(i,cols);x=M+col*(width+gap);y=top-row*(height+gap)
  c.roundRect(x,y-height,width,height,7)
  text(value,x+12,y-15,width-24,font)

header(1,'Dengar, Sebut dan Pilih','Panduan ibu bapa/guru dan rujukan kurikulum')
y=H-174
for title,body in [
 ('Mainkan bunyi dahulu','Semak audio tanpa murid terlebih dahulu. Audio sintetik telah disemak dan diluluskan oleh pemilik Zalea Studio pada 13 November 2026. Mainkan audio sebenar sebelum meminta murid memilih kad. Pendamping juga boleh memberikan model lisan yang sesuai.'),
 ('Empat misi berbeza','1 Dengar Abjad: kenal nama huruf. 2 Dengar Suku Kata: kenal suku kata termasuk rentak asal. 3 Dengar Perkataan dan Ujaran: kenal perkataan, frasa dan intonasi. 4 Sebut Semula: cuba model secara lisan.'),
 ('Bezakan bukti kemahiran','Membaca kad atau memadankan tulisan sahaja tidak membuktikan kemahiran mendengar. Tanda latihan lisan bermaksud murid mencuba; ia bukan penilaian automatik terhadap ketepatan sebutan.'),
 ('Rujukan sementara','Bahasa Melayu Tahun 1, Sekolah Kebangsaan (SK), KP2027. SP 1.1.2 dan 1.1.3 untuk mendengar; SP 2.1.2 dan 2.1.3 untuk latihan bertutur. Huraian di sini ialah fungsi aktiviti, bukan petikan lafaz rasmi.'),
 ('Status penjajaran','Berdasarkan bahan penataran KP2027; pengesahan terhadap Dokumen Kurikulum akhir masih belum selesai. Tiada pengendorsan KPM atau pensijilan Tahap Penguasaan.'),
 ]:
 y=text('<b>'+title+'</b>',M,y,size=14)-5;y=text(body,M,y,size=11)-17
end()

header(2,'Kad nama huruf','Dengar nama huruf, kemudian pilih kad. Nama huruf bukan bunyi fonem dalam perkataan.')
letters=[item['text']for item in items if item['kind']=='letter']
cards(letters,3,H-170,88,28)
text('Pendamping: sebut/modelkan nama huruf mengikut konvensyen Malaysia. Semak A, E, I dan U dengan teliti. Jangan membaca jawapan kepada murid selepas audio sebagai petunjuk tersembunyi.',M,140,size=11)
end()

header(3,'Kad suku kata','Dengar suku kata KV, pilih kad dan cuba sebut semula. Ini bukan latihan mengeja nama huruf.')
syllables=[item['text']for item in items if item['kind']=='syllable']
cards(syllables,4,H-170,70,22)
y=text('<b>Rentak asal: Dengar, ikut dan pilih</b>',M,245,size=14)-10
y=text('ba - bi - bu | ma - mi - mu<br/>Ketuk lembut pada setiap suku kata. Beri ruang untuk suara; jangan menindih audio. Lagu sedia ada tidak digunakan.',M,y,size=12)-15
text('Pendamping boleh menukar giliran: modelkan satu kumpulan, kemudian murid mencuba. Latihan tanpa rakaman tidak disimpan atau dihantar oleh laman.',M,y,size=11)
end()

header(4,'Kad perkataan','Dengar satu perkataan, pilih kad dan bincangkan maksudnya. Padanan visual ialah aktiviti tambahan.')
words=[item['text']for item in items if item['kind']=='word']
cards(words,3,H-170,65,22)
y=text('<b>Padanan visual tambahan</b>',M,245,size=14)-12
y=text('Padankan 1-3 dengan A-C. Aktiviti ini menggunakan tulisan sahaja, bukan bukti mendengar.<br/>1 buku &nbsp;&nbsp; 2 ibu &nbsp;&nbsp; 3 adik<br/>A ibu saya &nbsp;&nbsp; B adik kecil &nbsp;&nbsp; C buku biru',M,y,size=12)-14
text('Jawapan: 1 ____  2 ____  3 ____',M,y,size=12)
end()

header(5,'Frasa dan ujaran pendek','Mainkan/sebut satu model dengan intonasi yang sesuai. Murid memilih kad, kemudian cuba sebut semula.')
phrases=[item['text']for item in items if item['kind']=='utterance']
cards(phrases,2,H-170,86,14)
text('Gunakan permintaan yang sopan dan soalan yang semula jadi. Jangan menilai sebutan murid berdasarkan loghat tunggal. Model sintetik perlu disemak sebelum digunakan sebagai contoh.',M,155,size=11)
end()

header(6,'Dengar intonasi dalam konteks','Pendamping perlu memainkan dua model yang jelas berbeza, bukan hanya menunjukkan tanda baca.')
y=H-180
for title,body in [
 ('1. Memberitahu atau meminta kepastian?','Ini buku saya. / Ini buku saya?<br/>Model pertama memberitahu tentang pemilikan. Model kedua meminta kepastian. Pilih konteks yang jelas dan jangan memaksa kenaikan nada yang berlebihan.'),
 ('2. Penjelasan ringkas','buku biru / Buku biru?<br/>Frasa neutral menamakan buku. Bentuk pertanyaan meminta kepastian. Jika rakaman tidak cukup berbeza, tangguhkan soalan dan gantikan model dahulu.'),
 ('3. Sopan dan mesra','Selamat pagi. / Apa khabar? / Terima kasih.<br/>Bincangkan tujuan ujaran selepas mendengar. Murid boleh mencuba model dengan pendamping; laman tidak menilai suara.'),
 ('4. Respons murid selepas audio','Model yang dimainkan: __________________________<br/>Apa yang murid pilih/sebut: ______________________<br/>[  ] Mendengar audio sebenar   [  ] Bacaan visual sahaja<br/>[  ] Cuba sebut semula   [  ] Diperhati pendamping'),
 ]:
 y=text('<b>'+title+'</b>',M,y,size=14)-8;y=text(body,M,y,size=12)-22
text('Tidak semua soalan mempunyai pola nada akhir yang sama. Tanda baca ialah sokongan bertulis; bukti mendengar memerlukan model audio atau model lisan yang sesuai.',M,y,size=11)
end()

header(7,'Senarai semak pendamping','Tidak perlu mencatat nama, tarikh lahir atau merakam suara. Pemerhatian adalah pilihan.')
rows=[['Aktiviti','Belum dicuba','Sudah berlatih','Diperhati'],
 ['Nama huruf','[  ]','[  ]','[  ]'],['Suku kata KV','[  ]','[  ]','[  ]'],['Rentak asal','[  ]','[  ]','[  ]'],['Perkataan/frasa','[  ]','[  ]','[  ]'],['Intonasi ujaran','[  ]','[  ]','[  ]'],['Sebut semula','[  ]','[  ]','[  ]']]
t=Table(rows,colWidths=[200,100,110,100],rowHeights=42);t.setStyle(TableStyle([('FONTNAME',(0,0),(-1,-1),'DengarArial'),('FONTSIZE',(0,0),(-1,-1),10),('GRID',(0,0),(-1,-1),.5,'#333333'),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),8)]));t.wrapOn(c,510,300);t.drawOn(c,M,H-470)
y=H-505
for line in [
 '<b>Bukti yang digunakan</b><br/>[  ] Audio/model lisan   [  ] Tulisan/gambar sahaja<br/>[  ] Pilihan jawapan   [  ] Latihan lisan kendiri',
 '<b>Catatan tanpa maklumat peribadi</b><br/>Bunyi/ujaran untuk diulang: ______________________<br/>Bantuan pendamping: ___________________________<br/>Langkah latihan seterusnya: _____________________',
 'Sudah berlatih tidak bermaksud sebutan disahkan betul. Pemerhatian pendamping bukan pensijilan rasmi atau Tahap Penguasaan KPM.',
 ]:y=text(line,M,y,size=11)-20
end()

header(8,'Jawapan, sumber dan batasan','Gunakan jawapan hanya apabila audio/model yang sepadan benar-benar diberikan.')
y=H-174
for title,body in [
 ('Padanan visual halaman 4','1-C (buku - buku biru); 2-A (ibu - ibu saya); 3-B (adik - adik kecil). Padanan ini tidak menguji mendengar.'),
 ('Kad mendengar','Halaman 2, 3 dan 5: jawapan bergantung pada model yang dimainkan. Gunakan kad yang sepadan dengan transkrip rakaman yang telah disemak. Jangan meneka daripada susunan kad.'),
 ('Rentak halaman 3','Urutan ialah ba, bi, bu; kemudian ma, mi, mu. Ini susunan asal Zalea Studio, bukan lagu berhak cipta yang dipinjam.'),
 ('Intonasi dan latihan lisan','Halaman 6: bentuk “Ini buku saya.” memberitahu; “Ini buku saya?” meminta kepastian dalam konteks latihan ini. Terima bentuk sebutan Malaysia yang sah. Tiada satu skor automatik untuk sebutan murid.'),
 ('Rujukan kurikulum','SP 1.1.2, SP 1.1.3, SP 2.1.2 dan SP 2.1.3; Bahasa Melayu Tahun 1 (SK), KP2027. Berdasarkan bahan penataran KP2027; pengesahan terhadap Dokumen Kurikulum akhir masih belum selesai.'),
 ]:y=text('<b>'+title+'</b>',M,y,size=12)-5;y=text(body,M,y,size=11)-14
y=text('KPM: <link href="https://www.moe.gov.my/kurikulum-persekolahan-2027">moe.gov.my/kurikulum-persekolahan-2027</link><br/>Penataran: <link href="https://sites.google.com/moe-dl.edu.my/kpbmthn1jb2027/home">sites.google.com/moe-dl.edu.my/kpbmthn1jb2027/home</link>',M,y,size=9)-12
text('Audio sintetik: Chatterbox Multilingual ONNX (MIT). Notis dan asal audio berada dalam panel sumber permainan. Pemilik Zalea Studio mengesahkan semakan dan kelulusan semua audio pada 13 November 2026. PDF ini tidak mengandungi rakaman audio; gunakan model pada halaman permainan atau model lisan pendamping.',M,y,size=10)
end();c.save()
reader=PdfReader(dest);assert len(reader.pages)==8
assert all(abs(float(page.mediabox.width)-W)<1 and abs(float(page.mediabox.height)-H)<1 for page in reader.pages)
qa=Path(os.environ.get('ZALEA_PRINTABLE_QA_DIR','qa/dengar-sebut-pilih-printable'));qa.mkdir(parents=True,exist_ok=True)
(qa/'printable-text.txt').write_text('\n\n'.join(page.extract_text()for page in reader.pages),encoding='utf-8')
Path('output/pdf').mkdir(parents=True,exist_ok=True);Path('output/pdf/dengar-sebut-pilih-aktiviti.pdf').write_bytes(dest.read_bytes())
print(str(dest),dest.stat().st_size,'bytes; 8 A4 pages')
