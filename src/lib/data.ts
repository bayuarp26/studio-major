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
      topTitle: "Harisenin.com",
      handle: "harisenincom",
      logoUrl: "https://placehold.co/100x100.png",
      imageHint: "education logo",
      title: "Kampanye Harisenin.com",
      description: "Meningkatkan kesadaran merek dan produk melalui media sosial. Hasil: Pertumbuhan follower +30%, Jangkauan brand 100.000+, Engagement 5%+, Leads baru 100+.",
      tags: ["Social Media", "Campaign", "Lead Generation"],
    },
    {
      topTitle: "Temacoffeandspace",
      handle: "temacoffeeandspace",
      logoUrl: "https://placehold.co/100x100.png",
      imageHint: "coffee logo",
      title: "Identitas Merek TEMA Coffee & Space",
      description: "Mengembangkan identitas merek yang kuat untuk TEMA Coffee & Space dengan melakukan analisis pasar mendalam dan riset audiens. Fokus pada penguatan posisi pasar dan pengembangan pesan yang resonan.",
      tags: ["Branding", "Market Research", "Strategy"],
    },
    {
      topTitle: "TukangSayur.co",
      handle: "tukangsayurco",
      logoUrl: "https://placehold.co/100x100.png",
      imageHint: "vegetable logo",
      title: "Analisis Media Sosial TukangSayur.co",
      description: "Menganalisis kinerja media sosial menggunakan tools seperti Social Blade dan strategi konten.",
      tags: ["Social Media", "Analysis", "Content Strategy"],
    },
     {
      topTitle: "Kanenakan",
      handle: "kanenakan",
      logoUrl: "https://placehold.co/100x100.png",
      imageHint: "donut logo",
      title: "Strategi Konten Kanenakan (Donat)",
      description: "Creative copywriting & visual strategy untuk meningkatkan interaksi pelanggan melalui Reels, carousel, UGC, dll.",
      tags: ["Copywriting", "Visual Strategy", "UGC"],
    },
    {
      topTitle: "Sambal Sarumpet",
      handle: "sambalsarumpet",
      logoUrl: "https://placehold.co/100x100.png",
      imageHint: "chili logo",
      title: "Branding Sambal Sarumpet",
      description: "Menekankan warisan rasa dan keautentikan lewat tone naratif, close-up visual, dan emoji kuliner.",
      tags: ["Branding", "Storytelling", "Visuals"],
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
