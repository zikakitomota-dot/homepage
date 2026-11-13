"""Reproducible original A4 companion; no learner data or production services."""
import sys, json
from pathlib import Path
sys.path.insert(0,str(Path('qa/detektif-bunyi-20261111/python-deps').resolve()))
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.graphics import renderPDF
from svglib.svglib import svg2rlg
from pypdf import PdfReader

pdfmetrics.registerFont(TTFont('Arial','C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('ArialBold','C:/Windows/Fonts/arialbd.ttf'))
styles={size:ParagraphStyle('s'+str(size),fontName='Arial',fontSize=size,leading=size*1.5,textColor='#111827') for size in [10,11,12,14,22,30]}
W,H=A4; margin=42; out=Path('public/downloads/detektif-bunyi-aktiviti.pdf');out.parent.mkdir(parents=True,exist_ok=True)
c=canvas.Canvas(str(out),pagesize=A4)
c.setTitle('Detektif Bunyi - Aktiviti Mendengar dan Bertutur')
c.setAuthor('Zalea Studio')
data=json.loads(Path('lib/learning/sounds.json').read_text(encoding='utf-8'))
def text(value,x,y,width=W-84,size=12):
    p=Paragraph(value,styles[size]);_,height=p.wrap(width,H);p.drawOn(c,x,y-height);return y-height
def picture(icon,x,y,size=60):
    d=svg2rlg('public/images/learning/sounds/'+icon+'.svg'); d.scale(size/64,size/64);renderPDF.draw(d,c,x,y)
def header(number,title,note):
    c.setFont('ArialBold',10);c.drawString(margin,H-35,'ZALEA STUDIO  /  DETEKTIF BUNYI')
    text(title,margin,H-67,size=22);text(note,margin,H-112,size=11)
    c.setStrokeColorRGB(.2,.2,.2);c.line(margin,45,W-margin,45);c.setFont('Arial',9);c.drawString(margin,29,'Bahasa Melayu Tahun 1 (SK) | Latihan bersama pendamping');c.drawRightString(W-margin,29,str(number)+' / 6')
def finish(): c.showPage()

header(1,'Detektif Bunyi','Aktiviti Mendengar dan Bertutur | Bahasa Melayu Tahun 1 (SK)')
text('Dengar. Cari. Cuba tiru.',margin,H-180,size=30)
for index,id in enumerate(['cat','bell','rain','clock']):picture(id,margin+index*125,H-330,75)
y=H-365
for title,body in [
('1. Sediakan bunyi sebenar','Buka permainan Detektif Bunyi dalam pratonton atau laman yang sedang digunakan. Pendamping boleh memainkan rakaman yang sepadan atau menghasilkan bunyi yang sesuai. Mulakan dengan kelantangan yang selesa.'),
('2. Pilih cara berlatih','Potong kad pada halaman 2 jika mahu. Gunakan halaman 3 untuk padanan visual. Gunakan halaman 4 untuk mendengar tanpa menunjukkan jawapan dahulu.'),
('3. Cuba dan perhatikan','Gunakan halaman 5 untuk meniru bunyi dan mencatat pemerhatian. Jangan paksa suara yang kuat. Tiada rakaman atau penilaian sebutan automatik.'),
]:
    y=text('<b>'+title+'</b>',margin,y,size=14)-6;y=text(body,margin,y,size=11)-18
text('Padanan gambar sahaja tidak menilai kemahiran mendengar. Aktiviti ini bukan pensijilan KPM atau Tahap Penguasaan rasmi.',margin,y,size=11)
finish()

header(2,'Kad sumber bunyi','Kenali gambar dahulu. Untuk ujian mendengar, jangan tunjukkan kad jawapan sebelum bunyi dimainkan.')
for i,s in enumerate(data):
    row,col=divmod(i,2);x=margin+col*260;y=H-165-row*119
    c.setStrokeColorRGB(.3,.3,.3);c.roundRect(x,y-101,250,105,8)
    picture(s['icon'],x+10,y-82,64);text(s['label'],x+87,y-22,150,14)
finish()

match_ids=['cat','rooster','cow','dog','bell','rain']
options=[('A','Loceng pintu'),('B','Anjing'),('C','Hujan'),('D','Lembu'),('E','Kucing'),('F','Ayam')]
header(3,'Padankan gambar','Aktiviti visual sahaja: tulis huruf perkataan yang sepadan. Ini bukan ujian mendengar.')
for i,id in enumerate(match_ids):
    y=H-180-i*91
    c.setFont('ArialBold',14);c.drawString(margin,y-26,str(i+1)+'.')
    picture(next(s for s in data if s['id']==id)['icon'],margin+30,y-58,57)
    c.setFont('Arial',12);c.drawString(margin+110,y-30,'Jawapan: ______')
    text(options[i][0]+'. '+options[i][1],330,y-17,200,14)
finish()

header(4,'Misi mendengar bersama pendamping','Sembunyikan lajur pendamping. Mainkan bunyi sebenar, kemudian minta murid memilih kad sumber bunyi.')
y=H-175
for i,(id,prompt) in enumerate([
('cat','Mainkan bunyi kucing. Tanya: Apakah bunyi yang kamu dengar?'),
('bell','Mainkan bunyi loceng pintu. Minta murid memilih kad.'),
('rooster','Mainkan bunyi ayam berkokok. Mainkan semula jika diminta.'),
('cow','Mainkan bunyi lembu menguak. Tanya tentang sumber bunyi.'),
('dog','Mainkan bunyi anjing menyalak. Beri masa untuk mendengar.'),
('rain','Mainkan bunyi hujan. Gunakan label hujan, bukan lokasi tertentu.'),
]):
    y=text('<b>'+str(i+1)+'. Arahan pendamping</b>',margin,y,size=12)-5
    y=text(prompt+'<br/>Pilihan murid: __________________  Betul / Belum tepat / Belum dicuba',margin,y,size=11)-18
text('Jangan membaca nama sumber bunyi kepada murid sebelum jawapan diberi. Jika audio tidak tersedia, tangguhkan latihan mendengar; jangan gantikan dengan padanan gambar dan menandainya sebagai mendengar.',margin,y,size=11)
finish()

header(5,'Misi meniru dan senarai semak','Dengar satu bunyi dahulu. Kemudian sebut: Sekarang, cuba tiru bunyi itu.')
y=H-175
for i,phrase in enumerate(['Kucing mengiau','Ayam berkokok','Lembu menguak','Loceng pintu berbunyi']):
    y=text('<b>'+str(i+1)+'. '+phrase+'</b> - cuba dengan suara yang selesa.',margin,y,size=12)-8
    y=text('[  ] Belum dicuba   [  ] Sudah berlatih   [  ] Disahkan oleh pendamping',margin,y,size=10)-22
y=text('Catatan pemerhatian pendamping',margin,y-5,size=14)-16
rows=[['Aktiviti','Belum dicuba','Sudah dicuba','Pemerhatian'],
      ['Padanan visual','[  ]','[  ]','________________'],
      ['Pengecaman melalui audio','[  ]','[  ]','________________'],
      ['Latihan meniru bunyi','[  ]','[  ]','________________'],
      ['Latihan diperhati pendamping','[  ]','[  ]','________________']]
table=Table(rows,colWidths=[190,85,85,150],rowHeights=[35]*5)
table.setStyle(TableStyle([('FONTNAME',(0,0),(-1,-1),'Arial'),('FONTSIZE',(0,0),(-1,-1),9),('GRID',(0,0),(-1,-1),.5,'#444444'),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),8)]))
table.wrapOn(c,510,200);table.drawOn(c,margin,y-175)
text('Catatan latihan tidak membuktikan ketepatan sebutan atau penguasaan rasmi. Pemerhatian pendamping adalah pilihan. Tidak perlu merekod nama, tarikh lahir atau suara kanak-kanak.',margin,y-200,size=11)
finish()

