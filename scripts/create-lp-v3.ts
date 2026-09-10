// One-off script to populate the "lp/v3" landing page — multi-firm
// audit group ("koncern") positioning, built from Alex-Original-V04.md
// using only existing blocks. Bracketed `[tag: ...]` editorial notes
// and unfilled placeholder quotes in the source doc are omitted (not
// real content); only the one real testimonial we have (Stefan
// Andersson / Azets) is used, repeated per Dan's instruction.
// Run with: npx sanity exec scripts/create-lp-v3.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

let keyCounter = 0
function key() {
  keyCounter += 1
  return `v3k${keyCounter}`
}

// Resolved from the live dataset (see decision-log D22 migration) —
// not hardcoded blind, fetched fresh via a throwaway inspect script
// before writing this one.
const TESTIMONIAL_STEFAN_ANDERSSON = 'CJZDwmvwGmXeH7UF1zsCFc'
const CLIENT_LOGOS = [
  '6wowh2G6C63aoLCVfenafI', // Azets
  'CJZDwmvwGmXeH7UF1zsBy8', // Baker Tilly
  '7RAvjHZFNddW6ezWMHgCmG', // Radek
  '7RAvjHZFNddW6ezWMHgCwe', // weAudit
  '6wowh2G6C63aoLCVfenajE', // Forvis Mazars
]

