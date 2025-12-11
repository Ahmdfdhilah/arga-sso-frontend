import { Link } from 'react-router';
import { HiArrowLeft, HiShieldCheck, HiLockClosed, HiUserCircle, HiDatabase, HiClock } from 'react-icons/hi';
import logoAbi from '@/assets/logo-lightmode-kecil.png';

const sections = [
  {
    id: 'data-dikumpulkan',
    icon: HiDatabase,
    title: 'Data yang Dikumpulkan',
    content: [
      {
        subtitle: 'Informasi Identitas',
        items: [
          'Nama lengkap dan alamat email untuk identifikasi akun',
          'Nomor telepon (opsional) untuk verifikasi tambahan',
          'Foto profil (opsional) untuk personalisasi akun',
        ],
      },
      {
        subtitle: 'Informasi Autentikasi',
        items: [
          'Credential login yang terenkripsi',
          'Token akses dan refresh untuk sesi aktif',
          'Informasi perangkat dan browser untuk keamanan',
        ],
      },
      {
        subtitle: 'Log Aktivitas',
        items: [
          'Waktu login dan logout',
          'Alamat IP dan lokasi umum',
          'Riwayat akses ke aplikasi terintegrasi',
        ],
      },
    ],
  },
  {
    id: 'penggunaan-data',
    icon: HiUserCircle,
    title: 'Penggunaan Data',
    content: [
      {
        subtitle: 'Tujuan Penggunaan',
        items: [
          'Menyediakan akses Single Sign-On ke aplikasi Arga Bumi Indonesia',
          'Memverifikasi identitas dan mengamankan akun Anda',
          'Mengelola sesi dan hak akses ke berbagai layanan',
          'Mendeteksi dan mencegah aktivitas mencurigakan atau fraud',
          'Meningkatkan kualitas layanan berdasarkan pola penggunaan',
        ],
      },
    ],
  },
  {
    id: 'keamanan-data',
    icon: HiLockClosed,
    title: 'Keamanan Data',
    content: [
      {
        subtitle: 'Langkah Perlindungan',
        items: [
          'Enkripsi end-to-end untuk semua data sensitif',
          'Protokol OAuth 2.0 dan OpenID Connect standar industri',
          'Token dengan masa berlaku terbatas dan rotasi otomatis',
          'Audit keamanan berkala dan pemantauan real-time',
          'Akses berbasis peran dengan prinsip least privilege',
        ],
      },
    ],
  },
  {
    id: 'hak-pengguna',
    icon: HiShieldCheck,
    title: 'Hak Pengguna',
    content: [
      {
        subtitle: 'Anda Memiliki Hak Untuk',
        items: [
          'Mengakses dan melihat data pribadi yang kami simpan',
          'Memperbarui atau memperbaiki informasi yang tidak akurat',
          'Menghapus akun dan data terkait (right to be forgotten)',
          'Menarik persetujuan penggunaan data kapan saja',
          'Mengunduh salinan data Anda dalam format yang dapat dibaca',
        ],
      },
    ],
  },
  {
    id: 'retensi-data',
    icon: HiClock,
    title: 'Penyimpanan Data',
    content: [
      {
        subtitle: 'Periode Retensi',
        items: [
          'Data akun aktif disimpan selama akun Anda masih aktif',
          'Log aktivitas disimpan maksimal 12 bulan untuk keamanan',
          'Data sesi dihapus otomatis setelah logout atau kadaluarsa',
          'Data akun yang dihapus akan dihapus permanen dalam 30 hari',
        ],
      },
    ],
  },
  // {
  //   id: 'kontak',
  //   icon: HiMail,
  //   title: 'Hubungi Kami',
  //   content: [
  //     {
  //       subtitle: 'Pertanyaan tentang Privasi',
  //       items: [
  //         'Email: privacy@argabumi.co.id',
  //         'Alamat: Arga Bumi Indonesia, Jakarta, Indonesia',
  //         'Waktu respons: 1-3 hari kerja',
  //       ],
  //     },
  //   ],
  // },
];

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/login"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <HiArrowLeft className="h-5 w-5" />
         
          </Link>
          <img src={logoAbi} alt="Arga Bumi Indonesia" className="h-8 w-auto" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12"> 
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Kebijakan Privasi
          </h1>
          <p className="text-muted-foreground text-lg">
            Terakhir diperbarui: Desember 2025
          </p>
          <div className="mt-6 p-4 bg-card rounded-lg border border-border">
            <p className="text-foreground">
              Arga Bumi Indonesia berkomitmen melindungi privasi Anda. Kebijakan ini menjelaskan
              bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda saat menggunakan
              layanan Single Sign-On (SSO) kami.
            </p>
          </div>
        </div>

        <nav className="mb-12 p-4 bg-card rounded-lg border border-border">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Daftar Isi
          </h2>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                  <section.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
              </div>
              <div className="space-y-6">
                {section.content.map((block, blockIndex) => (
                  <div key={blockIndex} className="bg-card rounded-lg border border-border p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      {block.subtitle}
                    </h3>
                    <ul className="space-y-3">
                      {block.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-16 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 Arga Bumi Indonesia. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
