<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\CampaignContent;
use App\Models\Image;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class CampaignSeeder extends Seeder
{
    public function run(): void
    {
        // Get user IDs from database
        $adminId = User::where('email', 'admin@email.com')->first()->id;
        $userId = User::where('email', 'user@email.com')->first()->id;
        $authorId = User::where('email', 'togather_author@email.com')->first()->id;

        // Use array of available user IDs for campaigns
        $userIds = [$adminId, $userId, $authorId];

        $mainCampaign = [
            [
                'user_id'           => $userIds[array_rand($userIds)],
                'verified_by'       => $adminId,
                'title'             => 'Dragon Roast Coffee - Coffee For Adventurers',
                'description'       => 'Level up your game sessions with Dragon Roast Coffee, your new favorite gaming accessory! And yes, its actual coffee.',
                'category'          => 'Foods & Beverage',
                'start_campaign'    => Carbon::parse('2025-10-01'),
                'end_campaign'      => Carbon::parse('2025-12-17'),
                'address'           => 'Thornton, CO',
                'status'            => 'active',
                'goal_amount'       => 60000000,
                'collected_amount'  => 434777412,
                'duration'          => Carbon::parse('2025-10-01')->diffInDays(Carbon::parse('2025-12-17')),
                'rejected_reason'   => null,
                'created_at'        => Carbon::parse('2025-10-01'),
                'updated_at'        => now(),
            ],
            [
                'user_id'           => $userIds[array_rand($userIds)],
                'verified_by'       => $adminId,
                'title'             => 'From My Cambodian Kitchen: Home Recipes from the Heart',
                'description'       => 'A cookbook preserving Cambodia\'s heritage with authentic family recipes, vibrant flavors, and stories of culture.',
                'category'          => 'Foods & Beverage',
                'start_campaign'    => Carbon::parse('2025-11-01'),
                'end_campaign'      => Carbon::parse('2025-12-12'),
                'address'           => 'Taipei, Taiwan',
                'status'            => 'active',
                'goal_amount'       => 55500000,
                'collected_amount'  => 45973451,
                'duration'          => Carbon::parse('2025-11-01')->diffInDays(Carbon::parse('2025-12-12')),
                'rejected_reason'   => null,
                'created_at'        => Carbon::parse('2025-11-01'),
                'updated_at'        => now(),
            ],
            [
                'user_id'           => $userIds[array_rand($userIds)],
                'verified_by'       => $adminId,
                'title'             => 'Real Protein Snacks made from 100% Wild Irish Venison',
                'description'       => 'Real food protein snacks. Wild Irish venison. Clean, sustainable, delicious.',
                'category'          => 'Foods & Beverage',
                'start_campaign'    => Carbon::parse('2025-10-04'),
                'end_campaign'      => Carbon::parse('2025-12-20'),
                'address'           => 'Donegal, Ireland',
                'status'            => 'active',
                'goal_amount'       => 47500000,
                'collected_amount'  => 45973451,
                'duration'          => Carbon::parse('2025-10-04')->diffInDays(Carbon::parse('2025-12-20')),
                'rejected_reason'   => null,
                'created_at'        => Carbon::parse('2025-10-04'),
                'updated_at'        => now(),
            ],
            [
                'user_id'           => $userIds[array_rand($userIds)],
                'verified_by'       => $adminId,
                'title'             => 'S A Y A Designs',
                'description'       => 'The Passionate Pursuit of Ethical Hairpins',
                'category'          => 'Beauty & Cosmetic',
                'start_campaign'    => Carbon::parse('2025-09-28'),
                'end_campaign'      => Carbon::parse('2025-11-20'),
                'address'           => 'Ubud, Indonesia',
                'status'            => 'completed',
                'goal_amount'       => 135000000,
                'collected_amount'  => 207511716,
                'duration'          => Carbon::parse('2025-09-28')->diffInDays(Carbon::parse('2025-11-20')),
                'rejected_reason'   => null,
                'created_at'        => Carbon::parse('2025-09-28'),
                'updated_at'        => now(),
            ],
            [
                'user_id'           => $userIds[array_rand($userIds)],
                'verified_by'       => $adminId,
                'title'             => 'Visible Classical Architecture — Chiming Watch',
                'description'       => 'Hourly Chime/Sapphire Crystal/ Automatic/Sunburst Dial-built for function and style in the Delcona.',
                'category'          => 'Clothes & Fashion',
                'start_campaign'    => Carbon::parse('2025-10-28'),
                'end_campaign'      => Carbon::parse('2025-12-22'),
                'address'           => 'Hong Kong, Hong Kong',
                'status'            => 'active',
                'goal_amount'       => 27803100,
                'collected_amount'  => 945921048,
                'duration'          => Carbon::parse('2025-10-28')->diffInDays(Carbon::parse('2025-12-22')),
                'rejected_reason'   => null,
                'created_at'        => Carbon::parse('2025-10-28'),
                'updated_at'        => now(),
            ],
            [
                'user_id'           => $userIds[array_rand($userIds)],
                'verified_by'       => $adminId,
                'title'             => 'THOTHER Ossyn G1 — One-Piece 3D Printed Footwear',
                'description'       => 'A one-piece 3D printed sneaker inspired by skeletal design and future mobility. Crafted with flexible polymers for balance and comfort.',
                'category'          => 'Clothes & Fashion',
                'start_campaign'    => Carbon::parse('2025-09-17'),
                'end_campaign'      => Carbon::parse('2025-12-15'),
                'address'           => 'Los Angeles, CA',
                'status'            => 'active',
                'goal_amount'       => 100000000,
                'collected_amount'  => 1012792,
                'duration'          => Carbon::parse('2025-09-17')->diffInDays(Carbon::parse('2025-12-15')),
                'rejected_reason'   => null,
                'created_at'        => Carbon::parse('2025-09-17'),
                'updated_at'        => now(),
            ],
            [
                'user_id'           => $userIds[array_rand($userIds)],
                'verified_by'       => $adminId,
                'title'             => 'The Wax on Our Fingers',
                'description'       => 'From the Javanese village of Kebon: help us celebrate the lives and hands behind batik through this social-relational art project.',
                'category'          => 'Clothes & Fashion',
                'start_campaign'    => Carbon::parse('2025-09-04'),
                'end_campaign'      => Carbon::parse('2025-11-11'),
                'address'           => 'Yogyakarta, Indonesia',
                'status'            => 'completed',
                'goal_amount'       => 50000000,
                'collected_amount'  => 55973491,
                'duration'          => Carbon::parse('2025-09-04')->diffInDays(Carbon::parse('2025-11-11')),
                'rejected_reason'   => null,
                'created_at'        => Carbon::parse('2025-09-04'),
                'updated_at'        => now(),
            ],
            [
                'user_id'           => $userIds[array_rand($userIds)],
                'verified_by'       => $adminId,
                'title'             => 'Help Renee & 16-Year-Old Son Through Their Darkest Time',
                'description'       => 'My name is Zike Zhou, a 16-year-old high school sophomore. I\'m here to ask for help for the person I love most—my mom, Renee.',
                'category'          => 'Lifestyle',
                'start_campaign'    => Carbon::parse('2025-11-11'),
                'end_campaign'      => Carbon::parse('2025-12-31'),
                'address'           => 'Jericho, NY',
                'status'            => 'active',
                'goal_amount'       => 3500000000,
                'collected_amount'  => 3225194240,
                'duration'          => Carbon::parse('2025-11-11')->diffInDays(Carbon::parse('2025-12-31')),
                'rejected_reason'   => null,
                'created_at'        => Carbon::parse('2025-11-11'),
                'updated_at'        => now(),
            ],
            [
                'user_id'           => $userIds[array_rand($userIds)],
                'verified_by'       => $adminId,
                'title'             => 'Bangun & Renovasi Rumah Qur\'an di Pelosok',
                'description'       => 'From the Javanese village of Kebon: help us celebrate the lives and hands behind batik through this social-relational art project.',
                'category'          => 'Lifestyle',
                'start_campaign'    => Carbon::parse('2025-03-03'),
                'end_campaign'      => Carbon::parse('2025-12-31'),
                'address'           => 'Pulau Sabuntan, Indonesia',
                'status'            => 'active',
                'goal_amount'       => 1000000000,
                'collected_amount'  => 260626890,
                'duration'          => Carbon::parse('2025-03-03')->diffInDays(Carbon::parse('2025-12-31')),
                'rejected_reason'   => null,
                'created_at'        => Carbon::parse('2025-03-03'),
                'updated_at'        => now(),
            ],
            [
                'user_id'           => $userIds[array_rand($userIds)],
                'verified_by'       => $adminId,
                'title'             => 'Kirim Bantuan Untuk Korban Banjir Sumatra',
                'description'       => 'Pulau Sumatera menghadapi cobaan berat di akhir November 2025, saat dua wilayahnya, Sumatera Barat dan Aceh Utara, serentak dihantam bencana hidrometeorologi parah akibat intensitas hujan yang ekstrem.',
                'category'          => 'Logistics',
                'start_campaign'    => Carbon::parse('2025-11-27'),
                'end_campaign'      => Carbon::parse('2025-12-31'),
                'address'           => 'Sumatera Barat, Indonesia',
                'status'            => 'active',
                'goal_amount'       => 40000000,
                'collected_amount'  => 5660000,
                'duration'          => Carbon::parse('2025-11-27')->diffInDays(Carbon::parse('2025-12-31')),
                'rejected_reason'   => null,
                'created_at'        => Carbon::parse('2025-11-27'),
                'updated_at'        => now(),
            ],
            [
                'user_id'           => $userIds[array_rand($userIds)],
                'verified_by'       => $adminId,
                'title'             => 'SUMUT DARURAT! Krisis Bantuan Korban Pengungsian',
                'description'       => 'Total LEBIH DARI 2.000 warga terkepung banjir dan longsor. Bencana meluas capai 7 daerah, akses jalan dan jembatan utama terputus akibat longsor setinggi 9,5 meter!',
                'category'          => 'Logistics',
                'start_campaign'    => Carbon::parse('2025-07-02'),
                'end_campaign'      => Carbon::parse('2026-01-02'),
                'address'           => 'Sumatera Utara, Indonesia',
                'status'            => 'active',
                'goal_amount'       => 40000000,
                'collected_amount'  => 5660000,
                'duration'          => Carbon::parse('2025-07-02')->diffInDays(Carbon::parse('2026-01-02')),
                'rejected_reason'   => null,
                'created_at'        => Carbon::parse('2025-07-02'),
                'updated_at'        => now(),
            ]
        ];

        foreach($mainCampaign as $campaign){
            Campaign::create($campaign);
        };

        // create thumbnail after seed campaign

        $campaignImages = [
            [
                'thumbnail' => 'campaign_1_Thumbnail.png',
                'logo' => 'campaign_1_Logo.png',
                'campaign_id' => 1,
            ],
            [
                'thumbnail' => 'campaign_2_Thumbnail.avif',
                'logo' => 'campaign_2_Logo.avif',
                'campaign_id' => 2,
            ],
            [
                'thumbnail' => 'campaign_3_Thumbnail.avif',
                'logo' => 'campaign_3_Logo.jpg',
                'campaign_id' => 3,
            ],
            [
                'thumbnail' => 'campaign_4_Thumbnail.avif',
                'logo' => 'campaign_4_Logo.avif',
                'campaign_id' => 4,
            ],
            [
                'thumbnail' => 'campaign_5_Thumbnail.avif',
                'logo' => 'campaign_5_Logo.avif',
                'campaign_id' => 5,
            ],
            [
                'thumbnail' => 'campaign_6_Thumbnail.png',
                'logo' => 'campaign_6_Logo.avif',
                'campaign_id' => 6,
            ],
            [
                'thumbnail' => 'campaign_7_Thumbnail.avif',
                'logo' => 'campaign_7_Logo.avif',
                'campaign_id' => 7,
            ],
            [
                'thumbnail' => 'campaign_8_Thumbnail.webp',
                'logo' => '',
                'campaign_id' => 8,
            ],
            [
                'thumbnail' => 'campaign_9_Thumbnail.avif',
                'logo' => 'campaign_9_Logo.avif',
                'campaign_id' => 9,
            ],
            [
                'thumbnail' => 'campaign_10_Thumbnail.avif',
                'logo' => 'campaign_10_Logo.avif',
                'campaign_id' => 10,
            ],
            [
                'thumbnail' => 'campaign_11_Thumbnail.avif',
                'logo' => '',
                'campaign_id' => 11,
            ],
        ];

        foreach ($campaignImages as $campImage) {

            // build local paths
            $localThumb = public_path("images/onlineCampaignMedia/Thumbnail_Logo/{$campImage['thumbnail']}");
            $localLogo  = public_path("images/onlineCampaignMedia/Thumbnail_Logo/{$campImage['logo']}");

            if (file_exists($localThumb)) {
                $thumbName = basename($campImage['thumbnail']);
                $thumbPath = Storage::disk('minio')->putFileAs(
                    'campaigns/image',
                    new \Illuminate\Http\File($localThumb),
                    $thumbName
                );

                Image::create([
                    'path' => $thumbPath,
                    'imageable_id' => $campImage['campaign_id'],
                    'imageable_type' => Campaign::class,
                ]);
            }

            if ($campImage['logo'] && file_exists($localLogo)) {
                $logoName = basename($campImage['logo']);
                $logoPath = Storage::disk('minio')->putFileAs(
                    'campaigns/image',
                    new \Illuminate\Http\File($localLogo),
                    $logoName
                );

                Image::create([
                    'path' => $logoPath,
                    'imageable_id' => $campImage['campaign_id'],
                    'imageable_type' => Campaign::class,
                ]);
            }
        }


        //create content AFTER campaign is made, and thumbnail is inserted
        // kalo updates, create dlu, baru abis tu buat ada medianya
        // kalo faq karena gaada images or video, cuma question-;answer
        // kalo about dibagi jadi 2 antara media yang simpen link contentnya, or paragraph yang simpen title-;description
        $campaignUpdates = [
            [
                'campaign_id' => 1,
                'type' => 'updates',
                'content' => 'Fully Funded In Just 34 Minutes!~;You are all SO amazing. All of us here at Dragon Roast Coffee want to say thank you for helping us hit our first goal! We funded this campaign in just 34 minutes!!! As of me writing this right now, we are just over 2 hours after launch and have 107 backers, and are 199% funded!

                It is because of YOU that we are able to bring these new coffees to life. Thank you for aiding in our quest our to fuel adventures across game tables everywhere!

                We have some really awesome stretch goals, including plushies and more roasts, so keep spreading the love and sharing the campaign! The support we have been seeing across social media has been amazing and fills our hearts with joy! We love every single one of you.',
            ],
            [
                'campaign_id' => 2,
                'type' => 'updates',
                'content' => "A Little Taste of Whats Coming...~;Dear friends!
                I learned that some of you would like to have a sneak peek at how the book would look - I've heard you!

                Voila! Here it is.

                I am sharing a page of one of my favourite dishes, a recipe that is especially special to me. I hope you feel the warmth of Cambodian cuisine through it and even makes you get hungry.

                Tell me how it makes you feel!

                With love,

                Sopheap 💖 ",
            ],
            [
                'campaign_id' => 4,
                'type' => 'updates',
                'content' => "A Big First Day!~;Holy smokes! You are all so amazing! We are almost 30% into our goal and it's less than 24 hours into our campaign!
                This is such a roller coaster ride and I am so excited and nervous to be sharing SAYA with you at this stage of its life. We have done so well but there is still many late nights to come and the adventure is just beginning!

                Do you know what would be amazing? If you all helped me spread the word and let people know our mission and story!

                The more people that back us the more likely we are to be featured by Kickstarter, which would give us an extra boost in the right direction. Gathering new backers is just as important as the amount people pledge! Every element of support raises our visibility, so please share with anyone that you think would love what we are about!",
            ],
            [
                'campaign_id' => 4,
                'type' => 'updates',
                'content' => "We did it!!~;I truly am so grateful to all of you who showed up to make this happen. WE DID IT!!!!! I'm so excited to bring this to life and get to work. I couldn't have asked for a more positive beginning.... I'm going to keep this short and sweet because oh yea....  I have a business to start! I just wanted to start my day with sending you my gratitude, I really cant thank you enough.",
            ],
            [
                'campaign_id' => 8,
                'type' => 'updates',
                'content' => "We did it!!~;Dear Donors,
                Happy Thanksgiving to you and your family! Renee and Zike have already touched by your generosity and love. They don't feel lonely anymore. Renee is following doctors' instruction trying to gain weight. Zike is optimistic about his future and studying harder while taking care of his Mom. We are currently working with lawyers to make sure that every penny from this fundraising will be used to support Renee's family and Zike's education. We will update you on this matter timely.

                Thank you all again for carrying out our mission: Give a hand, Change a Life!

                Shirley Rainbow",
            ],
            [
                'campaign_id' => 9,
                'type' => 'updates',
                'content' => "Rencana Implementasi Program~;Assalamualaikum Kak :)
                Alhamdulillah antusiasme pembangunan rumah qur'an begitu positif. Terima kasih banyak ya kak. Berikut kami sampaikan rencana penyaluran donasi dari kakak semua.

                Mohon doa agar semuanya berjalan lancar ya kak. supaya para penerima manfaat bisa tersenyum bahagia.
                Waassalamualaikum Wr. Wb",
                'created_at' => '2025-04-15 14:22:00'
            ],
            [
                'campaign_id' => 9,
                'type' => 'updates',
                'content' => "Report Program~;Pembangunan Rumah Qur'an di Mulai,
                Assalamualaikum wr.wb

                BMH Jawa Timur tengah memulai pembangunan Rumah Qur'an di Pulau Sabuntan, Kepulauan Kangean.
                Lokasi ini tepatnya berada di Dusun II, Desa Sabuntan, Kecamatan Sapeken, Kabupaten Sumenep — sebuah wilayah kepulauan yang cukup jauh dari pusat kota dan dihuni oleh masyarakat Suku Bajoe. Alhamdulillah, setelah melalui proses persiapan, kini tim sudah mulai melakukan tahap awal pembangunan berupa pengukuran lahan untuk pondasi.

                Tahap ini menjadi langkah penting sebelum nantinya Rumah Qur'an berdiri kokoh dan bisa digunakan untuk kegiatan belajar mengaji serta pembinaan generasi Qur'ani di daerah pelosok kepulauan.

                Kami memohon doa restu dan dukungan dari sahabat semua agar proses pembangunan ini berjalan lancar, hingga akhirnya dapat benar-benar menjadi pusat cahaya ilmu, dakwah, dan harapan bagi anak-anak serta masyarakat sekitar.

                Terima kasih orangbaik yang selalu membersamai setiap langkah kebaikan.

                Waassalamualaikum wr.wb",
                'created_at' => '2025-06-27 11:56:00'
            ],
            [
                'campaign_id' => 9,
                'type' => 'updates',
                'content' => "Report Program~;Pondasi terbangun dilanjutkan Pemasangan Kusen & Pembangunan Tembok.
                Assalamualaikum wr.wb

                BMH Jawa Timur terus melanjutkan pembangunan Rumah Qur'an di Pulau Sabuntan, Kepulauan Kangean. Alhamdulillah, setelah sebelumnya berhasil menyelesaikan pembangunan pondasi, kini proses berlanjut dengan pengerjaan tembok serta pemasangan kusen pintu dan jendela. Rumah Qur'an ini diharapkan menjadi pusat cahaya ilmu dan tempat anak-anak suku Bajoe belajar membaca, menghafal, serta mengamalkan Al-Qur'an dengan lebih layak. Meski berada di wilayah kepulauan yang jauh dari pusat kota, semangat untuk menghadirkan pendidikan Qur'an tidak pernah padam.

                Semoga proses pembangunan berjalan lancar hingga selesai, dan menjadi ladang amal jariyah yang terus mengalir.
                Terima kasih orangbaik atas doa dan dukungannya.

                Waassalamualaikum wr.wb",
                'created_at' => '2025-08-08 09:06:00'
            ],
            [
                'campaign_id' => 9,
                'type' => 'updates',
                'content' => "Report Program~;Pembangunan Tembok.
                Assalamualaikum wr.wb

                BMH Jawa Timur terus melanjutkan pembangunan Rumah Qur'an di Pulau Sabuntan, Kepulauan Kangean. Alhamdulillah, setelah melalui tahap pondasi, kini tim tengah melanjutkan pengerjaan dengan membangun dinding Rumah Qur'an agar segera dapat digunakan oleh para santri dan masyarakat sekitar. Rumah Qur'an ini diharapkan menjadi pusat cahaya ilmu dan tempat lahirnya generasi Qur'ani di pelosok kepulauan.

                Terima kasih orangbaik atas setiap doa dan dukungannya, semoga setiap batu yang terpasang menjadi pahala jariyah yang terus mengalir.

                Waassalamualaikum wr.wb",
                'created_at' => '2025-10-15 10:30:00'
            ],
            [
                'campaign_id' => 11,
                'type' => 'updates',
                'content' => "Ucapan terima kasih kepada Orang baik~;Kabar Terbaru Peduli Warga Sumatera Utara!
                Hallo!
                Terima kasih kami ucapkan atas dukungan yang diberikan sampai saat ini untuk campaign ini.
                Kami bersyukur saat ini sudah terkumpul donasi lebih dari 600 orang baik yang berdonasi, kemudian kami akan implementasikan untuk membantu korban yang terdampak banjir di Wilayah Sumatera Utara yang menjalani perawatan medis. Demikian informasi kabar terbaru yang dapat kami sampaikan.
                atas perhatian para donatur, kami ucapkan terima kasih .",
                'created_at' => '2025-11-27 10:30:00'
            ],
            [
                'campaign_id' => 11,
                'type' => 'updates',
                'content' => "Ucapan terima kasih kepada Orang baik~;Update kondisi warga di wilayah sumatera utara Dan ucapan Terima Kasih Kepada orang baik
                Hallo semua!
                Terima kasih kami ucapkan kepada seluruh Orang Baik yang hingga kini terus membantu dan berdonasi di campaign ini Untuk memberi Bantuan Pengobatan Pasien di salah satu RSU Tapanuli Selatan Sipirok. Saat ini sudah banyak pasien yang menjadi penerima manfaat dari bantuan yang sudah anda berikan. Berkat bantuanmu, telah menghadirkan kembali senyum cerah para penerima bantuan. Terima kasih , semoga amal baik anda semua dibalas oleh Tuhan dan dapat bermanfaat bagi para penerima manfaat dari program pemberian bantuan untuk para korban banjir bandang dan tanah longsor di wilayah Sumatera Utara.",
                'created_at' => '2025-11-28 10:30:00'
            ],
            [
                'campaign_id' => 11,
                'type' => 'updates',
                'content' => "Ucapan terima kasih kepada Orang baik~;Halo #OrangBaik salam sejahtera untuk kita semua saat ini penyaluran dilakukan di wilayah pengungsian simalingkar Medan.

                Penyaluran bantuan berupa obat-obat, vitamin, makanan dan pemeriksaan kesehatan oleh tim medis

                Jumlah warga yang terdampak banjir sekitar 2000 orang warga dan 450 rumah warga. Untuk warga terdeteksi diagnosa mual, mencret, demam, sesak nafas, batuk. Dan untuk saat ini ada beberapa pasien yang mengalami luka tusukan (kayu, jarum, paku, kaca). Pasien akan dirujuk ke RSU Mitra Sejati untuk suntik tetanus",
                'created_at' => '2025-11-29 10:30:00'
            ],
        ];

        foreach($campaignUpdates as $update){
            CampaignContent::create($update);
        };

        $updateImages = [
            //campaign 1
            [
                'path' => 'updateMedia1.avif',
                'imageable_id' => 1,
                'campaign_id' => 1,
                'imageable_type' => CampaignContent::class
            ],
            //campaign 2
            [
                'path' => 'updateMedia1.avif',
                'imageable_id' => 2,
                'campaign_id' => 2,
                'imageable_type' => CampaignContent::class
            ],
            //campaign 4
            [
                'path' => 'updatesMedia1.avif',
                'imageable_id' => 3,
                'campaign_id' => 4,
                'imageable_type' => CampaignContent::class
            ],
            [
                'path' => 'updatesMedia2.avif',
                'imageable_id' => 3,
                'campaign_id' => 4,
                'imageable_type' => CampaignContent::class
            ],
            //campaign 4_update2
            [
                'path' => 'updatesMedia3.avif',
                'imageable_id' => 4,
                'campaign_id' => 4,
                'imageable_type' => CampaignContent::class
            ],
            //campaign 9_update2
            [
                'path' => 'updateMedia1.jpg',
                'imageable_id' => 7,
                'campaign_id' => 9,
                'imageable_type' => CampaignContent::class
            ],
            [
                'path' => 'updateMedia2.jpg',
                'imageable_id' => 7,
                'campaign_id' => 9,
                'imageable_type' => CampaignContent::class
            ],
            [
                'path' => 'updateMedia3.jpg',
                'imageable_id' => 7,
                'campaign_id' => 9,
                'imageable_type' => CampaignContent::class
            ],
            //campaign 9_update3
            [
                'path' => 'updateMedia4.jpg',
                'imageable_id' => 8,
                'campaign_id' => 9,
                'imageable_type' => CampaignContent::class
            ],
            [
                'path' => 'updateMedia5.jpg',
                'imageable_id' => 8,
                'campaign_id' => 9,
                'imageable_type' => CampaignContent::class
            ],
            [
                'path' => 'updateMedia6.jpg',
                'imageable_id' => 8,
                'campaign_id' => 9,
                'imageable_type' => CampaignContent::class
            ],
            //campaign 9_update4
            [
                'path' => 'updateMedia7.jpg',
                'imageable_id' => 9,
                'campaign_id' => 9,
                'imageable_type' => CampaignContent::class
            ],
            [
                'path' => 'updateMedia8.jpg',
                'imageable_id' => 9,
                'campaign_id' => 9,
                'imageable_type' => CampaignContent::class
            ],
            [
                'path' => 'updateMedia9.jpg',
                'imageable_id' => 9,
                'campaign_id' => 9,
                'imageable_type' => CampaignContent::class
            ],
            //campaign 9_update5
            [
                'path' => 'updateMedia10.jpg',
                'imageable_id' => 10,
                'campaign_id' => 9,
                'imageable_type' => CampaignContent::class
            ],
            [
                'path' => 'updateMedia11.jpg',
                'imageable_id' => 10,
                'campaign_id' => 9,
                'imageable_type' => CampaignContent::class
            ],
            //campaign_11_update2
            [
                'path' => 'updatesMedia1.jpg',
                'imageable_id' => 11,
                'campaign_id' => 11,
                'imageable_type' => CampaignContent::class
            ],
            //campaign 11_update3
            [
                'path' => 'updatesMedia2.jpg',
                'imageable_id' => 12,
                'campaign_id' => 11,
                'imageable_type' => CampaignContent::class
            ],
        ];

        foreach($updateImages as $update){
            $localImg = public_path("images/onlineCampaignMedia/updates/{$update['campaign_id']}/{$update['path']}");
            if (file_exists($localImg)) {
                $imgName = basename($update['path']);
                $imgPath = Storage::disk('minio')->putFileAs(
                    "campaigns/updates/{$update['imageable_id']}",
                    new \Illuminate\Http\File($localImg),
                    $imgName
                );

                Image::create([
                    'path' => $imgPath,
                    'imageable_id' => $update['imageable_id'],
                    'imageable_type' => CampaignContent::class,
                ]);
            }
        }

        $faqs_About = [
            [
                'campaign_id' => 1,
                'type' => 'faqs',
                'content' => 'Where do you source your coffee?~;All over the world! We start with the character class, then select a region + process with flavor notes that will compliment that class!',
            ],
            [
                'campaign_id' => 1,
                'type' => 'faqs',
                'content' => 'Do you offer whole bean and ground coffee?~;Yes! We offer all of our bags of coffee as both whole bean and ground!',
            ],
            [
                'campaign_id' => 1,
                'type' => 'faqs',
                'content' => 'Where are you guys located?~;We operate our roastery in Denver, Colorado. Feel free to stop by sometime and watch us roast!',
            ],
            [
                'campaign_id' => 1,
                'type' => 'faqs',
                'content' => 'Are the bags 10oz or 4oz of coffee?~;All of the kickstarter rewards will be 10oz bags of coffee. We will be offering them as 4oz samples as well on our site after the campaign is fulfilled.',
            ],
            [
                'campaign_id' => 1,
                'type' => 'media',
                'content' => 'media1.png',
                'order_y' => 1,
            ],
            [
                'campaign_id' => 1,
                'type' => 'paragraph',
                'content' => 'Story~;Our coffee is crafted for gamers, by gamers, bringing an enchanted twist to each TTRPG session. With flavor profiles inspired by RPG classes, every sip is an invitation to adventure. We want to bring high quality coffee to every game table. Designed to be accessible to all, Dragon Roast Coffee welcomes every adventurer with straightforward choices and simple preparation—no pretentious rituals here, just great coffee to ease you into your epic narratives.',
                'order_y' => 2,
            ],
            [
                'campaign_id' => 1,
                'type' => 'media',
                'content' => 'media2.webp',
                'order_y' => 3,
            ],
            [
                'campaign_id' => 1,
                'type' => 'paragraph',
                'content' => "Pick Your Class, Sip your brew~;We take a different approach when developing our coffee. Like your favorite RPG characters, each roast is built from the character concept up, focusing on coffee that plays to each class' unique theme. \n Once we have the idea for the character class, we then source coffee beans that will match the flavor profile that most closely aligns with the class. Then, we develop a roast to bring out the notes we are looking for.",
                'order_y' => 4,
            ],
            [
                'campaign_id' => 1,
                'type' => 'media',
                'content' => 'media3.avif',
                'order_y' => 5,
            ],
            [
                'campaign_id' => 1,
                'type' => 'media',
                'content' => 'media4.avif',
                'order_y' => 6,
            ],
            [
                'campaign_id' => 1,
                'type' => 'paragraph',
                'content' => "Who we are~;Dragon Roast Coffee began in February of 2024, from a shed that Ethan built in his back yard with a small little 1 kilogram coffee roaster and a dream. In our first year, we journeyed across the United States to Fan Expos, Comic Cons, Game Dev Expos, Art Markets, Furry Cons, and more to share our beans! In our first year in business we hit the ground running and acomplished some amazing feats! ",
                'order_y' => 7,
            ],
            [
                'campaign_id' => 1,
                'type' => 'media',
                'content' => 'media5.avif',
                'order_y' => 8,
            ],
            [
                'campaign_id' => 1,
                'type' => 'paragraph',
                'content' => 'Our Second Year~;In our second year of business we have only grown... exponentially! We quickly outgrew our small roasting space and moved into a bigger warehouse location with a MUCH bigger coffee roaster and more space for order fulfillment to  help with our growing needs.

                We have also more than doubled our amount of events we have been going to, with over 24 events we will have done by the end of the year. We are not slowing down any time soon and are on a quest to bring better coffee to gamers everywhere! Our goals are to continue to grow and this will only be our  first of hopefully MANY more campaigns to come!',
                'order_y' => 9,
            ],
            [
                'campaign_id' => 1,
                'type' => 'media',
                'content' => 'media6.webp',
                'order_y' => 10,
            ],
            [
                'campaign_id' => 2,
                'type' => 'media',
                'content' => 'media1.avif',
                'order_y' => 1,
            ],
            [
                'campaign_id' => 2,
                'type' => 'paragraph',
                'content' => "No fiddling or wasting time - just real food~;Hello! My name is Sopheap. I was born and raised in Cambodia, but I have been living abroad for many years now. While immigration brings new opportunities, there is still a quiet longing for my homeland and the familiar tastes of my childhood in my heart.

                This is what inspired me to preserve a piece of that family atmosphere at the table by creating this cookbook with recipes from Khmer cuisine.
                No matter how difficult your day has been, everyone dreams of returning home where a warm, delicious dinner is waiting on the table. In exchange for this memory that I hold dear, I want to share with the world the taste of authentic Khmer food - warm, family-oriented, and genuine. Because food can bring people together, even when distance separates us.

                Recipes from Cambodia is not just a collection of recipes - it is the story of Cambodian family warmth told through food. It is an invitation into a Khmer home's kitchen, where every aroma is connected to memories, holidays, traditions, and care.
                And, of course, those secret ingredients that you won't find in any cooking show - only in memories and love passed down through generations. ",
                'order_y' => 2,
            ],
            [
                'campaign_id' => 2,
                'type' => 'paragraph',
                'content' => "What will you find in the book?~;On the 120 pages of this book, you will find not only step-by-step instructions but also lively photographs, personal stories, and interesting cultural facts that will help you truly feel the atmosphere of a Cambodian home.

                Inside, you'll find more than 60 appetizing and savory recipes - dishes prepared in ordinary Cambodian households, with accessible ingredients, simple steps, and soul.

                This book is written in the voice of a Cambodian mom. I made sure you feel like you're reading a letter from a close person, sharing with you the dearest memories and flavors of their childhood.",
                'order_y' => 3,
            ],
            [
                'campaign_id' => 2,
                'type' => 'media',
                'content' => 'media2.avif',
                'order_y' => 4,
            ],
            [
                'campaign_id' => 2,
                'type' => 'paragraph',
                'content' => "Why is your support so important?~;This cookbook is my way of preserving family culture. Living far from home, you understand how fragile the connection to your roots can be. In the conditions of immigration and constant changes, I want my children and grandchildren to know who they are, through taste, smell, traditions, and culture.",
                'order_y' => 5,
            ],
            [
                'campaign_id' => 2,
                'type' => 'media',
                'content' => 'media3.avif',
                'order_y' => 6,
            ],
            [
                'campaign_id' => 3,
                'type' => 'faqs',
                'content' => 'What is Wild & Co?~;Wild & Co is a small food start-up based in Donegal, Ireland. We make clean, savoury protein snacks from 100% wild Irish venison. Our goal is simple: real food that supports active people and regenerative farming.',
            ],
            [
                'campaign_id' => 3,
                'type' => 'faqs',
                'content' => 'Why venison?~;Venison is one of the most nutritious and sustainable meats on the planet. Across Ireland, wild deer numbers are high and need to be managed to help protect native woodland and biodiversity. By using this wild resource, we create healthy food while helping the land recover.',
            ],
            [
                'campaign_id' => 3,
                'type' => 'faqs',
                'content' => 'Is the venison farmed?~;No. All of our venison comes from wild Irish deer that are ethically and sustainably harvested under licence. Nothing farmed, nothing imported.',
            ],
            [
                'campaign_id' => 3,
                'type' => 'media',
                'content' => 'media1.avif',
                'order_y' => 1,
            ],
            [
                'campaign_id' => 3,
                'type' => 'paragraph',
                'content' => "🌿 Our Story~;Wild & Co is a new Donegal food company turning Ireland's wild venison into clean, high-protein snacks — real food with no junk, no artificial preservatives, and a story rooted in the land.  Back our first production run and help bring sustainable wild protein to life.

                We're Laura and John from Donegal.

                Laura loves food, fitness and being outdoors. John is a regenerative farmer who spends his days bringing life back to the land. Together, we're building Wild & Co, a new kind of protein snack company that puts nature first.

                For years, Laura searched for a protein snack that actually fit her lifestyle — something savoury, clean and satisfying. Everything she found was sweet, over-processed or full of ingredients she couldn't pronounce.

                Meanwhile, John was managing wild deer numbers on the family farm to help native woodlands regenerate.

                One evening it clicked — the challenge of too many deer could be an opportunity; a source of pure, sustainable, high-quality protein.",
                'order_y' => 2,
            ],
            [
                'campaign_id' => 3,
                'type' => 'media',
                'content' => 'media2.avif',
                'order_y' => 3,
            ],
            [
                'campaign_id' => 3,
                'type' => 'paragraph',
                'content' => "🍖The Product~;Garlic & Black Pepper
                INGREDIENTS: Venison (91%), Water, Salt, Natural Flavor, Salt, Antioxidant
                Ascorbic Acid, Garlic Powder, Ground Black Pepper, Onion Powder.

                Chilli & Garlic
                INGREDIENTS: Venison (88%), Water, Salt, Smoked Paprika, Hot Chilli
                Powder (chilli (60%), Paprika), Natural Flavor, Salt, Antioxidant Ascorbic
                Acid, Garlic Powder, Onion Granules, Cayenne Pepper, Oregano, Ground
                Coriander, Ground Black Pepper, Ground Cumin.",
                'order_y' => 4,
            ],
            [
                'campaign_id' => 3,
                'type' => 'media',
                'content' => 'media3.avif',
                'order_y' => 3,
            ],
            [
                'campaign_id' => 3,
                'type' => 'paragraph',
                'content' => "🌍 Why It Matters~;Wild & Co began with one belief: food can heal more than hunger.
                Every pack of Venison Sticks supports regeneration of Ireland’s biodiversity and helps create sustainable local jobs  here in the Donegal Gaeltacht.

                This project is about more than a snack — it’s proof that good food can restore land, community and health at the same time.

                Our supply chain retains value in our communities: wild Irish venison, seasoned and finished in Donegal.",
                'order_y' => 6,
            ],
            [
                'campaign_id' => 3,
                'type' => 'media',
                'content' => 'media4.avif',
                'order_y' => 7,
            ],
        ];

        foreach ($faqs_About as $tabsData) {

            if ($tabsData['type'] == 'media') {
                $localImg = public_path("images/onlineCampaignMedia/about/{$tabsData['campaign_id']}/{$tabsData['content']}");
                if (file_exists($localImg)) {
                    $imgName = basename($tabsData['content']);
                    $imgPath = Storage::disk('minio')->putFileAs(
                        "campaigns/about/{$tabsData['campaign_id']}",
                        new \Illuminate\Http\File($localImg),
                        $imgName
                    );
                    CampaignContent::create([
                        'campaign_id' => $tabsData['campaign_id'],
                        'type' => 'media',
                        'content' => $imgPath,
                        'order_y' => $tabsData['order_y']
                    ]);
                }
            } else {
                CampaignContent::create($tabsData);
            };
        };
    }
}