const blocks: Record<string, unknown>[] = [
  // Header — minimal, matching lp/v1 and lp/v2 (logo + CTA, no nav
  // links; landing pages don't carry the full site nav).
  {
    _type: 'headerBlock',
    _key: key(),
    logoText: 'senseworks',
    ctaLabel: 'Boka en genomgång',
    ctaHref: '#',
  },

  // 1. Hero — löftet.
  {
    _type: 'heroTextBlock',
    _key: key(),
    eyebrow: 'För revisions och rådgivningskoncerner med flera byråer under samma tak',
    headline: 'Byråer i vårt program har sparat upp till 20 % av tiden per revision.',
    subhead:
      'Vi visar er hur vi mäter det. En revision- och rådgivningsplattform för hela koncernen, byggd för ISA, KISA och ISA for LCE. Koncernen får en metodik, en gemensam vy över var varje revision står och delad bemanning mellan byråerna vid arbetstoppar. Varje byrå kan anpassa vidare, behålla sitt namn och sin egenart.',
    ctaLabel: 'Boka en genomgång',
    ctaHref: '#',
  },
  {
    _type: 'mediaBlock',
    _key: key(),
  },

  // 2. Riskvändning på löftena — bare 3-card grid, no section intro
  // (D-decision: Card Grid never carries its own eyebrow/heading/body).
  {
    _type: 'cardGridBlock',
    _key: key(),
    columns: '3',
    items: [
      {
        _key: key(),
        eyebrow: '20 % tid',
        heading: 'Tiden tas från insamlingen, inte från granskningen.',
        body: 'Det som försvinner är att begära, vänta, mejla och sammanställa underlag. Huvudbok, deklarationer och registerdata hämtas från källan, avstämningen görs i plattformen. Revisorns tid går till bedömningen, som förut, men utan förarbetet.',
      },
      {
        _key: key(),
        eyebrow: 'Utan att byråerna blir likadana',
        heading: 'Stordrift där det räknas. Egenart där det syns.',
        body: 'Metodik, mallar, integrationer och uppföljning sätts en gång och delas av alla — det är stordriften. Byrån väljer ISA, ISA for LCE eller K ISA per uppdrag och anpassar vidare inom ramen. Koncernen samordnar, byråerna bestämmer hur.',
      },
      {
        _key: key(),
        eyebrow: 'En gemensam vy över kvaliteten',
        heading: 'Vyn visar var granskningen står, inte vem som är sämst.',
        body: 'Koncernen ser status, öppna punkter och avvikelser i varje uppdrag medan granskningen pågår, så att stöd kan sättas in innan det blir ett problem. Bedömningen är fortfarande revisorns. Varje byrå behåller sitt eget kvalitetsstyrningssystem.',
      },
    ],
  },

  // 3. Bevis — logos + the one real testimonial we have.
  {
    _type: 'sectionHeadlineBlock',
    _key: key(),
    headline: 'Över 90 byråer och 1 000 revisorer i ägarledda bolags segment arbetar i Senseworks',
    align: 'center',
  },
  {
    _type: 'logoCloudBlock',
    _key: key(),
    logos: CLIENT_LOGOS.map((id) => ({ _key: key(), _type: 'reference', _ref: id })),
  },
  {
    _type: 'testimonialLargeBlock',
    _key: key(),
    testimonial: { _type: 'reference', _ref: TESTIMONIAL_STEFAN_ANDERSSON },
  },

  // 4. Alternativen — vad det kostar att inte ha det. Card Grid used
  // here per Dan's note ("use this for now — but it's not quite
  // right"): the source has bullet lists + a bold closing line per
  // card, which Card Grid's single body field can't do — condensed
  // into one paragraph each instead. Revisit if this pattern recurs.
  {
    _type: 'sectionHeadlineBlock',
    _key: key(),
    headline: 'Vad det kostar koncernen att inte ha det',
    body: 'En femtedel av tiden i varje revision går till att begära, vänta på och sammanställa underlag. Gånger antalet uppdrag. Gånger antalet byråer. Varje år ni väntar. Tre sätt att fortsätta betala den räkningen.',
    align: 'center',
  },
  {
    _type: 'cardGridBlock',
    _key: key(),
    columns: '3',
    items: [
      {
        _key: key(),
        eyebrow: 'Låta varje byrå fortsätta med sitt',
        heading: 'Tio system betalar ni för varje dag',
        body: 'Tio mallbibliotek att underhålla. En femtedel av varje uppdrag går till att begära och sammanställa underlag för hand. Status syns byrå för byrå, i efterhand. Ledig kapacitet hjälper ingen annan. Räkningen växer med varje byrå ni köper.',
      },
      {
        _key: key(),
        eyebrow: 'Bygga eget',
        heading: 'Åren innan något finns är den dyraste posten',
        body: 'Grunden måste byggas först: ISA, ISA for LCE, K ISA, integrationer mot bokföring, Skatteverket och Bolagsverket. Under byggåren betalar ni ändå den vanliga räkningen, för varje byrå, varje säsong. Det ni vill bygga finns redan — vi bygger resten tillsammans.',
      },
      {
        _key: key(),
        eyebrow: 'Konsolidera först, byta plattform sedan',
        heading: 'Två migreringar där bara en borde behövas',
        body: 'Revisorerna flyttas in i ett system för att sedan flyttas igen, båda gångerna under någons högsäsong. Två utbildningsrundor och två gånger tappat förtroende för systembyten. Ett byte, inte två — låt plattformen vara det som enar.',
      },
    ],
  },

  // 5. Huret — så får ni det vi lovade.
  {
    _type: 'sectionHeadlineBlock',
    _key: key(),
    headline: 'Så sparar byråer upp till 20 % på varje revision, med sin egenart kvar',
    body: 'En metodik som ägs centralt och når varje uppdrag i alla byråer. Underlag som hämtas från bokföring, Skatteverket och Bolagsverket i stället för att begäras. En vy där ledningen ser var varje uppdrag står medan granskningen pågår. Fem steg, ett per löfte.',
    ctaLabel: 'Boka en genomgång',
    ctaHref: '#',
    align: 'center',
  },
  {
    _type: 'mediaBlock',
    _key: key(),
  },

  // 6. Stegen — five promises, alternating image side.
  {
    _type: 'featureSplitBlock',
    _key: key(),
    eyebrow: 'Löfte: en metodik · Steg 1',
    heading: 'Sätt koncernens metodik en gång',
    body: 'Metodikansvarig konfigurerar koncernens standard: ISA respektive ISA for LCE program, K ISA, branschmallar, dokumentmallar och granskningsprogram. Det som låg i tio mallbibliotek ligger nu på ett ställe och ändras på ett ställe. Uppdraget styr regelverket, inte byrån — ISA, ISA for LCE och K ISA i samma plattform. Branschmallar på koncernnivå: bygg en gång, använd överallt. Juridiska former inbyggda: aktiebolag, stiftelser, föreningar och övriga. Konfiguration, inte utveckling — ändringar kräver inte leverantören.',
    imagePosition: 'right',
  },
  {
    _type: 'featureSplitBlock',
    _key: key(),
    eyebrow: 'Löfte: byrån behåller namn och egenart · Steg 2',
    heading: 'Anslut varje byrå med sitt varumärke och sina anpassningar',
    body: 'Byrån får plattformen under eget namn och egen logotyp och anpassar vidare inom koncernens ram: egna branschprogram, egna dokumentmallar. Medarbetarna arbetar i koncernens metodik utan att kunden märker annat än att underlagen kommer snabbare.',
    imagePosition: 'left',
  },
  {
    _type: 'featureSplitBlock',
    _key: key(),
    eyebrow: 'Löfte: 20 % tid på varje revision · Steg 3',
    heading: 'Låt underlaget komma till revisorn. Här sparas tiden.',
    body: 'Huvudbok, deklarationsuppgifter och registerdata hämtas via integrationerna i stället för att begäras och mejlas. Bankavstämning görs mot huvudboken. När året är slut rullas uppdraget fram med riskbedömning, program och dokumentation. Revisorn börjar granska i stället för att börja samla. Fortnox, Visma och Björn Lundén för bokföringen. Skatteverket och Bolagsverket för deklarations- och registeruppgifter. Framrullning mellan åren, kopiering mellan bolag.',
    imagePosition: 'right',
  },
  {
    _type: 'featureSplitBlock',
    _key: key(),
    eyebrow: 'Löfte: en gemensam vy över kvaliteten · Steg 4',
    heading: 'Se var varje uppdrag står, i alla byråer, medan det pågår',
    body: 'Klientlistan visar uppdragsstatus för hela koncernen. Metodikansvarig ser var granskningen står, var det finns interna kommentarer och vad som inte är påtecknat, oavsett byrå. Stöd sätts in medan det gör skillnad, inte i efterhand. Måste alla byråer arbeta exakt lika? Nej — koncernen bestämmer vad som är standard och vad som är byråns eget. En byrå med tung offentlig sektor behåller sina program för det, inom samma plattform och samma uppföljning.',
    imagePosition: 'left',
  },
  {
    _type: 'featureSplitBlock',
    _key: key(),
    eyebrow: 'Löfte: delad bemanning vid arbetstoppar · Steg 5',
    heading: 'Låt bemanningen följa behovet över byråerna',
    body: 'Samma system i alla byråer betyder att en kollega i Göteborg kan gå in i ett uppdrag i Sundsvall utan att lära sig något nytt. Uppdragsansvarig och kund är fortfarande byråns. Högsäsongen fördelas över koncernen i stället för att köpas med övertid.',
    imagePosition: 'right',
  },

  // 7. Värdeerbjudanden — de tre USP:arna.
  {
    _type: 'featureGridBlock',
    _key: key(),
    heading: 'Därför går det att lova',
    items: [
      {
        _key: key(),
        title: 'Innovation som gör jobbet: underlaget kommer till revisorn',
        description:
          'Huvudbok från Fortnox, Visma och Björn Lundén. Deklarations- och registeruppgifter från Skatteverket och Bolagsverket. Bankavstämning mot huvudbok. Framrullning mellan åren och kopiering mellan bolag.',
      },
      {
        _key: key(),
        title: 'Hjälp hela vägen: migrering, utbildning och support av revisorer',
        description:
          'Senseworks migrerar kundregister och uppdrag, utbildar byråns revisorer och är med under första högsäsongen. Supporten bemannas av revisorer som kan metodiken. Ingen byrå lämnas med ett nytt system och en manual.',
      },
      {
        _key: key(),
        title: 'Konfiguration: gör plattformen till er egen, utan att bygga den',
        description:
          'Metodik, mallar, granskningsprogram, branschanpassningar och varumärke sätts i administrationen av er metodikansvarig. Ni får en plattform formad för er verksamhet, till en bråkdel av tiden och risken. Det som ändå saknas byggs tillsammans med avtalad leveransplan.',
      },
    ],
  },

  // 8. Huvudsaklig riskvändning — risk-reversal items.
  {
    _type: 'featureGridBlock',
    _key: key(),
    heading: 'Om det vi lovat inte håller hos er',
    items: [
      {
        _key: key(),
        title: 'En byrå först. Koncernen sedan.',
        description:
          'Testperioden görs i en byrå, på riktiga uppdrag, med byråns egna revisorer. Uppdragstiden mäts före och efter, i er verksamhet. Håller inte 20 procent hos er vet ni det innan något beslut om koncernen.',
      },
      {
        _key: key(),
        title: 'Ingen byrå byter mitt i ett uppdrag',
        description:
          'Anslutning sker mellan säsonger, byrå för byrå. Senseworks revisorer är med under första högsäsongen i varje ansluten byrå.',
      },
      {
        _key: key(),
        title: 'Leveransgarantin',
        description:
          'Det som avtalas i utrullningsplanen levereras på avtalat datum. Saknas en avtalad funktion vid datumet sänks månadsavgiften med 25 procent tills den finns.',
      },
      {
        _key: key(),
        title: 'All data i Sverige, åtskild per kund genom hela kedjan',
        description:
          'Data lagras i Sverige/EU och hålls fysiskt åtskild per kund genom hela flödet. Plattformen följer GDPR med en utsedd dataskyddsansvarig, krypterar allt i vila och i överföring, och styr åtkomst per uppdrag.',
      },
      {
        _key: key(),
        title: 'Er data är er, i format ni kan ta med',
        description: 'Uppdrag, dokumentation och arkiv kan exporteras.',
      },
    ],
  },

  // 8b. Stabilitet / Oberoende / Experter — bare 3-card strip, no
  // heading (same "heading: ''" pattern already used on lp/v2).
  {
    _type: 'featureGridBlock',
    _key: key(),
    heading: '',
    items: [
      {
        _key: key(),
        title: 'Stabilitet',
        description:
          'Grundat 2019, närmare 30 anställda, över 90 byråer. Finansierat av Industrifonden och Collaxio.',
      },
      {
        _key: key(),
        title: 'Oberoende',
        description: 'Ägs inte av någon byrå, något nätverk eller någon koncern.',
      },
      {
        _key: key(),
        title: 'Experter',
        description:
          'Byggs av revisorer, datavetare och statistiker. Grundaren från EY. Rådgivare Helene Willberg, tidigare VD KPMG Sverige, och Sara Uhlén, tidigare Grant Thornton.',
      },
    ],
  },

  // FAQ (part of section 8 in the source doc).
  {
    _type: 'faqAccordionBlock',
    _key: key(),
    heading: 'Vanliga frågor',
    items: [
      {
        _key: key(),
        question: 'Vad händer med pågående uppdrag och historik när en byrå byter?',
        answer:
          'Anslutningen sker mellan säsonger, inte mitt i en pågående revision, så inga uppdrag är på väg över när bytet sker. Senseworks migrerar in kundregister och uppdrag inför den nya säsongen, och tidigare års dokumentation rullas fram på samma sätt som mellan ordinarie årsskiften.',
      },
      {
        _key: key(),
        question: 'Hur påverkas kvalitetsstyrning per byrå och oberoendekontroll över koncernen?',
        answer:
          'Varje byrå behåller sitt eget kvalitetsstyrningssystem — plattformen delar metodik, mallar och uppföljning på koncernnivå men tar inte över byråns ansvar för sin egen kvalitetsstyrning. Åtkomst till ett uppdrag styrs så att bara rätt personer i rätt byrå kommer åt det.',
      },
      {
        _key: key(),
        question: 'Vi har lokal drift i dag och den känns billig.',
        answer:
          'Den ser billig ut för att kostnaderna ligger i andra budgetar: hårdvara som skrivs av, IT-timmar, säkerhetsuppdateringar, backup, driftstopp under högsäsong. Räkna ihop dem så blir bilden en annan. Vi hjälper gärna till med kalkylen.',
      },
    ],
  },

  // 9. Kundröster — repeats the one real testimonial (Dan: "we only
  // have one customer quote just now — so we can repeat that").
  {
    _type: 'sectionHeadlineBlock',
    _key: key(),
    headline: 'Därför bytte byråerna',
    align: 'center',
  },
  {
    _type: 'testimonialLargeBlock',
    _key: key(),
    testimonial: { _type: 'reference', _ref: TESTIMONIAL_STEFAN_ANDERSSON },
  },

  // 10. Nästa steg.
  {
    _type: 'sectionHeadlineBlock',
    _key: key(),
    headline: 'Så går det till från första samtalet',
    align: 'center',
  },
  {
    _type: 'cardGridBlock',
    _key: key(),
    columns: '3',
    items: [
      {
        _key: key(),
        eyebrow: '1',
        heading: 'Genomgång, 45 minuter',
        body: 'Revisorer från Senseworks visar plattformen utifrån er koncernstruktur.',
      },
      {
        _key: key(),
        eyebrow: '2',
        heading: 'Testperiod i en byrå',
        body: 'Riktiga uppdrag, byråns egna revisorer.',
      },
      {
        _key: key(),
        eyebrow: '3',
        heading: 'Beslut om koncernen',
        body: 'På underlag från er egen verksamhet.',
      },
    ],
  },
  // Closing CTA — in the source doc, not in Dan's block list; added
  // for the final-CTA-before-footer pattern the other blocks already
  // follow (D21). Easy to drop if it's one CTA too many.
  {
    _type: 'ctaBannerBlock',
    _key: key(),
    heading: 'Boka en genomgång',
    body: 'Ni träffar revisorer, inte säljare.',
    ctaLabel: 'Boka en genomgång',
    ctaHref: '#',
    tone: 'inverse',
  },

  // Footer — same minimal content as v1/v2.
  {
    _type: 'footerBlock',
    _key: key(),
    copyrightText: 'Senseworks AB',
    legalLinks: [
      { _key: key(), label: 'Kontakt', href: '#' },
      { _key: key(), label: 'Integritet', href: '#' },
    ],
  },
]

async function run() {
  const doc = {
    _type: 'page',
    title: 'Byråkoncern landningssida, v3',
    slug: { _type: 'slug', current: 'lp/v3' },
    language: 'sv',
    blocks,
  }
  const result = await client.create(doc)
  console.log('Created page:', result._id)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
