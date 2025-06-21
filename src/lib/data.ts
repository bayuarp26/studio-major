import { Target, Briefcase, Leaf, Users, Handshake } from "lucide-react";

export const portfolioData = {
  name: "Wahyu Pratomo",
  title: "Social Media Specialist | Digital Marketing",
  about: "Saya Wahyu Pratomo, seorang Spesialis Media Sosial dengan fokus pada Pemasaran Digital dan Kinerja Pemasaran. Telah berkecimpung di industri ini selama 9 bulan terakhir. Saya suka bekerja dengan merek-merek yang memiliki misi, serta senang merepresentasikan produk di media sosial.",
  cvUrl: "#",
  contact: {
    email: "mailto:wahyupratomo187@gmail.com",
    linkedin: "",
  },
  skills: [
    { name: "Digital Marketing", icon: Target, description: "Strategi dan eksekusi kampanye pemasaran digital." },
    { name: "Project Management", icon: Briefcase, description: "Mengelola proyek dari konsepsi hingga selesai." },
    { name: "Sustainable Design", icon: Leaf, description: "Prinsip desain yang berfokus pada dampak lingkungan." },
    { name: "Client Communication", icon: Users, description: "Membangun hubungan yang kuat dengan klien." },
    { name: "Team Collaboration", icon: Handshake, description: "Bekerja secara efektif dalam tim untuk mencapai tujuan." },
  ],
  projects: [
    {
      title: "Kampanye Harisenin.com",
      description: "Meningkatkan kesadaran merek dan produk melalui media sosial. Hasil: Pertumbuhan follower +30%, Jangkauan brand 100.000+, Engagement 5%+, Leads baru 100+.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "marketing campaign",
      liveUrl: "",
      sourceUrl: "",
    },
    {
      title: 'Brand Identity - TEMA "Coffee & Space"',
      description: "Analisis identitas merek untuk memperkuat posisi di pasar dan menarik pelanggan baru.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "brand identity coffee",
      liveUrl: "",
      sourceUrl: "",
    },
    {
      title: "Social Media Analysis - TukangSayur.co",
      description: "Menganalisis kinerja media sosial menggunakan tools seperti Social Blade dan strategi konten.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "social media analysis",
      liveUrl: "",
      sourceUrl: "",
    },
     {
      title: "Kanenakan (Donat)",
      description: "Creative copywriting & visual strategy untuk meningkatkan interaksi pelanggan melalui Reels, carousel, UGC, dll.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "creative copywriting food",
      liveUrl: "",
      sourceUrl: "",
    },
    {
      title: "Sambal Sarumpet",
      description: "Menekankan warisan rasa dan keautentikan lewat tone naratif, close-up visual, dan emoji kuliner.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "food product marketing",
      liveUrl: "",
      sourceUrl: "",
    },
  ],
  certificates: [
    {
      name: 'Mahasiswa Tingkat Akhir',
      issuer: 'Sekolah Tinggi Teknologi Indonesia',
      date: '2020 - 2025',
      url: '#'
    },
    {
      name: 'Lulusan Bootcamp Digital Marketing',
      issuer: 'Harisenin.com',
      date: 'Lulus',
      url: '#'
    }
  ],
};
