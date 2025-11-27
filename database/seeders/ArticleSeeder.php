<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use App\Models\ArticleContent;
use App\Models\Image;
use Illuminate\Support\Facades\Storage;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {

        //List Articles
        $articles = [
            [
                //Article 1
                'user_id' => 23,
                'title' => 'Rumah Yatim Salurkan Bantuan Bahan Pokok, Ringankan Beban Lansia dan Dhuafa di Desa Sidomulyo',
                'category' => 'Charity',
                'thumbnail' => '1Thumb.jpg',
                'status' => 'approved',
                'created_at' => '2025-11-26 13:40:00',
                'images' => [
                    [
                        'file_name' => '1Img.jpg',
                        'order_x' => 1,
                        'order_y' => 4,
                    ],
                ],
                'texts' => [
                    [
                        'type' => 'paragraph',
                        'content' => "Kabar gembira datang untuk sepuluh (10) keluarga kurang mampu di Kabupaten Langkat. Lembaga Amil Zakat Nasional (Laznas) Rumah Yatim Sumatera Utara menggelar aksi kemanusiaan dengan menyalurkan bantuan bahan pokok kepada para lansia dan kaum dhuafa.",
                        'order_x' => 1,
                        'order_y' => 1,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => "Penyaluran bantuan ini dilaksanakan pada Senin, 24 November 2025, bertempat di Dusun 4, Desa Sidomulyo, Kecamatan Binjai, Kabupaten Langkat, Provinsi Sumatera Utara. Program ini menargetkan 10 penerima manfaat yang kesulitan dalam memenuhi kebutuhan sehari-hari.",
                        'order_x' => 1,
                        'order_y' => 2,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => '"Kami sangat bahagia dan bersyukur sekali. Di usia senja seperti ini, bantuan bahan pokok ini sangat berarti. Kami tidak perlu terlalu pusing memikirkan beras dan lauk untuk beberapa hari ke depan," tutur salah seorang penerima manfaat.',
                        'order_x' => 1,
                        'order_y' => 3,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => '“Terima kasih banyak kepada Rumah Yatim dan para donatur. Semoga rezeki Bapak/Ibu semua selalu dilimpahkan Allah.”',
                        'order_x' => 1,
                        'order_y' => 5,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Para penerima manfaat menyambut kedatangan tim Rumah Yatim dengan penuh kehangatan dan rasa syukur. Bantuan berupa bahan pokok ini diharapkan dapat memberikan keringanan yang signifikan dan membawa senyum kebahagiaan di tengah keterbatasan ekonomi yang mereka hadapi.',
                        'order_x' => 1,
                        'order_y' => 6,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Mari ulurkan tangan Anda untuk membantu sesama yang membutuhkan dengan menyisihkan sebagian harta melalui sedekah, infaq, atau zakat, dengan Klik tombol di bawah ini. ',
                        'order_x' => 1,
                        'order_y' => 7,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Sumber: https://rumah-yatim.org/program-event/rumah-yatim-salurkan-bantuan-bahan-pokok-ringankan-beban-lansia-dan-dhuafa-di-desa-sidomulyo',
                        'order_x' => 1,
                        'order_y' => 8,
                    ]

                ],
            ],
            [
                //Article 2
                'user_id' => 23,
                'title' => 'Donasi Anda Kembali Rekahkan Senyuman Kakek Zainal, Penjual Telur Asin si Seberang Padang',
                'category' => 'Donation',
                'thumbnail' => '2Thumb.jpg',
                'status' => 'approved',
                'created_at' => '2025-11-27 08:05:00',
                'images' => [
                    [
                        'file_name' => '2Img.jpg',
                        'order_x' => 1,
                        'order_y' => 2,
                    ],
                    [
                        'file_name' => '2Img1.jpg',
                        'order_x' => 1,
                        'order_y' => 5,
                    ],
                ],
                'texts' => [
                    [
                        'type' => 'paragraph',
                        'content' => "Senyum merekah kembali terlihat dari wajah Kakek Zainal (80), penjual telur asin di Seberang Padang, Kecamatan Padang Selatan, Kota Padang, saat menerima bantuan biaya hidup tahap ketiga dari para donatur Rumah Yatim.",
                        'order_x' => 1,
                        'order_y' => 1,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => "Ia mengatakan, sejak menerima bantuan biaya hidup dirinya tidak lagi kelimpungan dalam memenuhi kebutuhan sehari-hari",
                        'order_x' => 1,
                        'order_y' => 3,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => '"Kakek sangat senang dan bersyukur bisa kembali menerima bantuan ini. Alhamdulillah sejak menerima bantuan dari para donatur Rumah Yatim, kakek tidak kesulitan lagi untuk makan dan bayar kontrakan. Bantuan ini sangat membantu sekali, terima kasih Rumah Yatim dan donatur, semoga Allah membalas semuanya dengan balasan yang terbaik," tuturnya.',
                        'order_x' => 1,
                        'order_y' => 4,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Sudah bertahun-tahun tepatnya setelah istrinya meninggal, kakek tinggal seorang diri disebuah kontrakan kecil. Untuk memenuhi kebutuhan hidupnya, lansia ini bekerja sebagai penjual telur asin dan kacang goreng milik orang lain dengan penghasilan 10 ribu rupiah saja.',
                        'order_x' => 1,
                        'order_y' => 6,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Penghasilan tersebut memang sangat kecil, tapi kakek Zainal tetap bersyukur karena masih bisa mencari nafkah sendiri dan tidak bergantung pada belas kasihan orang lain.',
                        'order_x' => 1,
                        'order_y' => 7,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Setiap hari kakek Zainal jualan menggunakan sepeda tuanya yang sering rusak. Jika lelah, ia akan mangkal di pinggir jalan, berharap banyak warga yang membeli dagangannya.',
                        'order_x' => 1,
                        'order_y' => 8,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => '"Terima kasih kepada semua donatur yang telah membantu kakek Zainal melalui Rumah Yatim. Semoga bantuan ini dapat memberikan banyak manfaat dan berkah untuk beliau, serta menjadi ladang pahala untuk para donatur," ungkap Sendi, kepala cabang Rumah Yatim Sumatera Barat.',
                        'order_x' => 1,
                        'order_y' => 9,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Mari lanjutkan aksi kebaikan ini, agar semakin banyak lagi masyarakat prasejahtera yang merasakan berkah dan manfaatnya, salurkan donasi terbaikmu di Rumah Yatim, silahkan klik tombol dibawah ini.',
                        'order_x' => 1,
                        'order_y' => 10,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Sumber: https://rumah-yatim.org/program-event/donasi-anda-kembali-rekahkan-senyuman-kakek-zainal-penjual-telur-asin-si-seberang-padang',
                        'order_x' => 1,
                        'order_y' => 11,
                    ]

                ],
            ],
            [
                //Article 3
                'user_id' => 23,
                'title' => 'Kondisi Ayana Bayi Penderita Usus Bocor dan Gizi Buruk di Pariangan Semakin Membaik Berkat Uluran Tangan Donatur',
                'category' => 'Donation',
                'thumbnail' => '3Thumb.jpg',
                'status' => 'approved',
                'created_at' => '2025-11-27 07:58:00',
                'images' => [
                    [
                        'file_name' => '3Img.jpg',
                        'order_x' => 1,
                        'order_y' => 2,
                    ],
                    [
                        'file_name' => '3Img1.jpg',
                        'order_x' => 1,
                        'order_y' => 4,
                    ],
                    [
                        'file_name' => '3Img2.jpg',
                        'order_x' => 1,
                        'order_y' => 6,
                    ],
                ],
                'texts' => [
                    [
                        'type' => 'paragraph',
                        'content' => "Uluran tangan dari para donatur melalui perantara Rumah Yatim sukses membuat kondisi Ayana, bayi berusia 17 bulan penderita usus bocor dan gizi buruk di Kelurahan Pariangan, Kecamatan Pariangan, Kabupaten Tanah Datar, Sumatera Barat semakin membaik.",
                        'order_x' => 1,
                        'order_y' => 1,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => "Sejak menerima bantuan dari para donatur pada Juli lalu sampai November ini, Ayana tidak lagi kesulitan dalam memenuhi kebutuhan gizi dan berobat. Sehingga, kondisi Ayana terus membaik, bahkan berat badannya terus bertambah dan dia tidak lagi didiagnosis gizi buruk.",
                        'order_x' => 1,
                        'order_y' => 3,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => '"Kami sekeluarga sangat bersyukur Ayana putri kami bisa menerima bantuan dari para donatur. Ini adalah bantuan keempat dari para donatur Rumah Yatim, selama menerima bantuan, kami dipemudah dalam pembiayaan dan Alhamdulillah putri kami kondisinya terus membaik. Terima kasih Rumah Yatim dan donatur, semoga Allah membalas semuanya, kami sekeluarga akan terus mendoakan Rumah Yatim dan donatur," tutur ibu Ayana.',
                        'order_x' => 1,
                        'order_y' => 5,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Diketahui, di usia 10 bulan Ayana didiagnosis menderita usus bocor dan gizi buruk. Kondisi ini mengharuskan Ayana rutin berobat dan kontrol ke rumah sakit di RSUP Dr.Djamil Padang.',
                        'order_x' => 1,
                        'order_y' => 7,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Kondisi ekonomi yang sangat terbatas membuat kedua orang tua Ayana seringkali kesulitan memenuhi kebutuhan gizi, popok dan membawa Ayana ke rumah sakit. Meskipun Ayana memiliki BPJS, ada kebutuhan lainnya seperti obat, ongkos, susu, makanan, vitamin dan popok yang tidak di cover BPJS ',
                        'order_x' => 1,
                        'order_y' => 8,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Penghasilan ayah Ayana yang seorang buruh harian lepas hanya cukup untuk makan sehari-hari saja, itu pun dengan lauk seadanya.',
                        'order_x' => 1,
                        'order_y' => 9,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Pada 20 Oktober kemarin, Rumah Yatim cabang Sumbar kembali mengantarkan bantuan dari para donatur kepada Ayana. Bantuan ini diberikan langsung kepada Ayana dan ibunya d RSUP Dr.Djamil Padang. ',
                        'order_x' => 1,
                        'order_y' => 10,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => '"Saat ini Ayana sedang melakukan kontrol, Alhamdulillah kondisi Ayana membaik, dia sudah gemuk dan semakin ceria. Kami berharap kondisi Ayana bisa terus membaik," ucap Sendi, kepala cabang Rumah Yatim Sumatera Barat.',
                        'order_x' => 1,
                        'order_y' => 11,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Pejuang kebaikan, mari bersama kita lanjutkan aksi kebaikan ini, agar Ayana dan anak-anak pejuang sembuh lainnya bisa merasakan berkah dan manfaatnya. Salurkan sedekah terbaikmu melalui rumah-yatim.org, silakan klik tombol dibawah ini ',
                        'order_x' => 1,
                        'order_y' => 12,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Sumber: https://rumah-yatim.org/program-event/kondisi-ayana-bayi-penderita-usus-bocor-dan-gizi-buruk-di-pariangan-semakin-membaik-berkat-uluran-tangan-donatur',
                        'order_x' => 1,
                        'order_y' => 13,
                    ]

                ],
            ],
            [
                //Article 4
                'user_id' => 23,
                'title' => 'Senyum Mbah Kasri Lansia Sebatang Kara Penjual Pecel Keliling Terima Bantuan Biaya Hidup Rumah Yatim',
                'category' => 'Charity',
                'thumbnail' => '4Thumb.jpg',
                'status' => 'approved',
                'created_at' => '2025-11-24 10:54:00',
                'images' => [
                    [
                        'file_name' => '4Img.jpg',
                        'order_x' => 1,
                        'order_y' => 8,
                    ],
                ],
                'texts' => [
                    [
                        'type' => 'paragraph',
                        'content' => "Di tengah hiruk pikuk Jakarta Selatan, di sepanjang Jalan Pondok Labu, terlihat sosok renta yang tak pernah berhenti melangkah. Itulah Mbah Kasri, seorang lansia berusia 79 tahun, yang setiap hari harus berjuang menjual sepincuk pecel keliling.",
                        'order_x' => 1,
                        'order_y' => 1,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => "Tubuhnya yang kurus dan rapuh harus menopang beban nampan berukuran cukup besar di atas kepala. Ia berjalan kaki menyusuri jalanan ibu kota, sebuah perjuangan yang semakin berat karena Mbah Kasri juga mengidap penyakit katarak, membuatnya sulit melihat dan rentan tergelincir.",
                        'order_x' => 1,
                        'order_y' => 2,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => '"Mbah Kasri hidup sebatang kara sejak suaminya meninggal dunia. Anaknya sudah menikah dan tinggal jauh. Di usia senja ini, ia hanya bisa mengandalkan hasil jualan pecelnya.',
                        'order_x' => 1,
                        'order_y' => 3,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => '“Perut Mbah sakit, Nak. Dari pagi sampai sekarang belum makan. Cuma minum air putih saja,” rintih Mbah Kasri dengan suara lirih yang memilukan. Ucapan itu menggambarkan betapa kerasnya pertarungan hidup yang ia hadapi setiap hari.',
                        'order_x' => 1,
                        'order_y' => 4,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Penghasilan hariannya pun jauh dari kata layak. Dalam sehari, Mbah Kasri hanya mampu membawa pulang sekitar Rp20.000. Uang tersebut tidaklah cukup, bahkan untuk diputar kembali menjadi modal jualan esok hari.',
                        'order_x' => 1,
                        'order_y' => 5,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => '“Sering banget, Nak, enggak laku. Sayuran sama gorengannya jadi basi,” ujarnya, menunjukkan kerugian yang sering ia tanggung. Meskipun kesulitan datang silih berganti, Mbah Kasri tidak mau menyerah. Ia berharap bisa hidup lebih layak di masa tuanya.',
                        'order_x' => 1,
                        'order_y' => 6,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Melihat kondisi Mbah Kasri, Lembaga Amil Zakat Nasional (Laznas) Rumah Yatim Regional Jabodetabek bergerak cepat. Pada Kamis, 20 November 2025, Rumah Yatim berhasil menyalurkan Program Kemanusiaan Bantuan Biaya Hidup di lokasi Mbah Kasrih berjualan.',
                        'order_x' => 1,
                        'order_y' => 7,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Bantuan ini merupakan hasil pengumpulan dana yang disalurkan melalui portal crowdfunding donasionline.id. Uluran tangan ini diharapkan dapat meringankan beban Mbah Kasri, membantunya memenuhi kebutuhan sehari-hari, dan menambah modal agar ia tidak perlu lagi khawatir dagangannya basi karena tidak laku.',
                        'order_x' => 1,
                        'order_y' => 9,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => '"Alhamdulillah, terima kasih banyak ya Allah. Terima kasih kepada Rumah Yatim dan para donatur yang sudah mau bantu Mbah yang sendirian ini," ujar Mbah Kasri dengan mata berkaca-kaca saat menerima bantuan. Raut wajahnya memancarkan kelegaan dan harapan yang baru.',
                        'order_x' => 1,
                        'order_y' => 10,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Kisah Mbah Kasri adalah cerminan dari banyaknya lansia lain yang membutuhkan uluran tangan. Rumah Yatim mengajak masyarakat untuk terus menunjukkan empati dan berpartisipasi dalam program-program kemanusiaan.',
                        'order_x' => 1,
                        'order_y' => 11,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Mari kita selalu tunjukkan empati terhadap mereka yang membutuhkan dengan menyisihkan sebagian harta kita melalui sedekah, infaq, ataupun zakat, dengan Klik tombol di bawah ini.',
                        'order_x' => 1,
                        'order_y' => 12,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Sumber: https://rumah-yatim.org/program-event/senyum-mbah-kasri-lansia-sebatang-kara-penjual-pecel-keliling-terima-bantuan-biaya-hidup-rumah-yatim',
                        'order_x' => 1,
                        'order_y' => 13,
                    ]

                ],
            ],
            [
                //Article 5
                'user_id' => 23,
                'title' => 'Bantuan Bahan Pokok Rumah Yatim Hangatkan Hati Yatim dan Dhuafa di MIS 7 Amal Bakti Binjai',
                'category' => 'Charity',
                'thumbnail' => '5Thumb.jpg',
                'status' => 'approved',
                'created_at' => '2025-11-26 13:07:00',
                'images' => [
                    [
                        'file_name' => '5Img.jpg',
                        'order_x' => 1,
                        'order_y' => 3,
                    ],
                ],
                'texts' => [
                    [
                        'type' => 'paragraph',
                        'content' => 'Lembaga Amil Zakat Nasional (Laznas) Rumah Yatim Sumatra Utara kembali menunjukkan kepeduliannya dengan menyalurkan program kemanusiaan berupa bantuan bahan pokok kepada masyarakat yang membutuhkan.',
                        'order_x' => 1,
                        'order_y' => 1,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Kegiatan penyaluran ini dilaksanakan pada Jumat, 21 November 2025, bertempat di MIS 7 Amal Bakti, Desa Perdamaian, Kecamatan Binjai, Kabupaten Langkat, Provinsi Sumatra Utara. Sebanyak tujuh (7) penerima manfaat, yang didominasi oleh anak-anak yatim dan kaum dhuafa, merasakan kebahagiaan atas bantuan yang mereka terima.',
                        'order_x' => 1,
                        'order_y' => 2,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => '"Alhamdulillah, kami sangat bersyukur dan bahagia sekali dapat bantuan bahan pokok ini. Bantuan ini sangat membantu kami, terutama untuk kebutuhan sehari-hari di rumah. Semoga Allah membalas kebaikan Rumah Yatim dan para donatur," ujar salah seorang penerima manfaat dengan raut wajah haru dan gembira.',
                        'order_x' => 1,
                        'order_y' => 4,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Antusiasme dan ekspresi bahagia tampak jelas dari para penerima manfaat saat proses penyerahan bantuan berlangsung. Bantuan bahan pokok ini diharapkan dapat meringankan beban ekonomi keluarga penerima manfaat, khususnya dalam memenuhi kebutuhan pangan sehari-hari.',
                        'order_x' => 1,
                        'order_y' => 5,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Rumah Yatim mengajak seluruh elemen masyarakat untuk terus menyebarkan kebaikan. Mari bersama-sama menunjukkan empati dan kepedulian terhadap mereka yang membutuhkan.',
                        'order_x' => 1,
                        'order_y' => 6,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Anda dapat berpartisipasi aktif dalam program-program kemanusiaan Rumah Yatim dengan menyisihkan sebagian harta melalui sedekah, infaq, ataupun zakat dengan Klik tombol di bawah ini. ',
                        'order_x' => 1,
                        'order_y' => 7,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Sumber: https://rumah-yatim.org/program-event/bantuan-bahan-pokok-rumah-yatim-hangatkan-hati-yatim-dan-dhuafa-di-mis-7-amal-bakti-binjai',
                        'order_x' => 1,
                        'order_y' => 8,
                    ]

                ],
            ],
            [
                //Article 6
                'user_id' => 23,
                'title' => 'Bagian 1: Pelatihan Kelompok Perempuan - Perjalanan Menuju Ogan Komering Ilir, Sumatera Selatan',
                'category' => 'Community',
                'thumbnail' => '6Thumb.jpg',
                'status' => 'approved',
                'created_at' => '2025-10-17 00:00:00',
                'images' => [
                    [
                        'file_name' => '6Thumb.jpg',
                        'order_x' => 1,
                        'order_y' => 4,
                    ],
                    [
                        'file_name' => '6Img.jpg',
                        'order_x' => 1,
                        'order_y' => 8,
                    ],
                ],
                'texts' => [
                    [
                        'type' => 'paragraph',
                        'content' => 'Ogan Komering Ilir (OKI) adalah salah satu kabupaten yang berada di Provinsi Sumatera Selatan. Jika anda dari Jakarta dan ingin mengunjungi kabupaten ini, anda dapat menempuhnya melalui perjalanan udara kurang lebih satu jam menuju ibu kota provinsi, Kota Palembang.',
                        'order_x' => 1,
                        'order_y' => 1,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Saya berkesempatan melakukan perjalanan ini bersama tiga rekan dari Program Kelautan Yayasan Konservasi Alam Nusantara (YKAN) pada akhir bulan September 2025 yang lalu.  Ini adalah perjalanan Saya yang pertama ke OKI, tetapi tidak bagi rekan-rekan tersebut. YKAN bekerja sama dengan berbagai mitra termasuk pemerintah daerah untuk melindungi sekitar 40.000 hektare hutan mangrove di OKI, sekaligus meningkatkan kehidupan masyarakat disekitarnya. Perjalanan Saya kali ini dalam rangka mendukung rekan-rekan program  yang berencana memberikan pelatihan kepada dua kelompok perempuan.  Konservasi mangrove dan bagaimana kelompok dapat menyusun konten edukasi terkait produk ramah lingkungan merupakan dua topik utama dalam pelatihannya.',
                        'order_x' => 1,
                        'order_y' => 2,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Kami berangkat dari Palembang menggunakan mobil, menuju Kecamatan Tulung Selapan di Kabupaten OKI. Perjalanan selama kurang lebih empat jam ini cukup menyenangkan, karena lepas dari hiruk pikuk kota besar, dan dapat melihat kehidupan lain dari dekat.  Di beberapa lokasi, mobil kami cukup berguncang melewati lubang-lubang di jalanan. Namun, hal ini memberikan kesempatan bagi Saya untuk berbincang-bincang dengan pak sopir  yang telah melewati jalan ini hampir sepanjang hidupnya. Menurutnya, ada beberapa jalan menuju Kecamatan Tulung Selapan, tetapi jalan yang kami tempuh saat itu adalah akses yang terdekat dari Palembang.',
                        'order_x' => 1,
                        'order_y' => 3,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Kami tiba di Tulung Selapan tepat saat makan siang. Setelah makan dan beristirahat, kami melanjutkan perjalanan menuju Desa Sungai Lumpur. Dengan menyusuri sungai menggunakan kapal penumpang, perjalanan ini ditempuh sekitar tiga jam menuju tujuan. Sepanjang perjalanan, Saya berkesempatan melihat desa-desa sepanjang sungai dengan rumah-rumah panggung dan bangunan tinggi tempat burung walet bersarang.”',
                        'order_x' => 1,
                        'order_y' => 5,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Usaha burung walet ini ternyata merupakan salah satu mata pencaharian mereka. Saya juga terkagum saat memandang alam sepanjang pesisir sungai,  termasuk hutan mangrove yang berbaris rapih yang merupakan pemandangan langka bagi Saya. Saat matahari hampir tenggelam, kami tiba di pelabuhan Desa Pantai Harapan yang merupakan desa tetangga dari Desa Sungai Lumpur.',
                        'order_x' => 1,
                        'order_y' => 6,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Ribka Harefa, MERA Program Officer YKAN, mengatakan bahwa kami yang perempuan akan menginap di rumah Syahidah (Ida), yang merupakan fasilitator lokal YKAN, dan yang baru Saya kenal pada malam sebelumnya. Sementara Muhammad Sadik, Aquaculture Coordinator YKAN, akan menginap di rumah Pak Haji Juma di Desa Sungai Lumpur, bersama dengan dua rekan pria yang sudah berada di sana seminggu sebelumnya.',
                        'order_x' => 1,
                        'order_y' => 7,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Tiba di rumah Ida, kami disambut dengan hangat oleh ibunya.  Setelah mencicipi makan malam masakan Ibunya Ida yang lezat, kami menyambut  tiga rekan pria yang datang untuk mendiskusikan persiapan pelatihan esok hari. Kami membahas agenda besok dimana, Syidik Fahmi, Mangrove Restoration Officer YKAN, dan Sadik akan mengisi sesi pertama terkait konservasi mangrove. Saya dijadwalkan mengisi sesi kedua setelah makan siang. Sesi Saya ini  diharapkan dapat membantu kelompok menyusun konten penjangkauan dan edukasi produk mereka, serta mempraktikannya bersama-sama.  Kelompok perempuan yang akan dikunjungi besok adalah Kelompok Maju Jaya di Desa Simpang Tiga Jaya.',
                        'order_x' => 1,
                        'order_y' => 8,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Sekitar pukul 10 malam, persiapan sudah selesai, malam pun sudah larut.  Kami membubarkan diri untuk beristirahat, dan malam itu Saya bermimpi tentang birunya langit.',
                        'order_x' => 1,
                        'order_y' => 9,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Sumber: https://www.ykan.or.id/id/publikasi/artikel/perspektif/pelatihan-kelompok-perempuan-oki/',
                        'order_x' => 1,
                        'order_y' => 10,
                    ]

                ],
            ],
            [
                //Article 7
                'user_id' => 23,
                'title' => 'Bagian 2: Pelatihan Bersama Kelompok Perempuan Maju Jaya, Ogan Komering Ilir',
                'category' => 'Community',
                'thumbnail' => '7Thumb.jpg',
                'status' => 'approved',
                'created_at' => '2025-10-17 00:00:00',
                'images' => [
                    [
                        'file_name' => '7Img.jpg',
                        'order_x' => 1,
                        'order_y' => 5,
                    ],
                    [
                        'file_name' => '7Thumb.jpg',
                        'order_x' => 1,
                        'order_y' => 10,
                    ],
                    [
                        'file_name' => '7Img2.jpg',
                        'order_x' => 1,
                        'order_y' => 13,
                    ],
                ],
                'texts' => [
                    [
                        'type' => 'paragraph',
                        'content' => 'Artikel ini merupakan bagian dari perjalanan penulis (Sally Kailola) dan tim Program Kelautan YKAN ke Kabupaten Ogan Komering Ilir, Sumatera Selatan mengikuti kegiatan Pelatihan kelompok Perempuan - Perjalanan Menuju Ogan Komering Ilir, Sumatera Selatan, pada akhir September 2025.',
                        'order_x' => 1,
                        'order_y' => 1,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Pagi-pagi benar, Saya mendengar langkah-langkah kaki di lantai papan rumah panggung, tempat Saya dan Ribka Harefa menginap. Kipas angin yang menemani kami tidur semalam telah berhenti, karena listrik desa juga berhenti tepat jam 6 pagi. Setelah mandi, kami disuguhi sarapan oleh Ibunya Ida.  Nasi goreng dan teh panas akan membuat kami segar dan kuat untuk memulai kegiatan kami di pagi ini.',
                        'order_x' => 1,
                        'order_y' => 2,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Ribka dan Ida mempersiapkan peralatan pelatihan dan juga makan siang kami yang akan kami bawa.  Saya melihat ada genset dan beberapa alat membuat kue diantara  peralatan yang disiapkan.  Ribka mengatakan pada Saya bahwa, genset ini akan diberikan kepada kelompok Maju Jaya, karena mereka terkendala listrik saat pagi hingga sore.  Oleh karena itu, mereka hanya memproduksi produk olahan yakni getas udang, pada malam hari.  Kuantitas produk terbatas, jika mereka hanya dapat bekerja pada malam hari.  YKAN menyediakan fasilitas genset ini untuk mempermudah usaha mereka.',
                        'order_x' => 1,
                        'order_y' => 3,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Kami bertemu dengan tiga rekan lainnya di pelabuhan Desa Pantai Harapan, dan memulai perjalanan kami menyusuri sungai ke Desa Simpang Tiga Jaya.  Ida, fasilitator lokal YKAN berbisik di sela-sela angin bahwa setelah sungai, kita akan menyusuri laut untuk tiba di desa tujuan. Wah, Saya bersemangat sekali, karena  ini merupakan pengalam baru menyusuri sungai sekaligus laut dalam satu kali perjalanan.',
                        'order_x' => 1,
                        'order_y' => 4,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Setelah melewati laut, kami masuk kembali ke sungai yang menuju desa, dan disambut oleh barisan hutan mangrove yang lebat. Saat tiba, kami berjalan melintasi toko-toko dagangan dan rumah panggung ditepian sungai, menuju rumah salah satu anggota kelompok tempat kami akan berkegiatan bersama. Sambil menunggu genset dipasang, kami saling menyapa dan berkenalan dengan enam ibu-ibu yang telah berkumpul untuk mengikuti pelatihan ini.',
                        'order_x' => 1,
                        'order_y' => 6,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Pelatihan Konservasi Mangrove & Penguatan Ketrampilan Penjangkauan Kelompok Maju Jaya.',
                        'order_x' => 1,
                        'order_y' => 7,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Sekitar jam 10 pagi, kegiatan di buka secara resmi oleh Sadik. Sesi pelatihan dimulai dengan pengenalan tentang mangrove serta jenis-jenis yang ada di desa dan di OKI secara keseluruhan. Syidik yang memfasilitasi sesi ini telah menyediakan gambar 22 jenis mangrove yang ada di OKI untuk dibagikan kepada peserta pelatihan. Diskusi semakin menghangat, saat anggota kelompok mengenal jenis-jenis mangrove itu dengan bahasa lokal mereka. Sadik kemudian memperkenalkan jenis tambak udang yang ramah lingkungan, yakni silvofishery. ',
                        'order_x' => 1,
                        'order_y' => 8,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Silvofishery adalah sistem pertambakan yang mengintegrasikan budidaya perikanan dengan rehabilitasi dan konservasi hutan mangrove, menciptakan ekosistem berkelanjutan yang saling menguntungkan bagi lingkungan dan ekonomi masyarakat pesisir. Jenis tambak udang ini disosialisasikan ke kelompok, karena YKAN memperkenalkan mekanisme tambak ramah lingkungan melalui program SECURE (Shrimp-Carbon Aquaculture) di pesisir OKI, dan memiliki beberapa contoh tambak yang dikelola bersama masyarakat.',
                        'order_x' => 1,
                        'order_y' => 9,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Setelah melewati istirahat makan siang dan sholat, kami melanjutkan pelatihan sesi kedua. Sesi yang difasilitasi Saya ini bertujuan untuk memberikan bimbingan kepada kelompok untuk menyusun cerita terkait produk olahan mereka, yang juga berkaitan dengan upaya perlindungan mangrove.',
                        'order_x' => 1,
                        'order_y' => 11,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Apalagi, udang yang merupakan bahan produk mereka, berasal dari hasil tambak atau dibeli dari nelayan yang menangkapnya sekitar mangrove. Setelah teori diberikan, peserta dibagi menjadi tiga kelompok dan dibantu oleh tiga rekan YKAN lainnya untuk menyusun cerita mereka. Nugrah Hadi Sukesna, YKAN staff yang bertugas di Bengkalis, saat ini sedang membantu proses monitoring mangrove di OKI, juga turut bergabung ditugas kelompok tersebut.  Anggota kelompok Maju Jaya akan menceritakan cerita mereka kemudian dibantu oleh rekan-rekan YKAN untuk dimuat pada powerpoint.',
                        'order_x' => 1,
                        'order_y' => 12,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Setelah selesai menyusun cerita, masing-masing kelompok mempresentasikan cerita mereka. Penilaian dilakukan dari sisi materi dan para pembawa materi.  Saya sangat senang melihat antusias semua anggota kelompok.  Cerita yang disusun sangat menarik dan pembawaan materi dilakukan juga dengan baik.  Saya kagum dengan komitmen mereka untuk belajar,   karena ini merupakan pelatihan yang pertama terkait menyusun cerita dan ketrampilan presentasi.',
                        'order_x' => 1,
                        'order_y' => 14,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Tak terasa waktu sudah sore.  Hujan yang mengguyur lebat mengingatkan kami untuk segera kembali ke desa. Perjalanan menyusuri pesisir laut merupakan tantangan tersendiri.  Ombak dan angin keras sepanjang perjalanan membuat Saya semakin kagum terhadap kehidupan masyarakat pesisir.  Kuat dan berani menghadapi tantangan, merupakan salah satu filosofi hidup, yang Saya dapatkan dari perjalanan hari ini.',
                        'order_x' => 1,
                        'order_y' => 15,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Sumber: https://www.ykan.or.id/id/publikasi/artikel/perspektif/pelatihan-kelompok-perempuan-maju-jaya/',
                        'order_x' => 1,
                        'order_y' => 16,
                    ]

                ],
            ],
            [
                //Article 8
                'user_id' => 23,
                'title' => 'Suka Cita Anak-anak Down Syndrome dan Santri Dukung Timnas U-22 di Lapangan Lawan Mali',
                'category' => 'Community',
                'thumbnail' => '8Thumb.jpg',
                'status' => 'approved',
                'created_at' => '2025-11-19 00:00:00',
                'images' => [
                    [
                        'file_name' => '8Img.jpg',
                        'order_x' => 1,
                        'order_y' => 4,
                    ],
                    [
                        'file_name' => '8Img2.jpg',
                        'order_x' => 1,
                        'order_y' => 9,
                    ],
                    [
                        'file_name' => '7Img2.jpg',
                        'order_x' => 1,
                        'order_y' => 13,
                    ],
                ],
                'texts' => [
                    [
                        'type' => 'paragraph',
                        'content' => 'Laga Timnas Indonesia vs Mali di Stadion Pakansari, Bogor, menjadi momen spesial bagi anak-anak down syndrome, santri, serta keluarga yang diundang berbuatbaik.id bekerja sama dengan PSSI. Banyak dari mereka baru pertama kali melihat langsung pertandingan Timnas U-22. Kehadiran mereka bukan hanya menonton, tapi juga merasakan atmosfer kompetisi yang selama ini sulit didapatkan karena keterbatasan akses.',
                        'order_x' => 1,
                        'order_y' => 1,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Beberapa keluarga membagikan rasa syukurnya atas kesempatan ini. Ibu Dina, yang datang bersama putranya Muhammad Rafi merasakan kebahagiaan luar biasa. Rafi tampak sangat bangga bisa menjadi bagian dari sorakan untuk Timnas malam itu. Bagi mereka, kesempatan menonton langsung pertandingan yang diselenggarakan pada 15 dan 18 November 2025 adalah hadiah berharga.',
                        'order_x' => 1,
                        'order_y' => 2,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => '“Kejutan banget bisa nonton bareng. Terima kasih berbuatbaik.id sudah memberi kesempatan. Semoga ke depannya ada tiket gratis lagi, dan mungkin escort untuk anak-anak kami,” ujar Ibu Dina.',
                        'order_x' => 1,
                        'order_y' => 3,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Begitu pula Ibu Nunuy yang membawa Revan, buah hatinya yang menyandang down syndrome. Selama ini mereka hanya nonton bareng (nobar) di luar stadion, namun kali ini Revan bisa duduk aman dan menikmati laga langsung Timnas kesayangannya. Kebahagiaan sederhana ini terasa besar maknanya bagi orang tua dan anak-anak. Ada juga rombongan atlet anak-anak dengan down syndrome dan pelatihnya dari Special Olympics Indonesia (SOIna), yang merasa bangga bisa mendukung Timnas Indonesia langsung dari tribun.',
                        'order_x' => 1,
                        'order_y' => 5,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => '“Ini ide yang sangat baik untuk anak-anak disabilitas. Terima kasih PSSI dan berbuatbaik.id sudah melibatkan kami. Semoga sepak bola Indonesia maju untuk semua, bukan hanya untuk yang reguler,” kata Coach Tri Waluyo dari SOIna Kabupaten Bogor.',
                        'order_x' => 1,
                        'order_y' => 6,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Rombongan Pondok Pesantren (Ponpes) Mustofa hadir dengan semangat yang sama. Para santri menikmati suasana laga di stadion sambil menyampaikan harapan agar PSSI makin berjaya dan terus tampil baik di pertandingan berikutnya. Semangat para pecinta Timnas Indonesia ini terus membara terlepas dari hasil pertandingan dalam pertandingan persahabatan tersebut.',
                        'order_x' => 1,
                        'order_y' => 7,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Indonesia harus menerima skor 0–3 di laga pertama dan bermain imbang 2-2 di pertandingan berikutnya. Sepanjang malam, senyum anak-anak, tepuk tangan, dan sorakan spontan menjadi bukti bahwa kesempatan sederhana dapat menghadirkan kebahagiaan besar. Nobar ini menunjukkan sepak bola bisa menjadi ruang yang lebih inklusif, tempat semua orang termasuk anak-anak disabilitas merasa diterima.',
                        'order_x' => 1,
                        'order_y' => 8,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Kegiatan ini bukan sekadar menonton pertandingan, tetapi menghadirkan pengalaman, membuka akses, dan merangkul mereka yang sering terpinggirkan. PSSI dan berbuatbaik.id berhasil memberi ruang aman bagi mereka untuk menjadi bagian dari sorak-sorai Indonesia, dan malam itu menjadi kenangan yang akan melekat lama bagi banyak keluarga.',
                        'order_x' => 1,
                        'order_y' => 10,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Selain nobar Timnas Indonesia U-22 lawan Mali, masih banyak aktivitas bareng hasil kerja sama berbuatbaik.id dan PSSI. Kegiatan ini menyertakan anak-anak prasejahtera, penghapal Al-Quran, dan disabilitas menjadi pendamping atlet Timnas. Aksi ini diharapkan bisa menumbuhkan harapan, mengajarkan spotivitas, dan memberi pengalaman berbeda bagi anak-anak.',
                        'order_x' => 1,
                        'order_y' => 11,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Kegiatan bareng ini masih bisa berlanjut dengan adanya perhatian dari para Sahabat Baik. Penggalangan donasi berbuatbaik.id dan PSSI masih terbuka di Berbuatbaik.id dan PSSI Bersatu untuk Bangun Bangsa Melalui Sepak Bola. Kamu bisa menjadi bagian kebaikan ini dengan mulai Donasi sekarang. Donasi di berbuatbaik.id tanpa potongan dan 100% tersalurkan.',
                        'order_x' => 1,
                        'order_y' => 12,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'https://www.berbuatbaik.id/berbagi-kabar/269/suka-cita-anak-anak-down-syndrome-dan-santri-dukung-timnas-u-22-di-lapangan-lawan-mali',
                        'order_x' => 1,
                        'order_y' => 13,
                    ]

                ],
            ],
            [
                //Article 9
                'user_id' => 22,
                'title' => 'Jangan Salah, Ini 4 Tips Memilih Platform Donasi Tepat',
                'category' => 'Donation',
                'thumbnail' => '9Thumb.jpg',
                'status' => 'approved',
                'created_at' => '2024-10-31 00:00:00',
                'images' => [
                    [
                        'file_name' => '9Img.jpg',
                        'order_x' => 1,
                        'order_y' => 5,
                    ],
                    [
                        'file_name' => '9Img2.jpg',
                        'order_x' => 1,
                        'order_y' => 10,
                    ],
                ],
                'texts' => [
                    [
                        'type' => 'paragraph',
                        'content' => 'Teknologi saat ini sudah berkembang pesat. Era digital yang kita lalui membuat segala hal yang dilakukan menjadi lebih mudah. Salah satunya adalah berdonasi. Berdonasi saat ini bisa dilakukan dengan mudah, di manapun dan kapanpun melalui berbagai platform online. ',
                        'order_x' => 1,
                        'order_y' => 1,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Namun nyatanya kemudahan itu juga memunculkan aksi-aksi tak bertanggung jawab yang menyebabkan kerugian di pihak donatur ataupun penerima donasi. Hal tersebut mewajibkan masyarakat untuk berhati-hati dalam memilih platform. Berikut 4 tips yang dapat dilakukan untuk memilih platform donasi online tepat seperti dilansir dari berbagai sumber. ',
                        'order_x' => 1,
                        'order_y' => 2,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => '1. Pastikan Kredibilitas Platform Donasi',
                        'order_x' => 1,
                        'order_y' => 3,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Memverifikasi kredibilitas platform donasi adalah langkah paling krusial sebelum menyalurkan donasi. Platform donasi tepercaya harus memiliki status legalitas yang jelas, baik berbentuk perusahaan maupun yayasan, serta dilengkapi dengan izin resmi dari kementerian terkait untuk melakukan penggalangan dana. Kredibilitas platform juga dapat dilihat dari track record dan reputasinya yang tercermin melalui jejak digital serta pemberitaan di berbagai media.',
                        'order_x' => 1,
                        'order_y' => 4,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => '2. Perhatikan Identitas Penggalang Donasi',
                        'order_x' => 1,
                        'order_y' => 6,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Platform donasi tepercaya selalu memastikan setiap penggalangan dana mencantumkan identitas yayasan atau lembaga yang lengkap dan terverifikasi. Selain itu, yayasan atau lembaga menyertakan dokumentasi pendukung seperti foto, video, dan data penerima manfaat. Saat platform donasi mengatasnamakan yayasan atau lembaga tertentu, keasliannya dapat diverifikasi melalui keberadaan situs resmi dan media sosial yang aktif. Proses verifikasi juga dapat dilakukan dengan memeriksa tautan donasi serta situs resmi penyelenggara untuk memastikan kredibilitas campaign yang dijalankan.',
                        'order_x' => 1,
                        'order_y' => 7,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => '3. Cek Bukti Penyaluran Donasi',
                        'order_x' => 1,
                        'order_y' => 8,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Platform donasi yang tepercaya secara konsisten akan memberikan update penyaluran bantuan melalui dokumentasi foto dan video kunjungan ke penerima manfaat. Bukti visual ini menjadi jaminan bahwa donasi telah tersalurkan tepat sasaran, didukung dengan testimoni penerima manfaat dan laporan dampak terukur yang menunjukkan kontribusi nyata dari setiap donasi yang diberikan.',
                        'order_x' => 1,
                        'order_y' => 9,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => '4. Terdapat Alur Update Terkait Penyaluran',
                        'order_x' => 1,
                        'order_y' => 11,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Sebuah platform donasi tepercaya selalu memberikan update berkala mengenai keberlanjutan program dan dampak bantuan bagi penerima manfaat. Sebagai bagian dari akuntabilitas, platform menjamin hak donatur untuk mengakses informasi lengkap terkait penggalangan dana, termasuk laporan penyaluran bantuan. Transparansi yang konsisten ini menjadi bukti konkret bahwa platform donasi dapat dipercaya dalam mengelola dan menyalurkan dana secara aman dan tepat sasaran.',
                        'order_x' => 1,
                        'order_y' => 12,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Sangat penting untuk masyarakat melihat lebih dalam mengenai informasi sebuah platform donasi online untuk membuktikan keaslian dari platform tersebut. Jangan sampai perkembangan teknologi yang pesat malah membuat donasi tidak tepat sasaran. Kemudahan teknologi harus dimanfaatkan dengan sebaik-baiknya. Saat ini, sudah banyak platform donasi online yang aman dan terpercaya.',
                        'order_x' => 1,
                        'order_y' => 13,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Berbuatbaik.id hadir sebagai platform donasi online tepercaya yang mengedepankan transparansi. Sebagai platform yang sudah terverifikasi, berbuatbaik.id dapat menjadi platform yang tepat untuk menyalurkan kebaikan kalian. #sahabatbaik donasi yang kalian berikan akan terjamin 100% tersalurkan. ',
                        'order_x' => 1,
                        'order_y' => 14,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'https://www.berbuatbaik.id/berbagi-kabar/196/jangan-salah-ini-4-tips-memilih-platform-donasi-tepat',
                        'order_x' => 1,
                        'order_y' => 15,
                    ]

                ],
            ],
            [
                //Article 10
                'user_id' => 22,
                'title' => 'Rumah Yatim Salurkan Bantuan Biaya Hidup di Pandowoharjo Sleman, Nek Tinah "Alhamdulillah Sangat Membantu!"',
                'category' => 'Donation',
                'thumbnail' => '10Thumb.jpg',
                'status' => 'approved',
                'created_at' => '2025-11-21 23:24:00',
                'images' => [
                ],
                'texts' => [
                    [
                        'type' => 'paragraph',
                        'content' => 'Rumah Yatim cabang Yogyakarta terus menunjukkan komitmennya dalam membantu sesama. Kali ini, bantuan biaya hidup disalurkan kepada puluhan warga di Kelurahan Pandowoharjo, Kecamatan Sleman, Kabupaten Sleman, Daerah Istimewa Yogyakarta.',
                        'order_x' => 1,
                        'order_y' => 1,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Salah satu penerima manfaat yakni nek Tinah (70), seorang lansia yang tinggal seorang diri dan hanya mengandalkan pemberian dari anaknya merasa sangat terbantu dengan adanya bantuan ini ',
                        'order_x' => 1,
                        'order_y' => 2,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => '"Alhamdulillah bantuan ini sangat membantu, nenek sangat senang dan bersyukur menerimanya. Terima kasih Rumah Yatim dan donatur atas bantuannya, semoga Allah membalas semuanya," ungkap nek Tinah.',
                        'order_x' => 1,
                        'order_y' => 3,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Sejak ditinggal meninggal suaminya, nek Tinah tinggal seorang diri di rumah sederhananya. Kondisi tubuh yang sudah lemah dan sakit-sakitan membuatnya tidak mampu lagi bekerja. Sehingga, untuk memenuhi kebutuhan sehari-harinya ia hanya mengandalkan pemberian dari anaknya yang bekerja sebagai penjaga di toko baju.',
                        'order_x' => 1,
                        'order_y' => 4,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'Kepada tim Rumah Yatim cabang Yogyakarta, nek Tinah mengatakan akan menggunakan bantuan ini untuk membeli bahan pokok agar bisa mengurangi beban anaknya dalam memenuhi kebutuhan sehari-hari.',
                        'order_x' => 1,
                        'order_y' => 5,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => '"Semoga bantuan ini bisa memberikan manfaat dan berkah untuk nek Tinah, serta menjadi ladang pahala, kebaikan dan berkah untuk para donatur," ucap Sri, salah satu relawan Rumah Yatim Yogyakarta.',
                        'order_x' => 1,
                        'order_y' => 6,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => '#Pejuangkebaikan, mari bersama kita lanjutkan aksi kebaikan ini, agar semakin banyak lagi keluarga dhuafa dan lansia yang merasakan manfaatnya. Salurkan donasi terbaikmu melalui rumah-yatim.org, silakan klik tombol donasi. ',
                        'order_x' => 1,
                        'order_y' => 7,
                    ],
                    [
                        'type' => 'paragraph',
                        'content' => 'https://rumah-yatim.org/program-event/rumah-yatim-salurkan-bantuan-biaya-hidup-di-pandowoharjo-sleman-nek-tinah-alhamdulillah-sangat-membantu',
                        'order_x' => 1,
                        'order_y' => 8,
                    ]

                ],
            ],
        ];
        foreach ($articles as $data) {

            // Upload thumbnail
            $thumbnailLocal = public_path("images/onlineArticleImages/{$data['thumbnail']}");
            $thumbnailMinio = Storage::disk('minio')->putFileAs(
                'articleThumbnails',
                new \Illuminate\Http\File($thumbnailLocal),
                $data['thumbnail']
            );

            // Create article
            $article = Article::create([
                'user_id' => $data['user_id'] ?? 22,
                'title' => $data['title'],
                'thumbnail' => $thumbnailMinio,
                'category' => $data['category'],
                'status' => 'approved',
            ]);

            // Upload image blocks
            foreach ($data['images'] as $img) {
                $imgLocal = public_path("images/onlineArticleImages/{$img['file_name']}");

                $imgMinio = Storage::disk('minio')->putFileAs(
                    'articleContentImages',
                    new \Illuminate\Http\File($imgLocal),
                    $img['file_name']
                );

                $content = ArticleContent::create([
                    'article_id' => $article->id,
                    'type' => 'image',
                    'order_x' => $img['order_x'],
                    'order_y' => $img['order_y'],
                ]);

                Image::create([
                    'imageable_id' => $content->id,
                    'imageable_type' => ArticleContent::class,
                    'path' => $imgMinio,
                ]);
            }

            // Insert text blocks
            foreach ($data['texts'] as $text) {
                ArticleContent::create([
                    'article_id' => $article->id,
                    'type' => 'paragraph',
                    'content' => $text['content'],
                    'order_x' => $text['order_x'],
                    'order_y' => $text['order_y'],
                ]);
            }
        }
    }

}
