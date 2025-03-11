// Jung'un arketipleri hakkında bilgiler
interface ArchetypeMeaning {
  title: string;
  description: string;
  examples: string[];
}

// Arketip açıklamaları veritabanı
const archetypeDatabase: Record<string, ArchetypeMeaning> = {
  'Persona': {
    title: 'Persona (Maske)',
    description: 'Persona, toplumsal beklentilere uyum sağlamak için taktığımız maskedir. Bu, dış dünyaya göstermeyi seçtiğimiz yüzümüz ve sosyal kimliğimizdir. Rüyalarınızda Persona arketipi, sosyal beklentiler ve toplumsal rollerle ilgili çatışmaları, kendinizi başkalarına nasıl sunduğunuzu ve gerçek benliğinizle sosyal kimliğiniz arasındaki gerilimi yansıtır.',
    examples: [
      'Farklı kıyafetler denemeniz veya kıyafet değiştirmeniz',
      'Sahne üzerinde veya seyirci önünde olmanız',
      'Maske takmak veya maskeler',
      'İş görüşmesi veya resmi bir etkinlikte bulunmanız',
      'Aynalara bakmak veya birden fazla yansımanızı görmek'
    ]
  },
  'Gölge': {
    title: 'Gölge (Shadow)',
    description: 'Gölge, bilinçli benliğimizin reddettiği ve bastırdığı karanlık, ilkel veya sosyal açıdan kabul edilemez yönlerimizi temsil eder. Rüyalarınızda Gölge arketipi genellikle tehdit edici, korkutucu veya rahatsız edici figürler olarak görünür. Bu figürler, kendinizde kabul etmekte zorlandığınız, bastırdığınız veya tanımadığınız özelliklerinizi temsil eder.',
    examples: [
      'Sizi takip eden veya tehdit eden karanlık figürler',
      'Garip veya tehlikeli yabancılar',
      'Aynı cinsiyetten tanımadığınız biri',
      'Labirentler veya karanlık, esrarengiz yerler',
      'Bastırılmış dürtüleri (öfke, kıskançlık, açgözlülük) yansıtan eylemler'
    ]
  },
  'Anima': {
    title: 'Anima (Erkekteki Dişi Yön)',
    description: 'Anima, erkeklerin bilinçdışındaki dişil yönlerini temsil eder. Bu, duygusallık, empati, yaratıcılık ve sezgisellik gibi niteliklerle ilişkilidir. Rüyalarınızda Anima, genellikle çekici veya etkileyici bir kadın figürü olarak görünür ve erkeklerin duygusal ve sezgisel yönlerini keşfetmelerine yardımcı olur.',
    examples: [
      'Esrarengiz veya büyüleyici kadın figürleri',
      'Bilge yaşlı kadınlar veya genç kızlar',
      'İlham veren veya rehberlik eden kadın karakterler',
      'Aşık olma veya romantik etkileşimler',
      'Dişil sembollerle etkileşim (ay, deniz, çiçekler)'
    ]
  },
  'Animus': {
    title: 'Animus (Kadındaki Erkek Yön)',
    description: 'Animus, kadınların bilinçdışındaki eril yönlerini temsil eder. Bu, mantık, analitik düşünce, güç ve irade gibi niteliklerle ilişkilidir. Rüyalarınızda Animus, genellikle erkek figürleri olarak görünür ve kadınların mantıksal ve kararlılık gerektiren yönlerini keşfetmelerine yardımcı olur.',
    examples: [
      'Güçlü veya otoriter erkek figürleri',
      'Bilge yaşlı adamlar veya genç erkekler',
      'Lider, kahraman veya rehber erkek karakterler',
      'Eril sembollerle etkileşim (güneş, dağlar, kılıç)',
      'Cesaret veya kararlılık gerektiren eylemler'
    ]
  },
  'Kendilik': {
    title: 'Kendilik (Self)',
    description: 'Kendilik, psişenin bütünleşmesini temsil eden ve bireyleşme sürecinin nihai hedefi olan arketiptir. Rüyalarınızda Kendilik arketipi, genellikle bütünlük, dengelenme ve uyum sembolü olarak belirir. Bu, psişik gelişiminizin önemli bir aşamasını ve içsel yolculuğunuzun ilerleyişini gösterir.',
    examples: [
      'Mandala desenleri veya daireler',
      'Kutsal geometri veya simetrik şekiller',
      'Dört köşeyi içeren görüntüler (kare, dörtgen)',
      'Bilge yaşlı adam veya bilge yaşlı kadın',
      'Manevi figürler veya aydınlanmış varlıklar',
      'Taç giyen veya kutsal obje tutan figürler'
    ]
  },
  'Anne': {
    title: 'Anne (Mother)',
    description: 'Anne arketipi, doğurganlık, besleyicilik, şefkat ve büyüme ile ilişkili evrensel bir figürdür. Rüyalarınızda Anne arketipi, olumlu yönleriyle besleyici ve şefkatli figürler olarak, olumsuz yönleriyle ise boğucu veya yutup yok edici figürler olarak belirebilir. Bu, kendi anneleşme içgüdülerinizi ve besleyici yönlerinizi veya annenizle olan ilişkinizde çözülmemiş duygusal bağları yansıtabilir.',
    examples: [
      'Anne veya anneanne figürleri',
      'Besleyici kadın karakterler',
      'Doğa ana sembolleri (toprak, deniz, mağara)',
      'Bolluk ve bereket sembolleri',
      'Korunaklı mekanlar veya evler'
    ]
  },
  'Baba': {
    title: 'Baba (Father)',
    description: 'Baba arketipi, otorite, düzen, mantık ve koruma ile ilişkili evrensel bir figürdür. Rüyalarınızda Baba arketipi, olumlu yönleriyle rehberlik eden ve koruyan figürler olarak, olumsuz yönleriyle ise baskıcı veya reddedici figürler olarak belirebilir. Bu, kendi otorite figürlerinizle olan ilişkinizi veya hayatınızdaki otorite ve düzen ihtiyacını yansıtabilir.',
    examples: [
      'Baba veya büyükbaba figürleri',
      'Otorite figürleri (öğretmen, yönetici, lider)',
      'Yargıç veya kural koyucu karakterler',
      'Koruyucu erkek figürleri',
      'Yasa, düzen veya yapı sembolleri'
    ]
  },
  'Kahraman': {
    title: 'Kahraman (Hero)',
    description: 'Kahraman arketipi, zorluklarla yüzleşme, engelleri aşma ve kişisel büyüme ile ilişkili bir figürdür. Rüyalarınızda Kahraman arketipi, kendinizin güçlü ve cesur yönlerini, zorlukları aşma kapasitenizi ve kişisel bir dönüşüm sürecinde olduğunuzu gösterebilir. Kahraman, genellikle bir yolculuğa çıkar, sınavlardan geçer ve değişmiş olarak döner.',
    examples: [
      'Tehlikelere meydan okumak veya mücadele etmek',
      'Zorlukları aşmak veya engelleri yenmek',
      'Kurtarma misyonları veya başkalarına yardım etmek',
      'Süpergüçler veya olağanüstü yetenekler',
      'Cesaret gerektiren durumlarla karşılaşmak'
    ]
  },
  'Hileci': {
    title: 'Hileci (Trickster)',
    description: 'Hileci arketipi, kurallara meydan okuma, düzeni bozma ve beklenmedik değişimlerle ilişkilidir. Rüyalarınızda Hileci arketipi, genellikle şakacı, kurnaz veya entrikacı karakterler olarak belirir. Bu figürler, yaşamınızdaki değişim ihtiyacını, mevcut düzene karşı içsel isyanınızı veya hayatınıza daha fazla eğlence ve yaratıcılık katma arzunuzu yansıtabilir.',
    examples: [
      'Aldatıcı veya kurnaz karakterler',
      'Beklenmedik olaylar veya ani değişimler',
      'Saçma veya mantıksız durumlar',
      'Komik veya absürt mizah',
      'Kılık değiştirme veya kimlik değiştirme'
    ]
  },
  'Bilge': {
    title: 'Bilge (Wise Old Man/Woman)',
    description: 'Bilge arketipi, bilgelik, rehberlik ve içsel bilgi ile ilişkilidir. Rüyalarınızda Bilge arketipi, genellikle yaşlı ve bilge bir figür olarak belirir ve önemli anlarda rehberlik, tavsiye veya bilgi sunar. Bu, kendi içsel bilgeliğinize bağlanma ve hayatınızda doğru yönü bulma ihtiyacını yansıtabilir.',
    examples: [
      'Yaşlı ve bilge figürler',
      'Ruhani liderler veya öğretmenler',
      'Rehberlik eden veya tavsiye veren karakterler',
      'Antik kitaplar veya bilgelik sembolleri',
      'Kutsal veya mistik mekanlar'
    ]
  },
  'Masum': {
    title: 'Masum (Innocent)',
    description: 'Masum arketipi, saflık, iyimserlik ve yeni başlangıçlar ile ilişkilidir. Rüyalarınızda Masum arketipi, genellikle güven dolu, saf ve iyimser figürler olarak belirir. Bu, yeniden başlama arzunuzu, hayata karşı daha açık ve güven dolu bir yaklaşım geliştirme ihtiyacınızı veya kaybedilmiş masumiyeti yeniden bulma özleminizi yansıtabilir.',
    examples: [
      'Çocuklar veya genç figürler',
      'Saf ve zararsız hayvanlar',
      'Doğal ve bozulmamış ortamlar',
      'Yeni başlangıçlar veya doğum sembolleri',
      'Güven ve iyimserlik dolu durumlar'
    ]
  },
  'Canavar': {
    title: 'Canavar (Monster)',
    description: 'Canavar arketipi, korkularımızı, karanlık dürtülerimizi ve yüzleşmekten kaçındığımız zorluklarımızı temsil eder. Rüyalarınızda Canavar arketipi, genellikle korkutucu, tehdit edici veya ürkütücü yaratıklar olarak belirir. Bu figürler, yüzleşmeniz gereken korkuları, bastırılmış duyguları veya çözülmemiş çatışmaları temsil edebilir.',
    examples: [
      'Korkutucu yaratıklar veya canavarlar',
      'Dev, ejderha veya mitolojik yaratıklar',
      'Şekilsiz veya tanımlanamaz varlıklar',
      'Takip eden veya sizi tehdit eden yaratıklar',
      'İçgüdüsel korkularınızı tetikleyen durumlar'
    ]
  },
  'Çocuk': {
    title: 'Çocuk (Child)',
    description: 'Çocuk arketipi, yenilenme, büyüme potansiyeli ve gelişim ile ilişkilidir. Rüyalarınızda Çocuk arketipi, yeni başlangıçları, masumiyeti ve içinizdeki yaratıcı, oyuncu ruhu temsil eder. Bu, yeniden keşfetmeniz gereken gelişim potansiyelinizi veya geçmişte bastırılmış çocukluk deneyimlerinizi yansıtabilir.',
    examples: [
      'Çocuklar veya bebekler',
      'Oyun oynamak veya oyuncaklar',
      'Öğrenmek veya keşfetmek',
      'Okul veya çocukluk evi',
      'Merak ve heyecan dolu deneyimler'
    ]
  },
  'Aşık': {
    title: 'Aşık (Lover)',
    description: 'Aşık arketipi, sevgi, tutku, bağlılık ve yakınlık ile ilişkilidir. Rüyalarınızda Aşık arketipi, romantik ilişkileri, tutkulu bağlılıkları ve derin duygusal bağları temsil eder. Bu, insan ilişkilerinizi, yakınlık ihtiyacınızı veya başkalarıyla nasıl bağlantı kurduğunuzu yansıtabilir.',
    examples: [
      'Romantik partner veya sevilen biri',
      'Aşk veya tutku dolu karşılaşmalar',
      'Düğün veya evlilik törenleri',
      'Derin duygusal bağlar',
      'Güzellik veya estetik deneyimler'
    ]
  },
  'Yolcu': {
    title: 'Yolcu (Wanderer/Explorer)',
    description: 'Yolcu arketipi, keşif, özgürlük ve yeni deneyimler arayışı ile ilişkilidir. Rüyalarınızda Yolcu arketipi, genellikle yeni yerler keşfeden, yollarda olan veya alışılmışın dışına çıkan figürler olarak belirir. Bu, değişim arzunuzu, özgürlük ihtiyacınızı veya hayatınızda yeni bir yön bulma çabanızı yansıtabilir.',
    examples: [
      'Seyahat etmek veya yolculuğa çıkmak',
      'Bilinmeyen bölgeleri keşfetmek',
      'Haritalar veya pusula kullanmak',
      'Yabancı kültürler veya yerler',
      'Yollar, patikalar veya köprüler'
    ]
  }
};

