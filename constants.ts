import { GradeLevel, SubjectModule, ThemeConfig, BannerImage } from './types';

export const APP_NAME = "InfoPintar";

export const THEMES: Record<string, ThemeConfig> = {
  ocean: {
    id: 'ocean',
    name: 'Samudra Biru',
    primary: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-700',
    secondary: 'bg-blue-50',
    text: 'text-blue-700',
    lightText: 'text-blue-600',
    accent: 'border-blue-200',
    ring: 'focus:ring-blue-500'
  },
  nature: {
    id: 'nature',
    name: 'Hutan Hijau',
    primary: 'bg-emerald-600',
    primaryHover: 'hover:bg-emerald-700',
    secondary: 'bg-emerald-50',
    text: 'text-emerald-700',
    lightText: 'text-emerald-600',
    accent: 'border-emerald-200',
    ring: 'focus:ring-emerald-500'
  },
  royal: {
    id: 'royal',
    name: 'Ungu Kreatif',
    primary: 'bg-violet-600',
    primaryHover: 'hover:bg-violet-700',
    secondary: 'bg-violet-50',
    text: 'text-violet-700',
    lightText: 'text-violet-600',
    accent: 'border-violet-200',
    ring: 'focus:ring-violet-500'
  },
  sunset: {
    id: 'sunset',
    name: 'Senja Oranye',
    primary: 'bg-orange-600',
    primaryHover: 'hover:bg-orange-700',
    secondary: 'bg-orange-50',
    text: 'text-orange-700',
    lightText: 'text-orange-600',
    accent: 'border-orange-200',
    ring: 'focus:ring-orange-500'
  }
};

const DEFAULT_CONTENT = `
<h2>Pendahuluan</h2>
<p>Materi ini belum diisi secara lengkap oleh Admin.</p>
<p>Silakan login ke <strong>Dashboard Admin</strong> untuk mengedit materi ini. Anda dapat menambahkan:</p>
<ul>
<li>Teks penjelasan</li>
<li>Video dan Gambar</li>
<li>Tabel dan Link</li>
</ul>
`;

export const AVAILABLE_ICONS = [
  'cpu', 'network', 'code', 'database', 'shield', 'layout', 'folder', 
  'calendar', 'workflow', 'disc', 'bar-chart', 'scale', 'lock', 'mouse', 'monitor', 'wifi',
  'terminal', 'cloud', 'server', 'smartphone', 'tablet', 'hard-drive', 'printer', 'speaker',
  'video', 'camera', 'message-square', 'mail', 'user', 'globe',
  // New Icons
  'binary', 'brain', 'bug', 'circuit-board', 'command', 'file-code', 'fingerprint', 'gamepad-2',
  'git-branch', 'headphones', 'key', 'laptop', 'lightbulb', 'link', 'mic', 'music',
  'pen-tool', 'power', 'radio', 'save', 'settings', 'signal', 'table', 'tag', 'tool',
  'trash', 'tv', 'type', 'upload', 'zap'
];

export const DEFAULT_BANNERS: BannerImage[] = [
  {
    id: 'b1',
    url: 'https://images.unsplash.com/photo-1531297461136-82fe3b22d065?q=80&w=1000&auto=format&fit=crop',
    title: 'Selamat Datang di InfoPintar'
  },
  {
    id: 'b2',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    title: 'Belajar Coding Sejak Dini'
  },
  {
    id: 'b3',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
    title: 'Keamanan Digital & Cyber Security'
  }
];

