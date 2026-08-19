import type { Locale } from "@/lib/i18n/config";

export type TenderTranslations = {
  liveCenter: string;
  title: string;
  description: string;
  found: string;
  cantons: string;

  searchPlaceholder: string;
  allCantons: string;
  allCategories: string;
  search: string;

  matchingTenders: string;
  sortedByCurrent: string;
  nationwide: string;

  topMatch: string;
  match: string;
  open: string;
  published: string;
  deadline: string;
  noDeadline: string;
  viewTender: string;
  save: string;

  page: string;
  of: string;
  previous: string;
  next: string;
  paginationLabel: string;

  centerTitle: string;
  centerSubtitle: string;
  centerFuture: string;

  backToTenders: string;
  publicContractingAuthority: string;
  publicTender: string;
  noDescription: string;
  publicTenderCategory: string;
  noInformation: string;

  place: string;
  projectNumber: string;
  tenderDetails: string;
  detailDescription: string;
  authority: string;
  openOfficialSource: string;

  interestedTitle: string;
  interestedText: string;
  configureMatching: string;
};

export const tenderTranslations: Record<Locale, TenderTranslations> = {
  de: {
    liveCenter: "Live Ausschreibungs-Center",
    title: "Öffentliche Ausschreibungen",
    description:
      "Finde öffentliche Aufträge aus der ganzen Schweiz, passend zu deiner Branche und Region. Neue Ausschreibungen werden hier laufend ergänzt.",
    found: "Ausschreibungen",
    cantons: "Kantone",

    searchPlaceholder: "Ausschreibung, Auftraggeber oder Ort suchen ...",
    allCantons: "Alle Kantone",
    allCategories: "Alle Kategorien",
    search: "Suchen",

    matchingTenders: "Passende Ausschreibungen",
    sortedByCurrent: "Sortiert nach Aktualität",
    nationwide: "Schweizweit",

    topMatch: "Top Match",
    match: "Passend",
    open: "Offen",
    published: "Publiziert",
    deadline: "Eingabefrist",
    noDeadline: "Keine Frist angegeben",
    viewTender: "Ausschreibung ansehen",
    save: "Merken",

    page: "Seite",
    of: "von",
    previous: "Zurück",
    next: "Weiter",
    paginationLabel: "Seitennavigation Ausschreibungen",

    centerTitle: "Auftraggo Ausschreibungs-Center",
    centerSubtitle: "Öffentliche Aufträge passend zu deinem Unternehmen.",
    centerFuture:
      "In der nächsten Ausbaustufe werden Ausschreibungen automatisch anhand deiner Kategorien und Regionen priorisiert.",

    backToTenders: "Zurück zu den Ausschreibungen",
    publicContractingAuthority: "Öffentliche Auftraggeberin",
    publicTender: "Öffentliche Ausschreibung",
    noDescription:
      "Für diese Ausschreibung liegt derzeit keine ausführliche Beschreibung vor.",
    publicTenderCategory: "Öffentliche Ausschreibung",
    noInformation: "Keine Angabe",

    place: "Ort",
    projectNumber: "Projektnummer",
    tenderDetails: "Ausschreibungsdetails",
    detailDescription: "Beschreibung",
    authority: "Auftraggeber",
    openOfficialSource: "Offizielle Stelle öffnen",

    interestedTitle: "Interessiert an diesem Auftrag?",
    interestedText:
      "Prüfe die Ausschreibung und entscheide, ob sie zu deinem Unternehmen passt.",
    configureMatching: "Matching einstellen",
  },

  fr: {
    liveCenter: "Centre d'appels d'offres en direct",
    title: "Appels d'offres publics",
    description:
      "Découvrez des marchés publics dans toute la Suisse, adaptés à votre secteur et à votre région. De nouveaux appels d'offres sont ajoutés en continu.",
    found: "appels d'offres",
    cantons: "cantons",

    searchPlaceholder:
      "Rechercher un appel d'offres, un adjudicateur ou un lieu ...",
    allCantons: "Tous les cantons",
    allCategories: "Toutes les catégories",
    search: "Rechercher",

    matchingTenders: "Appels d'offres correspondants",
    sortedByCurrent: "Triés par actualité",
    nationwide: "Toute la Suisse",

    topMatch: "Meilleure correspondance",
    match: "Correspondance",
    open: "Ouvert",
    published: "Publié",
    deadline: "Délai de soumission",
    noDeadline: "Aucun délai indiqué",
    viewTender: "Voir l'appel d'offres",
    save: "Enregistrer",

    page: "Page",
    of: "sur",
    previous: "Retour",
    next: "Suivant",
    paginationLabel: "Navigation des appels d'offres",

    centerTitle: "Centre d'appels d'offres Auftraggo",
    centerSubtitle: "Des marchés publics adaptés à votre entreprise.",
    centerFuture:
      "À l'avenir, les appels d'offres seront automatiquement priorisés selon vos catégories et vos régions.",

    backToTenders: "Retour aux appels d'offres",
    publicContractingAuthority: "Adjudicateur public",
    publicTender: "Appel d'offres public",
    noDescription:
      "Aucune description détaillée n'est actuellement disponible pour cet appel d'offres.",
    publicTenderCategory: "Appel d'offres public",
    noInformation: "Non indiqué",

    place: "Lieu",
    projectNumber: "Numéro de projet",
    tenderDetails: "Détails de l'appel d'offres",
    detailDescription: "Description",
    authority: "Adjudicateur",
    openOfficialSource: "Ouvrir la source officielle",

    interestedTitle: "Intéressé par ce mandat ?",
    interestedText:
      "Consultez l'appel d'offres et vérifiez s'il correspond à votre entreprise.",
    configureMatching: "Configurer le matching",
  },

  it: {
    liveCenter: "Centro appalti live",
    title: "Appalti pubblici",
    description:
      "Trova appalti pubblici in tutta la Svizzera adatti al tuo settore e alla tua regione. Nuovi appalti vengono aggiunti continuamente.",
    found: "appalti",
    cantons: "cantoni",

    searchPlaceholder: "Cerca appalto, committente o località ...",
    allCantons: "Tutti i cantoni",
    allCategories: "Tutte le categorie",
    search: "Cerca",

    matchingTenders: "Appalti corrispondenti",
    sortedByCurrent: "Ordinati per attualità",
    nationwide: "Tutta la Svizzera",

    topMatch: "Migliore corrispondenza",
    match: "Corrispondenza",
    open: "Aperto",
    published: "Pubblicato",
    deadline: "Termine di presentazione",
    noDeadline: "Nessuna scadenza indicata",
    viewTender: "Visualizza appalto",
    save: "Salva",

    page: "Pagina",
    of: "di",
    previous: "Indietro",
    next: "Avanti",
    paginationLabel: "Navigazione appalti",

    centerTitle: "Centro appalti Auftraggo",
    centerSubtitle: "Appalti pubblici adatti alla tua azienda.",
    centerFuture:
      "In futuro gli appalti saranno prioritizzati automaticamente in base alle tue categorie e regioni.",

    backToTenders: "Torna agli appalti",
    publicContractingAuthority: "Ente appaltante pubblico",
    publicTender: "Appalto pubblico",
    noDescription:
      "Al momento non è disponibile una descrizione dettagliata per questo appalto.",
    publicTenderCategory: "Appalto pubblico",
    noInformation: "Nessuna indicazione",

    place: "Luogo",
    projectNumber: "Numero di progetto",
    tenderDetails: "Dettagli dell'appalto",
    detailDescription: "Descrizione",
    authority: "Committente",
    openOfficialSource: "Apri la fonte ufficiale",

    interestedTitle: "Interessato a questo incarico?",
    interestedText:
      "Esamina l'appalto e verifica se è adatto alla tua azienda.",
    configureMatching: "Configura matching",
  },

  en: {
    liveCenter: "Live Tender Center",
    title: "Public tenders",
    description:
      "Discover public contracts from across Switzerland matched to your industry and region. New tenders are continuously added.",
    found: "tenders",
    cantons: "cantons",

    searchPlaceholder: "Search tender, contracting authority or location ...",
    allCantons: "All cantons",
    allCategories: "All categories",
    search: "Search",

    matchingTenders: "Matching tenders",
    sortedByCurrent: "Sorted by most recent",
    nationwide: "Switzerland-wide",

    topMatch: "Top Match",
    match: "Match",
    open: "Open",
    published: "Published",
    deadline: "Submission deadline",
    noDeadline: "No deadline specified",
    viewTender: "View tender",
    save: "Save",

    page: "Page",
    of: "of",
    previous: "Previous",
    next: "Next",
    paginationLabel: "Tender page navigation",

    centerTitle: "Auftraggo Tender Center",
    centerSubtitle: "Public contracts matched to your company.",
    centerFuture:
      "In the next expansion stage, tenders will automatically be prioritized based on your categories and regions.",

    backToTenders: "Back to tenders",
    publicContractingAuthority: "Public contracting authority",
    publicTender: "Public tender",
    noDescription:
      "No detailed description is currently available for this tender.",
    publicTenderCategory: "Public tender",
    noInformation: "Not specified",

    place: "Location",
    projectNumber: "Project number",
    tenderDetails: "Tender details",
    detailDescription: "Description",
    authority: "Contracting authority",
    openOfficialSource: "Open official source",

    interestedTitle: "Interested in this contract?",
    interestedText:
      "Review the tender and decide whether it is a good fit for your company.",
    configureMatching: "Configure matching",
  },

  sq: {
    liveCenter: "Qendra e tenderëve live",
    title: "Tenderë publikë",
    description:
      "Gjej kontrata publike nga e gjithë Zvicra që përputhen me sektorin dhe rajonin tënd. Tenderë të rinj shtohen vazhdimisht.",
    found: "tenderë",
    cantons: "kantone",

    searchPlaceholder: "Kërko tender, autoritet kontraktues ose vend ...",
    allCantons: "Të gjitha kantonet",
    allCategories: "Të gjitha kategoritë",
    search: "Kërko",

    matchingTenders: "Tenderë të përshtatshëm",
    sortedByCurrent: "Renditur sipas aktualitetit",
    nationwide: "Në gjithë Zvicrën",

    topMatch: "Përputhja më e mirë",
    match: "Përputhje",
    open: "Hapur",
    published: "Publikuar",
    deadline: "Afati i dorëzimit",
    noDeadline: "Nuk është dhënë afat",
    viewTender: "Shiko tenderin",
    save: "Ruaj",

    page: "Faqja",
    of: "nga",
    previous: "Prapa",
    next: "Tjetër",
    paginationLabel: "Navigimi i tenderëve",

    centerTitle: "Qendra e tenderëve Auftraggo",
    centerSubtitle: "Kontrata publike të përshtatshme për kompaninë tënde.",
    centerFuture:
      "Në fazën e ardhshme tenderët do të prioritizohen automatikisht sipas kategorive dhe rajoneve të tua.",

    backToTenders: "Kthehu te tenderët",
    publicContractingAuthority: "Autoritet publik kontraktues",
    publicTender: "Tender publik",
    noDescription:
      "Aktualisht nuk ka një përshkrim të detajuar për këtë tender.",
    publicTenderCategory: "Tender publik",
    noInformation: "Nuk është specifikuar",

    place: "Vendi",
    projectNumber: "Numri i projektit",
    tenderDetails: "Detajet e tenderit",
    detailDescription: "Përshkrimi",
    authority: "Autoriteti kontraktues",
    openOfficialSource: "Hap burimin zyrtar",

    interestedTitle: "Të intereson ky kontrakt?",
    interestedText:
      "Kontrollo tenderin dhe vendos nëse përshtatet me kompaninë tënde.",
    configureMatching: "Konfiguro matching",
  },

  tr: {
    liveCenter: "Canlı ihale merkezi",
    title: "Kamu ihaleleri",
    description:
      "İsviçre genelinde sektörünüze ve bölgenize uygun kamu ihalelerini bulun. Yeni ihaleler sürekli olarak eklenmektedir.",
    found: "ihale",
    cantons: "kanton",

    searchPlaceholder: "İhale, ihale makamı veya konum ara ...",
    allCantons: "Tüm kantonlar",
    allCategories: "Tüm kategoriler",
    search: "Ara",

    matchingTenders: "Uygun ihaleler",
    sortedByCurrent: "Güncelliğe göre sıralandı",
    nationwide: "İsviçre genelinde",

    topMatch: "En iyi eşleşme",
    match: "Eşleşme",
    open: "Açık",
    published: "Yayınlandı",
    deadline: "Son başvuru tarihi",
    noDeadline: "Son tarih belirtilmedi",
    viewTender: "İhaleyi görüntüle",
    save: "Kaydet",

    page: "Sayfa",
    of: "/",
    previous: "Geri",
    next: "İleri",
    paginationLabel: "İhale sayfa navigasyonu",

    centerTitle: "Auftraggo İhale Merkezi",
    centerSubtitle: "Şirketinize uygun kamu ihaleleri.",
    centerFuture:
      "Bir sonraki aşamada ihaleler kategorilerinize ve bölgelerinize göre otomatik olarak önceliklendirilecektir.",

    backToTenders: "İhalelere dön",
    publicContractingAuthority: "Kamu ihale makamı",
    publicTender: "Kamu ihalesi",
    noDescription:
      "Bu ihale için şu anda ayrıntılı bir açıklama mevcut değildir.",
    publicTenderCategory: "Kamu ihalesi",
    noInformation: "Belirtilmedi",

    place: "Yer",
    projectNumber: "Proje numarası",
    tenderDetails: "İhale detayları",
    detailDescription: "Açıklama",
    authority: "İhale makamı",
    openOfficialSource: "Resmî kaynağı aç",

    interestedTitle: "Bu işle ilgileniyor musunuz?",
    interestedText:
      "İhaleyi inceleyin ve şirketinize uygun olup olmadığına karar verin.",
    configureMatching: "Eşleştirmeyi ayarla",
  },

  pt: {
    liveCenter: "Centro de concursos em direto",
    title: "Concursos públicos",
    description:
      "Encontre contratos públicos em toda a Suíça adequados ao seu setor e região. Novos concursos são adicionados continuamente.",
    found: "concursos",
    cantons: "cantões",

    searchPlaceholder: "Pesquisar concurso, entidade adjudicante ou local ...",
    allCantons: "Todos os cantões",
    allCategories: "Todas as categorias",
    search: "Pesquisar",

    matchingTenders: "Concursos correspondentes",
    sortedByCurrent: "Ordenados por atualidade",
    nationwide: "Toda a Suíça",

    topMatch: "Melhor correspondência",
    match: "Correspondência",
    open: "Aberto",
    published: "Publicado",
    deadline: "Prazo de apresentação",
    noDeadline: "Nenhum prazo indicado",
    viewTender: "Ver concurso",
    save: "Guardar",

    page: "Página",
    of: "de",
    previous: "Anterior",
    next: "Seguinte",
    paginationLabel: "Navegação dos concursos",

    centerTitle: "Centro de concursos Auftraggo",
    centerSubtitle: "Contratos públicos adequados à sua empresa.",
    centerFuture:
      "Na próxima fase, os concursos serão automaticamente priorizados com base nas suas categorias e regiões.",

    backToTenders: "Voltar aos concursos",
    publicContractingAuthority: "Entidade adjudicante pública",
    publicTender: "Concurso público",
    noDescription:
      "Atualmente não existe uma descrição detalhada disponível para este concurso.",
    publicTenderCategory: "Concurso público",
    noInformation: "Não indicado",

    place: "Local",
    projectNumber: "Número do projeto",
    tenderDetails: "Detalhes do concurso",
    detailDescription: "Descrição",
    authority: "Entidade adjudicante",
    openOfficialSource: "Abrir fonte oficial",

    interestedTitle: "Interessado neste contrato?",
    interestedText:
      "Analise o concurso e verifique se é adequado à sua empresa.",
    configureMatching: "Configurar matching",
  },

  es: {
    liveCenter: "Centro de licitaciones en directo",
    title: "Licitaciones públicas",
    description:
      "Encuentra contratos públicos de toda Suiza adaptados a tu sector y región. Se añaden nuevas licitaciones continuamente.",
    found: "licitaciones",
    cantons: "cantones",

    searchPlaceholder: "Buscar licitación, organismo contratante o lugar ...",
    allCantons: "Todos los cantones",
    allCategories: "Todas las categorías",
    search: "Buscar",

    matchingTenders: "Licitaciones adecuadas",
    sortedByCurrent: "Ordenadas por actualidad",
    nationwide: "Toda Suiza",

    topMatch: "Mejor coincidencia",
    match: "Coincidencia",
    open: "Abierta",
    published: "Publicado",
    deadline: "Fecha límite",
    noDeadline: "Sin fecha límite indicada",
    viewTender: "Ver licitación",
    save: "Guardar",

    page: "Página",
    of: "de",
    previous: "Anterior",
    next: "Siguiente",
    paginationLabel: "Navegación de licitaciones",

    centerTitle: "Centro de licitaciones Auftraggo",
    centerSubtitle: "Contratos públicos adecuados para tu empresa.",
    centerFuture:
      "En la próxima fase, las licitaciones se priorizarán automáticamente según tus categorías y regiones.",

    backToTenders: "Volver a las licitaciones",
    publicContractingAuthority: "Organismo público contratante",
    publicTender: "Licitación pública",
    noDescription:
      "Actualmente no hay una descripción detallada disponible para esta licitación.",
    publicTenderCategory: "Licitación pública",
    noInformation: "No indicado",

    place: "Lugar",
    projectNumber: "Número de proyecto",
    tenderDetails: "Detalles de la licitación",
    detailDescription: "Descripción",
    authority: "Organismo contratante",
    openOfficialSource: "Abrir fuente oficial",

    interestedTitle: "¿Te interesa este contrato?",
    interestedText: "Revisa la licitación y decide si encaja con tu empresa.",
    configureMatching: "Configurar matching",
  },
};

export function getTenderTranslations(locale: Locale): TenderTranslations {
  return tenderTranslations[locale] ?? tenderTranslations.de;
}
