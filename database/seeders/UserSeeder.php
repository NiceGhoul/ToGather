<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Jalankan seeder.
     */
    public function run(): void
    {
        // Admin User
        User::updateOrCreate(
            ['email' => 'admin@email.com'],
            [
                'nickname' => 'Admin',
                'address' => 'ToGather HQ',
                'password' => Hash::make('Admin1234'),
                'role' => 'admin',
                'status' => 'active',
            ]
        );
        // Regular User
        User::updateOrCreate(
            ['email' => 'user@email.com'],
            [
                'nickname' => 'user',
                'address' => 'user home',
                'password' => Hash::make('User123123'),
                'role' => 'user',
                'status' => 'active',
            ]
        );

        // ToGather Author Team
        User::updateOrCreate(
            ['email' => 'togather_author@email.com'],
            [
                'nickname' => 'ToGather Author',
                'address' => 'ToGather HQ',
                'password' => Hash::make('Author1234'),
                'role' => 'user',
                'status' => 'active',
            ]
        );

        // Additional Users
        $users = [
            ['email' => 'sarayasa131@gmail.com', 'nickname' => 'Sarayasa', 'address' => 'Jl. Merdeka No. 1, Jakarta'],
            ['email' => 'gilangwibowoo09@gmail.com', 'nickname' => 'Gilang Wibowo', 'address' => 'Jl. Sudirman No. 12, Bandung'],
            ['email' => 'Joshuasiregarr928@gmail.com', 'nickname' => 'Joshua Siregar', 'address' => 'Jl. Gatot Subroto No. 5, Medan'],
            ['email' => 'kinantilaras54@gmail.com', 'nickname' => 'Kinanti Laras', 'address' => 'Jl. Ahmad Yani No. 8, Surabaya'],
            ['email' => 'Olivveyuna@gmail.com', 'nickname' => 'Olivve Yuna', 'address' => 'Jl. Diponegoro No. 15, Yogyakarta'],
            ['email' => 'alunavania71@gmail.com', 'nickname' => 'Aluna Vania', 'address' => 'Jl. Kartini No. 22, Semarang'],
            ['email' => 'kaysanalfarezky76@gmail.com', 'nickname' => 'Kaysan Alfarezky', 'address' => 'Jl. Pahlawan No. 3, Malang'],
            ['email' => 'karsekarmelati@gmail.com', 'nickname' => 'Karse Karmelati', 'address' => 'Jl. Imam Bonjol No. 9, Denpasar'],
            ['email' => 'pradiptanugraha81@gmail.com', 'nickname' => 'Pradipta Nugraha', 'address' => 'Jl. Veteran No. 17, Makassar'],
            ['email' => 'shepi@gmail.com', 'nickname' => 'Shepi', 'address' => 'Jl. Cendrawasih No. 6, Palembang'],
            ['email' => 'radityabagaskara07@gmail.com', 'nickname' => 'Raditya Bagaskara', 'address' => 'Jl. Mawar No. 11, Balikpapan'],
            ['email' => 'nafebrianaputri@gmail.com', 'nickname' => 'Nafe Briana Putri', 'address' => 'Jl. Melati No. 4, Pontianak'],
            ['email' => 'hysarthaza@gmail.com', 'nickname' => 'Hysarthaza', 'address' => 'Jl. Anggrek No. 7, Manado'],
            ['email' => 'abrahamarkan04@gmail.com', 'nickname' => 'Abraham Arkan', 'address' => 'Jl. Dahlia No. 13, Banjarmasin'],
            ['email' => 'melyndaasaka2001@gmail.com', 'nickname' => 'Melynda Asaka', 'address' => 'Jl. Kenanga No. 2, Samarinda'],
            ['email' => 'raey4sa@gmail.com', 'nickname' => 'Raeysa', 'address' => 'Jl. Flamboyan No. 19, Pekanbaru'],
            ['email' => 'thisamucu@gmail.com', 'nickname' => 'Thisamucu', 'address' => 'Jl. Bougenville No. 24, Jambi'],
            ['email' => 'Radityadhikapangestu@gmail.com', 'nickname' => 'Raditya Dhika Pangestu', 'address' => 'Jl. Teratai No. 10, Lampung'],
            ['email' => 'Nurulmaulidy@gmail.com', 'nickname' => 'Nurul Maulidy', 'address' => 'Jl. Seroja No. 16, Padang'],
            ['email' => 'carisaputri500@gmail.com', 'nickname' => 'Carisa Putri', 'address' => 'Jl. Kamboja No. 21, Bengkulu'],
            ['email' => 'quenshaaliya@gmail.com', 'nickname' => 'Quensha Aliya', 'address' => 'Jl. Tulip No. 28, Banda Aceh'],
            ['email' => 'rifansyahrisky@gmail.com', 'nickname' => 'Rifansyah Risky', 'address' => 'Jl. Lavender No. 33, Kupang'],
            ['email' => 'ilhamramadhanham92@gmail.com', 'nickname' => 'Ilham Ramadhan', 'address' => 'Jl. Edelweiss No. 14, Mataram'],
            ['email' => 'ramadhanaradhan@gmail.com', 'nickname' => 'Ramadhana Radhan', 'address' => 'Jl. Sakura No. 27, Ambon'],
            ['email' => 'naurahidayah748@gmail.com', 'nickname' => 'Naura Hidayah', 'address' => 'Jl. Lily No. 31, Jayapura'],
            ['email' => 'lauranabila21@gmail.com', 'nickname' => 'Laura Nabila', 'address' => 'Jl. Orchid No. 5, Kendari'],
            ['email' => 'khairunnissaa91@gmail.com', 'nickname' => 'Khairunnissa', 'address' => 'Jl. Jasmine No. 18, Gorontalo'],
            ['email' => 'aryyapradanna8@gmail.com', 'nickname' => 'Aryya Pradanna', 'address' => 'Jl. Peony No. 23, Palu'],
            ['email' => 'ikhwanaputra33@gmail.com', 'nickname' => 'Ikhwana Putra', 'address' => 'Jl. Magnolia No. 36, Ternate'],
            ['email' => 'salwaafia07@gmail.com', 'nickname' => 'Salwa Afia', 'address' => 'Jl. Iris No. 42, Mamuju'],
            ['email' => 'zahraamelliaa66@gmail.com', 'nickname' => 'Zahra Amellia', 'address' => 'Jl. Violet No. 8, Serang'],
            ['email' => 'neoandikaa88@gmail.com', 'nickname' => 'Neo Andika', 'address' => 'Jl. Carnation No. 12, Cilegon'],
            ['email' => 'alamsyahaddin@gmail.com', 'nickname' => 'Alamsyah Addin', 'address' => 'Jl. Daisy No. 29, Tangerang'],
            ['email' => 'muthianurhaliza1@gmail.com', 'nickname' => 'Muthia Nurhaliza', 'address' => 'Jl. Sunflower No. 35, Bekasi'],
            ['email' => 'avriliashabrina@gmail.com', 'nickname' => 'Avrilia Shabrina', 'address' => 'Jl. Cosmos No. 41, Depok'],
            ['email' => 'seftianakartika5@gmail.com', 'nickname' => 'Seftiana Kartika', 'address' => 'Jl. Zinnia No. 47, Bogor'],
            ['email' => 'andriawanyusuf83@gmail.com', 'nickname' => 'Andriawan Yusuf', 'address' => 'Jl. Hibiscus No. 53, Cirebon'],
            ['email' => 'yosuamahardika723@gmail.com', 'nickname' => 'Yosua Mahardika', 'address' => 'Jl. Gardenia No. 59, Tasikmalaya'],
            ['email' => 'daffafaiz525@gmail.com', 'nickname' => 'Daffa Faiz', 'address' => 'Jl. Poppy No. 65, Sukabumi'],
            ['email' => 'nurulazizahnurul717@gmail.com', 'nickname' => 'Nurul Azizah', 'address' => 'Jl. Azalea No. 71, Karawang'],
            ['email' => 'fadlypratama067@gmail.com', 'nickname' => 'Fadly Pratama', 'address' => 'Jl. Begonia No. 77, Purwakarta'],
            ['email' => 'salsabilanadhifa@gmail.com', 'nickname' => 'Salsabila Nadhifa', 'address' => 'Jl. Camellia No. 83, Subang'],
            ['email' => 'adityafarhan@gmail.com', 'nickname' => 'Aditya Farhan', 'address' => 'Jl. Chrysanthemum No. 89, Majalengka'],
            ['email' => 'triputraakbar@gmail.com', 'nickname' => 'Tri Putra Akbar', 'address' => 'Jl. Daffodil No. 95, Indramayu'],
            ['email' => 'aisyahaureliaa@gmail.com', 'nickname' => 'Aisyah Aurelia', 'address' => 'Jl. Freesia No. 101, Kuningan'],
            ['email' => 'sopialestari4@gmail.com', 'nickname' => 'Sopia Lestari', 'address' => 'Jl. Geranium No. 107, Ciamis'],
            ['email' => 'naditaalunaa@gmail.com', 'nickname' => 'Nadita Aluna', 'address' => 'Jl. Heather No. 113, Banjar'],
            ['email' => 'airajenita5@gmail.com', 'nickname' => 'Aira Jenita', 'address' => 'Jl. Ixora No. 119, Pangandaran'],
            ['email' => 'keysiafadila02@gmail.com', 'nickname' => 'Keysia Fadila', 'address' => 'Jl. Jonquil No. 125, Sumedang'],
            ['email' => 'tasyarizky203@gmail.com', 'nickname' => 'Tasya Rizky', 'address' => 'Jl. Kalanchoe No. 131, Garut'],
            ['email' => 'anisalsabil.31@gmail.com', 'nickname' => 'Anis Alsabil', 'address' => 'Jl. Lantana No. 137, Bandung Barat'],
            ['email' => 'amaliareski6074@gmail.com', 'nickname' => 'Amalia Reski', 'address' => 'Jl. Marigold No. 143, Cimahi'],
            ['email' => 'riskyoctaviana@gmail.com', 'nickname' => 'Risky Octaviana', 'address' => 'Jl. Narcissus No. 149, Tegal'],
            ['email' => 'airacahyani701@gmail.com', 'nickname' => 'Aira Cahyani', 'address' => 'Jl. Oleander No. 155, Pekalongan'],
            ['email' => 'lailarahma@gmail.com', 'nickname' => 'Laila Rahma', 'address' => 'Jl. Primrose No. 161, Brebes'],
            ['email' => 'chanputra.689@gmail.com', 'nickname' => 'Chan Putra', 'address' => 'Jl. Queen Anne No. 167, Pemalang'],
            ['email' => 'putriyasmin@gmail.com', 'nickname' => 'Putri Yasmin', 'address' => 'Jl. Ranunculus No. 173, Batang'],
            ['email' => 'febrianamaharani@gmail.com', 'nickname' => 'Febriana Maharani', 'address' => 'Jl. Snapdragon No. 179, Kendal'],
            ['email' => 'dermawanabidin23@gmail.com', 'nickname' => 'Dermawan Abidin', 'address' => 'Jl. Tuberose No. 185, Demak'],
            ['email' => 'abdillah9078@gmail.com', 'nickname' => 'Abdillah', 'address' => 'Jl. Verbena No. 191, Grobogan'],
            ['email' => 'pnayah0@gmail.com', 'nickname' => 'Pnayah', 'address' => 'Jl. Wisteria No. 197, Blora'],
            ['email' => 'elizaseptiani17@gmail.com', 'nickname' => 'Eliza Septiani', 'address' => 'Jl. Yarrow No. 203, Rembang'],
            ['email' => 'andinurhikma@gmail.com', 'nickname' => 'Andi Nurhikma', 'address' => 'Jl. Zinnia No. 209, Pati'],
            ['email' => 'elizaseptiani188@gmail.com', 'nickname' => 'Eliza Septiani', 'address' => 'Jl. Amaranth No. 215, Kudus'],
            ['email' => 'abdulrahman@gmail.com', 'nickname' => 'Abdul Rahman', 'address' => 'Jl. Bellflower No. 221, Jepara'],
            ['email' => 'vikasera112@gmail.com', 'nickname' => 'Vika Sera', 'address' => 'Jl. Clover No. 227, Sragen'],
            ['email' => 'elizaseptiani20@gmail.com', 'nickname' => 'Eliza Septiani', 'address' => 'Jl. Delphinium No. 233, Karanganyar'],
            ['email' => 'elizaseptiani33@gmail.com', 'nickname' => 'Eliza Septiani', 'address' => 'Jl. Echinacea No. 239, Wonogiri'],
            ['email' => 'riskaamelia23@gmail.com', 'nickname' => 'Riska Amelia', 'address' => 'Jl. Foxglove No. 245, Sukoharjo'],
            ['email' => 'novaalwi@gmail.com', 'nickname' => 'Nova Alwi', 'address' => 'Jl. Gladiolus No. 251, Klaten'],
            ['email' => 'ridwanlubis@gmail.com', 'nickname' => 'Ridwan Lubis', 'address' => 'Jl. Hollyhock No. 257, Boyolali'],
            ['email' => 'seraindah34@gmail.com', 'nickname' => 'Sera Indah', 'address' => 'Jl. Impatiens No. 263, Magelang'],
            ['email' => 'adhistya1829@gmail.com', 'nickname' => 'Adhistya', 'address' => 'Jl. Jasmine No. 269, Temanggung'],
            ['email' => 'segaradhan18@gmail.com', 'nickname' => 'Sega Radhan', 'address' => 'Jl. Kaffir Lily No. 275, Wonosobo'],
            ['email' => 'kenzoputra34@gmail.com', 'nickname' => 'Kenzo Putra', 'address' => 'Jl. Larkspur No. 281, Purbalingga'],
            ['email' => 'anseliaputrianput@gmail.com', 'nickname' => 'Anselia Putri', 'address' => 'Jl. Mignonette No. 287, Banjarnegara'],
            ['email' => 'kailasyafitriii02@gmail.com', 'nickname' => 'Kailasya Fitri', 'address' => 'Jl. Nemesia No. 293, Kebumen'],
            ['email' => 'ethanalvaro22@gmail.com', 'nickname' => 'Ethan Alvaro', 'address' => 'Jl. Oxalis No. 299, Purworejo'],
            ['email' => 'maharaniipuspitaa02@gmail.com', 'nickname' => 'Maharani Puspita', 'address' => 'Jl. Pentas No. 305, Cilacap'],
            ['email' => 'auroraanindya2@gmail.com', 'nickname' => 'Aurora Anindya', 'address' => 'Jl. Quince No. 311, Banyumas'],
            ['email' => 'naishaalifa105@gmail.com', 'nickname' => 'Naisha Alifa', 'address' => 'Jl. Ranunculus No. 317, Purwokerto'],
            ['email' => 'adityayogapratama980@gmail.com', 'nickname' => 'Aditya Yoga Pratama', 'address' => 'Jl. Scabiosa No. 323, Tegal'],
            ['email' => 'ndhrsyahira@gmail.com', 'nickname' => 'Nadhra Syahira', 'address' => 'Jl. Trillium No. 329, Slawi'],
            ['email' => 'kakanurrahman1@gmail.com', 'nickname' => 'Kaka Nurrahman', 'address' => 'Jl. Ursinia No. 335, Brebes'],
            ['email' => 'fathanalfarizi678@gmail.com', 'nickname' => 'Fathan Alfarizi', 'address' => 'Jl. Viburnum No. 341, Pemalang'],
            ['email' => 'kairaanandira@gmail.com', 'nickname' => 'Kaira Anandira', 'address' => 'Jl. Wallflower No. 347, Pekalongan'],
            ['email' => 'azzurakinanti72@gmail.com', 'nickname' => 'Azzura Kinanti', 'address' => 'Jl. Xeranthemum No. 353, Batang'],
            ['email' => 'nayracitrakirana@gmail.com', 'nickname' => 'Nayra Citra Kirana', 'address' => 'Jl. Yellow Bell No. 359, Kendal'],
            ['email' => 'mahesavakenzo@gmail.com', 'nickname' => 'Mahesava Kenzo', 'address' => 'Jl. Zenobia No. 365, Semarang'],
            ['email' => 'malikanaswira@gmail.com', 'nickname' => 'Malika Naswira', 'address' => 'Jl. Anemone No. 371, Salatiga'],
            ['email' => 'nasyifaazahra9@gmail.com', 'nickname' => 'Nasyifa Azahra', 'address' => 'Jl. Bluebell No. 377, Solo'],
            ['email' => 'immanuelchristy5@gmail.com', 'nickname' => 'Immanuel Christy', 'address' => 'Jl. Coreopsis No. 383, Surakarta'],
            ['email' => 'williamrobertt206@gmail.com', 'nickname' => 'William Robert', 'address' => 'Jl. Dianthus No. 389, Mojokerto'],
            ['email' => 'dedyprasetyotyo09@gmail.com', 'nickname' => 'Dedy Prasetyo', 'address' => 'Jl. Euphorbia No. 395, Pasuruan'],
            ['email' => 'aliakbaralak18@gmail.com', 'nickname' => 'Ali Akbar', 'address' => 'Jl. Frangipani No. 401, Probolinggo'],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                [
                    'nickname' => $user['nickname'],
                    'address' => $user['address'],
                    'password' => Hash::make('Password123'),
                    'role' => 'user',
                    'status' => 'active',
                ]
            );
        }
    }
}