header(6,'Jawapan dan rujukan','Semak aktiviti mengikut bukti yang benar-benar digunakan.')
y=H-175
for title,body in [
('Padanan visual (halaman 3)','1-E Kucing; 2-F Ayam; 3-D Lembu; 4-B Anjing; 5-A Loceng pintu; 6-C Hujan.'),
('Pengecaman melalui audio (halaman 4)','1 Kucing; 2 Loceng pintu; 3 Ayam; 4 Lembu; 5 Anjing; 6 Hujan. Jawapan ini sah hanya jika bunyi yang betul benar-benar dimainkan.'),
('Latihan bertutur (halaman 5)','Tiada satu jawapan sebutan yang dinilai oleh PDF ini. Catat sama ada murid sudah mencuba dan sama ada pendamping memerhati latihan.'),
('Rujukan kurikulum','Bahasa Melayu Tahun 1, Sekolah Kebangsaan (SK), Kurikulum Persekolahan 2027 (KP2027). SP 1.1.1: pengecaman bunyi persekitaran; SP 2.1.1: latihan meniru bunyi (huraian fungsi, bukan petikan lafaz rasmi).'),
('Status penjajaran kurikulum','Berdasarkan bahan penataran KP2027; pengesahan terhadap Dokumen Kurikulum akhir masih belum selesai. Tiada pengendorsan rasmi KPM atau pensijilan Tahap Penguasaan.'),
]:
    y=text('<b>'+title+'</b>',margin,y,size=12)-5;y=text(body,margin,y,size=11)-16
y=text('Sumber: KPM, Kurikulum Persekolahan 2027<br/><link href="https://www.moe.gov.my/kurikulum-persekolahan-2027">moe.gov.my/kurikulum-persekolahan-2027</link>',margin,y,size=10)-12
y=text('Penataran BM Tahun 1 Johor Bahru 2026<br/><link href="https://sites.google.com/moe-dl.edu.my/kpbmthn1jb2027/home">sites.google.com/moe-dl.edu.my/kpbmthn1jb2027/home</link>',margin,y,size=10)-12
text('Ilustrasi asli Zalea Studio. Rakaman, sumber dan lesen disenaraikan dalam panel kredit audio permainan. Tiada audio dibenamkan dalam PDF; pendamping perlu memainkan audio yang sepadan.',margin,y,size=10)
finish();c.save()
reader=PdfReader(out)
assert len(reader.pages)==6
for page in reader.pages:
    assert abs(float(page.mediabox.width)-W)<1 and abs(float(page.mediabox.height)-H)<1
assert all(page.extract_text().strip() for page in reader.pages)
Path('qa/detektif-bunyi-20261111/printable-text.txt').write_text('\n\n'.join(page.extract_text() for page in reader.pages),encoding='utf-8')
print(str(out),out.stat().st_size,'bytes; 6 A4 pages')