export const CURRICULUM_DATA: SubjectModule[] = [
  // --- KELAS 7 ---
  {
    id: 'g7-bk',
    title: 'Berpikir Komputasional (BK)',
    grade: GradeLevel.Grade7,
    topics: [
      {
        id: 'g7-bk-1',
        title: 'Algoritma Dasar',
        description: 'Memahami langkah-langkah logis penyelesaian masalah.',
        iconName: 'workflow',
        contentSummary: 'Algoritma adalah urutan langkah-langkah logis untuk menyelesaikan masalah yang disusun secara sistematis.',
        materials: [
          {
            id: 'm1',
            title: 'Pengertian Algoritma',
            content: `<h2>Pengertian Algoritma</h2>
<p>Algoritma adalah urutan langkah-langkah logis penyelesaian masalah yang disusun secara sistematis dan logis. Kata "logis" merupakan kata kunci dalam algoritma.</p>

<h3>Ciri-Ciri Algoritma</h3>
<ol>
<li><strong>Ada Input</strong>: Masukan yang akan diproses.</li>
<li><strong>Ada Proses</strong>: Langkah-langkah yang jelas.</li>
<li><strong>Ada Output</strong>: Hasil dari pemrosesan.</li>
</ol>`,
            quizzes: [
              {
                id: 'q1',
                question: 'Apa kata kunci utama dalam definisi algoritma?',
                options: ['Cepat', 'Logis', 'Mahal', 'Rahasia'],
                correctAnswerIndex: 1,
                explanation: 'Algoritma harus logis, artinya setiap langkah dapat ditentukan nilai kebenarannya (benar/salah).'
              }
            ],
            assignments: [
              {
                id: 'a1',
                title: 'Buat Algoritma Memasak Nasi',
                description: 'Tuliskan langkah-langkah memasak nasi menggunakan rice cooker di buku catatanmu.',
                dueDate: '2023-12-31'
              }
            ]
          },
          {
            id: 'm2',
            title: 'Flowchart',
            content: `<h2>Bagan Alir (Flowchart)</h2><p>Flowchart adalah representasi grafis dari langkah-langkah algoritma.</p>`,
            quizzes: [],
            assignments: []
          }
        ]
      },
      {
        id: 'g7-bk-2',
        title: 'Optimasi Penjadwalan',
        description: 'Belajar mengatur waktu dan sumber daya secara efisien.',
        iconName: 'calendar',
        contentSummary: 'Optimasi penjadwalan berkaitan dengan bagaimana kita menyusun rangkaian kegiatan agar selesai tepat waktu.',
        materials: [
          { 
            id: 'def', 
            title: 'Pendahuluan', 
            content: DEFAULT_CONTENT,
            quizzes: [],
            assignments: []
          }
        ]
      }
    ]
  },
  {
    id: 'g7-sk',
    title: 'Sistem Komputer',
    grade: GradeLevel.Grade7,
    topics: [
      {
        id: 'g7-sk-1',
        title: 'Perangkat Keras (Hardware)',
        description: 'Input, Process, Output, dan Storage device.',
        iconName: 'cpu',
        contentSummary: 'Hardware adalah komponen fisik komputer.',
        materials: [
          { 
            id: 'hw-1', 
            title: 'Perangkat Input', 
            content: '<h2>Perangkat Input</h2><p>Perangkat keras yang digunakan untuk memasukkan data. Contoh: Keyboard, Mouse, Scanner.</p>',
            quizzes: [
                {
                    id: 'qh1',
                    question: 'Mana yang termasuk perangkat input?',
                    options: ['Monitor', 'Speaker', 'Mouse', 'Printer'],
                    correctAnswerIndex: 2,
                    explanation: 'Mouse digunakan untuk memasukkan perintah.'
                }
            ],
            assignments: []
          },
          { 
            id: 'hw-2', 
            title: 'Perangkat Proses', 
            content: '<h2>Perangkat Proses</h2><p>Otak komputer yang memproses data. Contoh: CPU (Processor), RAM.</p>',
            quizzes: [],
            assignments: []
          },
          { 
            id: 'hw-3', 
            title: 'Perangkat Output', 
            content: '<h2>Perangkat Output</h2><p>Perangkat yang menampilkan hasil pemrosesan. Contoh: Monitor, Printer, Speaker.</p>',
            quizzes: [],
            assignments: []
          }
        ]
      }
    ]
  }
];