/**
 * Verilen arketipin anlamını ve açıklamasını getirir
 * @param archetypeName Arketip adı
 * @returns Arketip açıklaması ve örnekleri
 */
export const getArchetypeMeaning = (archetypeName: string): ArchetypeMeaning => {
  // Arketip adında birebir eşleşme ara
  if (archetypeDatabase[archetypeName]) {
    return archetypeDatabase[archetypeName];
  }
  
  // Arketip adını küçük harfe çevirerek ara
  const lowerCaseName = archetypeName.toLowerCase();
  const foundKey = Object.keys(archetypeDatabase).find(
    key => key.toLowerCase() === lowerCaseName
  );
  
  if (foundKey) {
    return archetypeDatabase[foundKey];
  }
  
  // Arketip adını içeren herhangi bir anahtar ara
  const partialMatch = Object.keys(archetypeDatabase).find(
    key => key.toLowerCase().includes(lowerCaseName) || lowerCaseName.includes(key.toLowerCase())
  );
  
  if (partialMatch) {
    return archetypeDatabase[partialMatch];
  }
  
  // Arketip bulunamadıysa genel bir açıklama döndür
  return {
    title: `${archetypeName} Arketipi`,
    description: `${archetypeName} arketipi, Jung psikolojisinde kolektif bilinçdışının bir parçası olarak görülen arketiplerden biridir. Arketipler, evrensel sembolik şablonlar olarak tanımlanır ve tüm insanlığın ortak psikolojik deneyimlerini yansıtır. Bu arketip, rüyalarınızda önemli mesajlar taşıyabilir ve bilinçdışı süreçlerinize ışık tutabilir.`,
    examples: [
      'Rüyalarda tekrarlayan semboller veya temalar',
      'Mitolojik figürler veya hikayeler',
      'Kolektif bilinçdışını yansıtan deneyimler',
      'Sembolik veya metaforik durumlar',
      'Dönüşüm ve gelişim süreçleri'
    ]
  };
};

export default { getArchetypeMeaning };
