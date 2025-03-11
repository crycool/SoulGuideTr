/**
 * Rüya ve bilinçaltı ile ilgili alıntılar koleksiyonu
 * İçgörü sayfasında ve analiz detaylarında kullanılacak
 */

interface Quote {
  text: string;
  author: string;
}

// Alıntılar koleksiyonu
const quotes: Quote[] = [
  // Carl Jung Alıntıları
  {
    text: "Rüyalar, bilinçaltımızın işleyişine açılan pencerelere benzer.",
    author: "Carl Jung"
  },
  {
    text: "Kişiliğimizdeki kötü tarafları kabul etmediğimiz sürece, yaşamımızı gerçekten kontrol edemeyiz.",
    author: "Carl Jung"
  },
  {
    text: "Semboller, bilincin anlayamadığı şeyleri anlatmak için bilinçdışının kullandığı dildir.",
    author: "Carl Jung"
  },
  {
    text: "Rüyalar, egonuzun duymak istemediği şeyleri söylemez, bilmeniz gereken şeyleri söyler.",
    author: "Carl Jung"
  },
  {
    text: "Bilincimiz ırmağa, bilinçaltımız ise okyanusa benzer.",
    author: "Carl Jung"
  },
  {
    text: "Kim içe bakmazsa, dışa yansıtır. Dışa yansıtılan şey her zaman kendimizdir.",
    author: "Carl Jung"
  },
  {
    text: "Rüyalarla bağlantı kurduğumuzda, bilinçaltının engin bilgeliğiyle bağlantı kurarız.",
    author: "Carl Jung"
  },
  {
    text: "Her rüya, rüyayı gören kişinin bir parçasıdır.",
    author: "Carl Jung"
  },
  
  // Sigmund Freud Alıntıları
  {
    text: "Rüyalar, bilinçdışına giden kral yoludur.",
    author: "Sigmund Freud"
  },
  {
    text: "Rüyalar bastırılmış arzuların ifadesidir.",
    author: "Sigmund Freud"
  },
  {
    text: "Rüyalar size kendiniz hakkında bilmediğiniz şeyleri söyler.",
    author: "Sigmund Freud"
  },
  
  // Diğer Psikoloji/Felsefe Uzmanları
  {
    text: "Rüyalar, gerçeğin tam olarak göremediğimiz yönlerini yansıtan bir aynadır.",
    author: "Edgar Cayce"
  },
  {
    text: "Rüyalar, gün içinde çözemediğimiz sorunlara çözüm bulmak için beynimizin çalışmasıdır.",
    author: "Aristoteles"
  },
  {
    text: "Bilinçaltımız, uyanık olduğumuzda göremediğimiz şeyleri bize rüyalarda gösterir.",
    author: "James Hillman"
  },
  {
    text: "Rüyalar, zihnin karanlık köşelerine tutulmuş bir fenere benzer.",
    author: "Joseph Campbell"
  },
  {
    text: "Rüyaların amacı, bilinçli zihnimizin henüz fark etmediği içsel gerçekleri ortaya çıkarmaktır.",
    author: "Marie-Louise von Franz"
  },
  {
    text: "Rüyalar, içsel evriminizi hızlandırmak için güçlü bir araçtır.",
    author: "Robert Moss"
  },
  {
    text: "En derin içgörüler, uyanık mantığımızın ötesindeki rüya dünyasında bulunur.",
    author: "Erich Fromm"
  },
  {
    text: "Benliğin bilgeliği, rüyalarda ortaya çıkan sembollerle konuşur.",
    author: "Edward Whitmont"
  },
  {
    text: "Rüyalarımız, günlük hayatta ifade edemediğimiz duyguların sesi olur.",
    author: "Calvin Hall"
  },
  {
    text: "Bilinçaltı, rüyalarımız aracılığıyla bizimle iletişim kurmaya çalışır.",
    author: "Ann Faraday"
  },
  {
    text: "Tekrarlayan rüyalar, çözmemiz gereken içsel çatışmaların mesajlarıdır.",
    author: "Patricia Garfield"
  },
  {
    text: "Rüyalardaki semboller, kişisel gelişimimizin haritasıdır.",
    author: "Robert Johnson"
  },
  {
    text: "Rüyaları hatırlamak, kendimizle daha derin bir bağ kurmaktır.",
    author: "Jeremy Taylor"
  },
  {
    text: "Bilinçli zihin sorgular, bilinçaltı cevaplar; rüyalar bu diyaloğun ürünüdür.",
    author: "William C. Dement"
  },
  {
    text: "Gölgemizle yüzleşmeyi öğrendiğimizde, gerçek kendimizle tanışırız.",
    author: "Clarissa Pinkola Estés"
  },
  {
    text: "Bilinçdışı ile bilinçli diyalog, kendini anlama yolunda atılan en büyük adımdır.",
    author: "Irvin D. Yalom"
  },
  {
    text: "Rüyaları anlamak, kendi iç dünyamızın dilini öğrenmektir.",
    author: "Fritz Perls"
  },
  {
    text: "Her rüya, çözülmemiş bir sorunun bilinçdışı çözümüdür.",
    author: "Ernest Hartmann"
  }
];

// Rastgele bir alıntı döndüren yardımcı fonksiyon
const getRandomQuote = (): Quote => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

// Son kullanılan alıntıları takip eden bir dizi
let recentlyUsedQuotes: number[] = [];
const MAX_RECENT_QUOTES = 10; // Son kullanılan kaç alıntıyı takip edeceğiz

// Yakın zamanda kullanılmamış rastgele bir alıntı döndürür
const getUniqueRandomQuote = (): Quote => {
  // Eğer tüm alıntılar son zamanlarda kullanıldıysa, takip listesini sıfırla
  if (recentlyUsedQuotes.length >= Math.min(MAX_RECENT_QUOTES, quotes.length)) {
    recentlyUsedQuotes = [];
  }
  
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * quotes.length);
  } while (recentlyUsedQuotes.includes(randomIndex));
  
  // Bu alıntıyı son kullanılanlar listesine ekle
  recentlyUsedQuotes.push(randomIndex);
  
  return quotes[randomIndex];
};

// Spesifik bir yazara ait rastgele bir alıntı döndürür
const getRandomQuoteByAuthor = (authorName: string): Quote | null => {
  const authorQuotes = quotes.filter(quote => quote.author.toLowerCase().includes(authorName.toLowerCase()));
  
  if (authorQuotes.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * authorQuotes.length);
  return authorQuotes[randomIndex];
};

// Tüm yardımcıları dışa aktar
export const insightHelpers = {
  getRandomQuote,
  getUniqueRandomQuote,
  getRandomQuoteByAuthor,
  getAllQuotes: () => quotes
};

export default insightHelpers;