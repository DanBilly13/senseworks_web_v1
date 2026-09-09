// One-off script to populate the "lp/v2" experiment landing page —
// a block-out recreation of https://senseworks-2-0.webflow.io/cedra-test-1-0
// using only existing blocks, no images/video yet. Copy is verbatim from
// the reference page (extracted via textContent, since several sections
// are hidden behind scroll-reveal animations there).
// Run with: npx sanity exec scripts/create-lp-v2.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

let keyCounter = 0
function key() {
  keyCounter += 1
  return `v2k${keyCounter}`
}

const blocks: Record<string, unknown>[] = [
  // 1. HERO — eyebrow/headline/subhead/CTA + big media block (the
  // reference has a product-screenshot graphic here; left empty).
  {
    _type: 'heroTextBlock',
    _key: key(),
    eyebrow: 'Analys- och revisionsplattform',
    headline: 'Maximera koncernens värde. På veckor. Inte år.',
    subhead:
      'Samla era byråers styrka i en plattform så att det bästa arbetssättet gäller hela koncernen och ledningen kan styra kvalitet och produktivitet. Hela revisionsarbetet i ett gemensamt flöde, med i snitt 20 procent kortare uppdragstid. Med utrymme för varje byrås egenart och varumärke. Helt utan utvecklingsrisk.',
    ctaLabel: 'Boka möte',
    ctaHref: '#',
  },
  {
    _type: 'mediaBlock',
    _key: key(),
  },

  // 2. Bare 3-item feature strip — no section heading in the reference.
  {
    _type: 'featureGridBlock',
    _key: key(),
    heading: '',
    items: [
      {
        _key: key(),
        title: 'Avkastning direkt',
        description:
          'Full-service ingår: datamigrering, byråanpassning av plattformen och utbildning för team. Spara tid redan år 1.',
      },
      {
        _key: key(),
        title: 'Samma kvalitet överallt',
        description:
          'Byggt på ISA, ISA för LCE och KISA. I drift hos etablerade byråer med höga säkerhets- och kvalitetskrav.',
      },
      {
        _key: key(),
        title: 'Från SME till OMX30+',
        description:
          'Från enkla SME-uppdrag till komplexa revisioner med upp till 50 miljoner rader data. Samma plattform, hela koncernen.',
      },
    ],
  },

  // 3. Stats band — the reference animates these as scrambling digit
  // counters; final values read from the same 3 stats repeated as a
  // plain list in the page's booking-modal sidebar.
  {
    _type: 'statsBandBlock',
    _key: key(),
    heading: 'Beprövat av Nordens ledande byråer',
    body: 'Låt oss visa hur ni säkrar en tidsbesparing på 20 % redan under första året, utan att störa den löpande driften. Boka ett möte så visar vi hur ni konsoliderar era byråer och lyfter er lönsamhet direkt.',
    items: [
      { _key: key(), value: '70%', label: 'byråer i daglig drift' },
      { _key: key(), value: '1 000+', label: 'revisorer' },
      { _key: key(), value: '20%', label: 'kortare uppdragstid' },
    ],
  },

  // 4. Testimonial — Stefan Andersson / Azets (first appearance).
  {
    _type: 'testimonialCarouselBlock',
    _key: key(),
    heading: '',
    items: [
      {
        _key: key(),
        quote:
          'Med Senseworks kan vi effektivisera metodiken och skapa en revision som är skräddarsydd för SME-affären; enkel för revisorerna, värdeskapande för kunderna och attraktiv för de allt fler byråer som ansluter till oss.',
        authorName: 'Stefan Andersson',
        authorRole: 'Head of Development and Innovation, Azets',
      },
    ],
  },

  // 5. Testimonial — Björn Elfgren / Warmare.
  {
    _type: 'testimonialCarouselBlock',
    _key: key(),
    heading: '',
    items: [
      {
        _key: key(),
        quote:
          'Vi fastnade för det direkt. Det var något helt annat än de gamla systemen: snyggt, modernt och enkelt att förstå. Dessutom lyssnade Senseworks på våra idéer och lät oss vara med och påverka utvecklingsplanen.',
        authorName: 'Björn Elfgren',
        authorRole: 'Vd och revisor på Warmare',
      },
    ],
  },

  // 6. Body + CTA reinforcement — no heading in the reference.
  {
    _type: 'ctaBannerBlock',
    _key: key(),
    heading: '',
    body: 'Med Senseworks får ni fulla konfigurationsmöjligheter och en skräddarsydd känsla, men till en transparent kostnad. Vi tar utvecklingsinvesteringen och bär den tekniska risken. Ni kan hämta hem synergieffekterna och avkastningen direkt, i stället för att vänta på ett it-projekt.',
    ctaLabel: 'Boka möte',
    ctaHref: '#',
    tone: 'default',
  },

  // 7. Feature Split — process/integration explainer.
  {
    _type: 'featureSplitBlock',
    _key: key(),
    heading: 'Er revisionsprocess samlad och med full kontroll',
    body: 'Det är en sak att bygga enkla visualiseringar av data. Men att underhålla sömlösa live-kopplingar till Fortnox, Visma, Skatteverket, Bolagsverket och de stora bankerna är anledningen till att egenbyggda projekt ofta stannar av. Senseworks är byggt för att automatisera hela flödet utifrån en gemensam databas. Plattformen hämtar verifikat, banktransaktioner och skattekonton med ett klick. Vi sköter hela den tekniska infrastrukturen så att ni kan fokusera på rådgivning.',
    imagePosition: 'left',
  },

  // 8. Testimonial — Stefan Andersson / Azets, repeated (matches the
  // reference reusing the same quote here too).
  {
    _type: 'testimonialCarouselBlock',
    _key: key(),
    heading: '',
    items: [
      {
        _key: key(),
        quote:
          'Med Senseworks kan vi effektivisera metodiken och skapa en revision som är skräddarsydd för SME-affären; enkel för revisorerna, värdeskapande för kunderna och attraktiv för de allt fler byråer som ansluter till oss.',
        authorName: 'Stefan Andersson',
        authorRole: 'Head of Development and Innovation, Azets',
      },
    ],
  },

  // 9. "Kompromisslös trygghet från ett team som kan branschen" — in the
  // reference this heading sticks/pins while three different content
  // groups scroll past beneath it (shown 3 times in the DOM). We don't
  // have that scroll-pin effect, so it's rendered once here via the new
  // Section Headline block, followed by all three groups in sequence.
  {
    _type: 'sectionHeadlineBlock',
    _key: key(),
    headline: 'Kompromisslös trygghet från ett team som kan branschen',
    align: 'center',
  },

  // 9a. Vecka 1 / Några veckor / Caption — alternating left/right, same
  // pattern as v1's STEGEN section. Note: "Caption" is the reference
  // site's literal (unfilled) placeholder label, kept verbatim.
  {
    _type: 'featureSplitBlock',
    _key: key(),
    eyebrow: 'Vecka 1',
    heading: 'Smidig onboarding',
    body: 'Vårt CS- och projektledningsteam sköter hela datamigreringen, onboardingen och utbildningen. Det tar cirka två minuter att starta ett uppdrag, och ni är igång efter bara två till tre revisioner – helt utan avbrott i den löpande driften.',
    imagePosition: 'right',
  },
  {
    _type: 'featureSplitBlock',
    _key: key(),
    eyebrow: 'Några veckor',
    heading: 'Etablerad standard',
    body: 'Ett gemensamt, tidseffektivt arbetssätt är satt över hela koncernen. Genom att eliminera onödig administration minskar ni stressen under högsäsongen, samtidigt som ni säkrar en tidsbesparing på 20 % per uppdrag.',
    imagePosition: 'left',
  },
  {
    _type: 'featureSplitBlock',
    _key: key(),
    eyebrow: 'Caption',
    heading: 'Expansion',
    body: 'Plattformen är utvecklad för internationell tillväxt i både Sverige och Norge. Ni får löpande tillgång till nästa generations AI-teknik utan att belasta organisationen med ny teknisk skuld.',
    imagePosition: 'right',
  },

  // 9b. Högre lönsamhet / Ett säkrat försprång / Sluta kopiera i sidled.
  {
    _type: 'featureGridBlock',
    _key: key(),
    heading: '',
    items: [
      {
        _key: key(),
        title: 'Högre lönsamhet under egna varumärken',
        description:
          'När ni startar nya perioder utifrån färdiga strukturer sparar ni värdefull tid. Systemet tillåter er att behålla de förvärvade byråernas unika identiteter under en gemensam plattform.',
      },
      {
        _key: key(),
        title: 'Ett säkrat försprång på marknaden',
        description:
          'I stället för att sitta fast i breda, statiska standardsystem får ni en renodlad revisionsplattform i ständig utveckling. Vi investerar i er process så att ni alltid ligger steget före, fullt compliant med ISA och ISA för LCE.',
      },
      {
        _key: key(),
        title: 'Sluta kopiera i sidled',
        description:
          'Många utgår från förra årets dokumentation, vilket sprider gamla arbetssätt i sidled. Senseworks bygger på en gemensam best practice-baseline. Metodikansvariga styr spelregler och mallar centralt, medan inbyggda hjälptexter säkerställer en konsekvent hög kvalitet i varje enskilt uppdrag.',
      },
    ],
  },

  // 9c. Stabilitet och driftgaranti / Oberoende / Branschexperter.
  {
    _type: 'featureGridBlock',
    _key: key(),
    heading: '',
    items: [
      {
        _key: key(),
        title: 'Stabilitet och driftgaranti',
        description:
          'Våra enterprise-kunder omfattas av strikta garantier med en avtalad drifttid på 99,7 %. Vi är finansiellt stabila och backas av Sveriges främsta investerare, däribland statliga Industrifonden.',
      },
      {
        _key: key(),
        title: 'Oberoende',
        description:
          'Senseworks är ett helt fristående företag och bedriver ingen egen revisionsverksamhet. Vi konkurrerar aldrig med er om era kunder, och vi är helt oberoende från specifika systemleverantörer.',
      },
      {
        _key: key(),
        title: 'Branschexperter',
        description:
          'Vårt team består av både revisorer och utvecklare. Vi möter revisionsbranschens ökande komplexitet genom att ta hela det tekniska ansvaret åt er. Det frigör tid för er att vara strategiska kravställare och forma plattformen med oss, backade av vår fulla support- och CS-funktion.',
      },
    ],
  },

  // 10. Testimonial — Pär Ramsten / Adsum Revision.
  {
    _type: 'testimonialCarouselBlock',
    _key: key(),
    heading: '',
    items: [
      {
        _key: key(),
        quote:
          'Senseworks är inte bara ett verktyg, det är också en kultur som präglas av lyhördhet och framåtanda.',
        authorName: 'Pär Ramsten',
        authorRole: 'Auktoriserad revisor på Adsum Revision',
      },
    ],
  },

  // 11. Closing CTA.
  {
    _type: 'ctaBannerBlock',
    _key: key(),
    heading: 'Hämta hem effekterna nu, inte om två år',
    body: 'Låt oss visa hur ni säkrar en tidsbesparing på 20 % redan under första året, utan att störa den löpande driften. Boka ett möte så visar vi hur ni konsoliderar era byråer och lyfter er lönsamhet direkt.',
    ctaLabel: 'Boka möte',
    ctaHref: '#',
    tone: 'inverse',
  },

  // 12. FAQ — the reference reuses the same literal answer for all 3
  // questions (unfinished copy, kept verbatim per instruction).
  {
    _type: 'faqAccordionBlock',
    _key: key(),
    heading: 'Frågor och svar',
    items: [
      {
        _key: key(),
        question:
          'Vi har precis förvärvat nya byråer, vi orkar inte belasta organisationen med ett systembyte nu?',
        answer:
          'Det är precis därför ni ska välja oss. Vårt team sköter hela datamigreringen, onboardingen och utbildningen. Det tar cirka två minuter att starta ett uppdrag, och ni är igång efter bara två till tre revisioner – helt utan avbrott i den löpande driften eller negativ påverkan på era nyförvärv.',
      },
      {
        _key: key(),
        question: 'Kan plattformen hantera våra stora, komplexa uppdrag och hålla kvaliteten mot ISA?',
        answer:
          'Det är precis därför ni ska välja oss. Vårt team sköter hela datamigreringen, onboardingen och utbildningen. Det tar cirka två minuter att starta ett uppdrag, och ni är igång efter bara två till tre revisioner – helt utan avbrott i den löpande driften eller negativ påverkan på era nyförvärv.',
      },
      {
        _key: key(),
        question: 'Hur hanterar ni datasäkerhet och den regulatoriska väggen?',
        answer:
          'Det är precis därför ni ska välja oss. Vårt team sköter hela datamigreringen, onboardingen och utbildningen. Det tar cirka två minuter att starta ett uppdrag, och ni är igång efter bara två till tre revisioner – helt utan avbrott i den löpande driften eller negativ påverkan på era nyförvärv.',
      },
    ],
  },

  // Footer — same minimal content as v1.
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
    title: 'Cedra landningssida, v2',
    slug: { _type: 'slug', current: 'lp/v2' },
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
