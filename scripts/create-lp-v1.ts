// One-off script to populate the "lp/v1" experiment landing page.
// Run with: npx sanity exec scripts/create-lp-v1.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

let keyCounter = 0
function key() {
  keyCounter += 1
  return `k${keyCounter}`
}

const blocks: Record<string, unknown>[] = [
  // 1. HERO: LÖFTET — hero text + big media block, per instruction
  {
    _type: 'heroTextBlock',
    _key: key(),
    eyebrow: 'För revisions och rådgivningskoncerner med flera byråer under samma tak',
    headline: 'Spara 20 % tid på varje revision på varje byrå. Utan att byråerna blir likadana.',
    subhead:
      'En revision- och rådgivningsplattform för hela koncernen, byggd för ISA, KISA och ISA for LCE. Koncernen får en metodik, en kvalitetsbild och en kapacitet. Varje byrå kan anpassa vidare, behålla sitt namn och sin egenart.',
    ctaLabel: 'Boka en genomgång',
    ctaHref: '#',
  },
  {
    _type: 'mediaBlock',
    _key: key(),
    // No media asset yet — deliberately left empty per instruction (no images/video for now).
  },

  // 2. RISKVÄNDNING PÅ LÖFTENA — 3 boxes, no section heading in the mock
  {
    _type: 'featureGridBlock',
    _key: key(),
    heading: '',
    items: [
      {
        _key: key(),
        title: 'Tiden tas från insamlingen, inte från granskningen.',
        description:
          'Rädslan: tiden sparas genom att granska mindre. Det som försvinner är att begära, vänta, mejla och sammanställa underlag. Huvudbok, deklarationer och registerdata hämtas från källan, avstämningen görs i plattformen. Revisorns tid går till bedömningen, som förut, men utan förarbetet.',
      },
      {
        _key: key(),
        title: 'Stordrift där det räknas. Egenart där det syns.',
        description:
          'Rädslan: en standard betyder likriktning. Metodik, mallar, integrationer och uppföljning sätts en gång och delas av alla, det är stordriften. Uppdraget avgör programmet: ISA, ISA for LCE eller K ISA. Byrån anpassar vidare inom ramen, behåller sitt namn och sina arbetssätt. Koncernen samordnar, byråerna bestämmer hur.',
      },
      {
        _key: key(),
        title: 'Kvalitetsbilden visar var granskningen står, inte vem som är sämst.',
        description:
          'Rädslan: en gemensam kvalitetsbild blir övervakning av partners, och kvalitet mätt i checklistor i stället för omdöme. Koncernen ser status, öppna punkter och avvikelser medan uppdraget pågår, så att stöd kan sättas in i tid. Bedömningen är fortfarande revisorns. Varje byrå behåller sitt eget kvalitetsstyrningssystem.',
      },
    ],
  },

  // 3. BEVIS — logos, then testimonials (heading carries the section's h2)
  {
    _type: 'logoCloudBlock',
    _key: key(),
    logos: [
      { _key: key(), name: 'Azets' },
      { _key: key(), name: 'Logotyp' },
      { _key: key(), name: 'Logotyp' },
      { _key: key(), name: 'Logotyp' },
      { _key: key(), name: 'Logotyp' },
    ],
  },
  {
    _type: 'testimonialCarouselBlock',
    _key: key(),
    heading: 'Över 90 byråer och 1 000 revisorer i ägarledda bolags segment arbetar i Senseworks',
    items: [
      // Only one real quote was supplied in the mock (the second slot was a
      // placeholder note, "citat att inhämta" — not real copy). Repeated
      // per instruction to fill the carousel.
      {
        _key: key(),
        quote:
          'Med Senseworks kan vi effektivisera metodiken och skapa en revision som är skräddarsydd för SME-affären; enkel för revisorerna, värdeskapande för kunderna och attraktiv för de allt fler byråer som ansluter till oss.',
        authorName: 'Stefan Andersson',
        authorRole: 'Head of Development and Innovation på Azets',
      },
      {
        _key: key(),
        quote:
          'Med Senseworks kan vi effektivisera metodiken och skapa en revision som är skräddarsydd för SME-affären; enkel för revisorerna, värdeskapande för kunderna och attraktiv för de allt fler byråer som ansluter till oss.',
        authorName: 'Stefan Andersson',
        authorRole: 'Head of Development and Innovation på Azets',
      },
      {
        _key: key(),
        quote:
          'Med Senseworks kan vi effektivisera metodiken och skapa en revision som är skräddarsydd för SME-affären; enkel för revisorerna, värdeskapande för kunderna och attraktiv för de allt fler byråer som ansluter till oss.',
        authorName: 'Stefan Andersson',
        authorRole: 'Head of Development and Innovation på Azets',
      },
    ],
  },

  // 4. ALTERNATIVEN — vad det kostar att inte ha det
  {
    _type: 'featureGridBlock',
    _key: key(),
    heading: 'Vad det kostar koncernen att inte ha det',
    body: 'En femtedel av tiden i varje revision går till att begära, vänta på och sammanställa underlag. Gånger antalet uppdrag. Gånger antalet byråer. Varje år ni väntar. Tre sätt att fortsätta betala den räkningen.',
    items: [
      {
        _key: key(),
        title: 'Tio system betalar ni för varje dag',
        description:
          'Tio mallbibliotek att underhålla när ISA, K ISA eller branschkrav ändras. Samma ändring, tio gånger.\nEn femtedel av varje revision går till insamling för hand: begära, vänta, mejla, sammanställa. I varje byrå, i varje uppdrag.\nVar granskningen står syns byrå för byrå, i efterhand. Koncernen kan inte sätta in stöd förrän det är för sent.\nLedig kapacitet i en byrå hjälper ingen annan. Högsäsongen köps med övertid och konsulter.\nVarje nytt förvärv blir ett system till att förvalta.\nRäkningen växer med varje byrå ni köper.',
      },
      {
        _key: key(),
        title: 'Åren innan något finns är den dyraste posten',
        description:
          'Grunden måste byggas först: ISA, ISA for LCE, K ISA, juridiska former, integrationer mot bokföring, Skatteverket och Bolagsverket, framrullning. Först därefter det som skulle särskilja er.\nUnder byggåren betalar ni räkningen i vänstra kolumnen, för varje byrå, varje säsong.\nNär det är klart äger ni ett produktbolag: utveckling, drift, säkerhet, och varje integration som ska hållas i takt med bank, Skatteverket och bokföringsleverantörer.\nDet ni vill bygga finns till stor del redan. Resten bygger vi tillsammans, med avtalad leveransplan.',
      },
      {
        _key: key(),
        title: 'Två migreringar där en räcker',
        description:
          'Revisorerna flyttas in i ett system för att sedan flyttas igen, båda gångerna under någons högsäsong.\nTvå utbildningsrundor, två perioder med lägre produktivitet, två gånger tappat förtroende för systembyten.\nEtt byte, inte två. Låt plattformen vara det som enar.',
      },
    ],
  },

  // 5. HURET — så får ni det vi lovade (2nd hero text + media pairing)
  {
    _type: 'heroTextBlock',
    _key: key(),
    headline: 'Så sparar varje byrå 20 % på varje revision, med sin egenart kvar',
    subhead:
      'En metodik som ägs centralt och når varje uppdrag i alla byråer. Underlag som hämtas från bokföring, Skatteverket och Bolagsverket i stället för att begäras. En vy där ledningen ser var varje uppdrag står medan granskningen pågår. Fem steg, ett per löfte.',
    ctaLabel: 'Boka en genomgång',
    ctaHref: '#',
  },
  {
    _type: 'mediaBlock',
    _key: key(),
  },

  // 6. STEGEN — 5 numbered steps
  {
    _type: 'featureGridBlock',
    _key: key(),
    heading: '',
    items: [
      {
        _key: key(),
        title: 'Sätt koncernens metodik en gång',
        description:
          'Löfte: en metodik. Steg 1. Metodikansvarig konfigurerar koncernens standard: ISA respektive ISA for LCE program, K ISA, branschmallar, dokumentmallar och granskningsprogram. Det som låg i tio mallbibliotek ligger nu på ett ställe och ändras på ett ställe.\nUppdraget styr regelverket, inte byrån. ISA, ISA for LCE och K ISA i samma plattform.\nBranschmallar på koncernnivå. Bygg en gång, använd överallt.\nJuridiska former inbyggda. Aktiebolag, stiftelser, föreningar och övriga.\nKonfiguration, inte utveckling. Ändringar kräver inte leverantören.',
      },
      {
        _key: key(),
        title: 'Anslut varje byrå med sitt varumärke och sina anpassningar',
        description:
          'Löfte: byrån behåller namn och egenart. Steg 2. Byrån får plattformen under eget namn och egen logotyp och anpassar vidare inom koncernens ram: egna branschprogram, egna dokumentmallar. Medarbetarna arbetar i koncernens metodik utan att kunden märker annat än att underlagen kommer snabbare.\nCitat att inhämta: partner i ansluten byrå om övergången.',
      },
      {
        _key: key(),
        title: 'Låt underlaget komma till revisorn. Här sparas tiden.',
        description:
          'Löfte: 20 % tid på varje revision. Steg 3. Huvudbok, deklarationsuppgifter och registerdata hämtas via integrationerna i stället för att begäras och mejlas. Bankavstämning görs mot huvudboken. När året är slut rullas uppdraget fram med riskbedömning, program och dokumentation. Revisorn börjar granska i stället för att börja samla.\nFortnox, Visma och Björn Lundén för bokföringen.\nSkatteverket och Bolagsverket för deklarations och registeruppgifter.\nBankavstämning mot huvudbok.\nFramrullning mellan åren, kopiering mellan bolag.',
      },
      {
        _key: key(),
        title: 'Se var varje uppdrag står, i alla byråer, medan det pågår',
        description:
          'Löfte: en kvalitetsbild. Steg 4. Klientlistan visar uppdragsstatus för hela koncernen. Metodikansvarig ser var granskningen står, var det finns interna kommentarer och vad som inte är påtecknat, oavsett byrå. Stöd sätts in medan det gör skillnad, inte i efterhand.\nMåste alla byråer arbeta exakt lika? Nej. Koncernen bestämmer vad som är standard och vad som är byråns eget. En byrå med tung offentlig sektor behåller sina program för det, inom samma plattform och samma uppföljning.',
      },
      {
        _key: key(),
        title: 'Låt kapaciteten följa behovet över byråerna',
        description:
          'Löfte: en kapacitet. Steg 5. Samma system i alla byråer betyder att en kollega i Göteborg kan gå in i ett uppdrag i Sundsvall utan att lära sig något nytt. Uppdragsansvarig och kund är fortfarande byråns. Högsäsongen fördelas över koncernen i stället för att köpas med övertid.',
      },
    ],
  },

  // 7. VÄRDEERBJUDANDEN — de tre USP:arna
  {
    _type: 'featureGridBlock',
    _key: key(),
    heading: 'Därför går det att lova',
    items: [
      {
        _key: key(),
        title: 'Innovation som gör jobbet: underlaget kommer till revisorn',
        description:
          'Huvudbok från Fortnox, Visma och Björn Lundén. Deklarations och registeruppgifter från Skatteverket och Bolagsverket. Bankavstämning mot huvudbok. Framrullning mellan åren och kopiering mellan bolag. Det som förut var timmar av insamling per uppdrag sker i plattformen, och revisorn börjar i granskningen.',
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
          'Metodik, mallar, granskningsprogram, branschanpassningar och varumärke sätts i administrationen av er metodikansvarig. Ni får det man annars bygger eget för, en plattform formad för er verksamhet, till en bråkdel av tiden och risken. Det som ändå saknas byggs tillsammans med avtalad leveransplan.',
      },
    ],
  },

  // 8a. HUVUDSAKLIG RISKVÄNDNING — guarantee-adjacent boxes
  {
    _type: 'featureGridBlock',
    _key: key(),
    heading: 'Om det vi lovat inte håller hos er',
    items: [
      {
        _key: key(),
        title: 'En byrå först. Koncernen sedan.',
        description:
          'Gäller det oss? Testperioden görs i en byrå, på riktiga uppdrag, med byråns egna revisorer. Uppdragstiden mäts före och efter, i er verksamhet. Håller inte 20 procent hos er vet ni det innan något beslut om koncernen.',
      },
      {
        _key: key(),
        title: 'Ingen byrå byter mitt i ett uppdrag',
        description:
          'Hjälp hela vägen. Anslutning sker mellan säsonger, byrå för byrå. Senseworks revisorer är med under första högsäsongen i varje ansluten byrå.',
      },
      {
        _key: key(),
        title: 'Leveransgarantin',
        description:
          'Konfiguration och gemensam utveckling. Det som avtalas i utrullningsplanen levereras på avtalat datum. Saknas en avtalad funktion vid datumet sänks månadsavgiften med 25 procent tills den finns.',
      },
      {
        _key: key(),
        title: 'Er data är er, i format ni kan ta med',
        description: 'Om vägarna skiljs. Uppdrag, dokumentation och arkiv kan exporteras.',
      },
    ],
  },

  // 8b. Stabilitet / Oberoende / Experter
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

  // 8c. FAQ
  {
    _type: 'faqAccordionBlock',
    _key: key(),
    heading: '',
    items: [
      {
        _key: key(),
        question: 'Vad händer med pågående uppdrag och historik när en byrå byter?',
        answer: 'Text saknas.',
      },
      {
        _key: key(),
        question:
          'Hur påverkas kvalitetsstyrning per byrå och oberoendekontroll över koncernen?',
        answer: 'Text saknas.',
      },
      {
        _key: key(),
        question: 'Vi har lokal drift i dag och den känns billig.',
        answer:
          'Den ser billig ut för att kostnaderna ligger i andra budgetar: hårdvara som skrivs av, IT timmar, säkerhetsuppdateringar, backup, driftstopp under högsäsong. Räkna ihop dem så blir bilden en annan. Vi hjälper gärna till med kalkylen.',
      },
    ],
  },

  // 9. KUNDRÖSTER — both slots in the mock were placeholder notes
  // ("citat att inhämta"), not real quotes, so left as the two distinct
  // placeholders rather than repeated (nothing real to repeat here).
  {
    _type: 'testimonialCarouselBlock',
    _key: key(),
    heading: 'Därför bytte byråerna',
    ctaLabel: 'Boka en genomgång',
    ctaHref: '#',
    items: [
      {
        _key: key(),
        quote: 'Citat att inhämta: byrå som mätt utfall, siffra i rubriken.',
        authorName: 'Namn, roll, byrå',
      },
      {
        _key: key(),
        quote: 'Citat att inhämta: mindre byrå.',
        authorName: 'Namn, roll, byrå',
      },
    ],
  },

  // 10a. NÄSTA STEG — 3-step process
  {
    _type: 'featureGridBlock',
    _key: key(),
    heading: 'Så går det till från första samtalet',
    items: [
      {
        _key: key(),
        title: 'Genomgång, 45 minuter.',
        description: 'Revisorer från Senseworks visar plattformen utifrån er koncernstruktur.',
      },
      {
        _key: key(),
        title: 'Testperiod i en byrå.',
        description: 'Riktiga uppdrag, byråns egna revisorer.',
      },
      {
        _key: key(),
        title: 'Beslut om koncernen.',
        description: 'På underlag från er egen verksamhet.',
      },
    ],
  },

  // 10b. Closing CTA + founder blurb
  {
    _type: 'ctaBannerBlock',
    _key: key(),
    heading: '',
    body: 'Ni träffar revisorer, inte säljare. Grundaren. Text skrivs av Alexander. Riktning: "jag byggde själv så att ni skulle slippa".',
    ctaLabel: 'Boka en genomgång',
    ctaHref: '#',
    tone: 'inverse',
  },

  // Footer
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
    title: 'Cedra landningssida, low fi v3',
    slug: { _type: 'slug', current: 'lp/v1' },
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
