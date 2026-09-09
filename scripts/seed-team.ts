// Seeds the real Senseworks team roster (teamMember docs) from
// web-bits/Team — photos + names/roles/bios transcribed from
// "Team Names.txt" (validated against the "Senseworks - Om oss.png"
// design reference, which lists the same 30 names/roles). Also
// migrates the two placeholder "author" docs (Isak Forslund, Linnéa
// Jonsson) used by the seeded Knowledge Bank articles onto the new
// teamMember type, repoints those articles' author references, and
// removes the old author docs.
// Run with: npx sanity exec scripts/seed-team.ts --with-user-token
import fs from 'node:fs'
import path from 'node:path'
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const ASSET_DIR = '/Users/danielbillingham/Documents/senseworks/web-bits/Team'

type Person = {
  name: string
  role: string
  photo?: string
  bio?: string
  email?: string
}

const TEAM: Person[] = [
  { name: 'Albin Frick', role: 'Software Engineer', photo: 'albinFrick.png' },
  {
    name: 'Alexander Ögren',
    role: 'CEO',
    photo: 'alexanderOgren1080px.png',
    bio: 'Jag föredrar att ha ett helhetsgrepp och förstå saker från grunden och jag har lagt ner mycket tid på att arbeta med uppdrag inom ett brett spektrum: redovisning, revision, skatt och relaterade områden, från små ägarledda företag till stora börsnoterade koncerner. Mina största intressen är dataanalys, BI och framtidens data för redovisning/revision och rapportering.\n\nJag är VD och produktägare på Senseworks. Du kontaktar mig om du vill undersöka samarbetsmöjligheter, har frågor eller feedback om våra produkter.',
  },
  { name: 'Anja Englund', role: 'Customer Success', photo: 'anjaEnglund.png' },
  { name: 'Anna Arnle', role: 'UI Designer', photo: 'annaArnle.png' },
  // No photo file provided for Anton Holmgren — falls back to the
  // default avatar icon like anyone else without a photo yet.
  { name: 'Anton Holmgren', role: 'Head of AI/Analytics' },
  { name: 'Anton Li', role: 'AI Engineer', photo: 'antonLi.png' },
  { name: 'Dan Billingham', role: 'Product designer', photo: 'danBillingham.png' },
  { name: 'Daniel Harr', role: 'Software Engineer', photo: 'danielHarr.png' },
  { name: 'Emil Hallberg', role: 'Frontend Lead', photo: 'emilHallberg.png' },
  { name: 'Hedvig Zhang', role: 'Product Design Lead', photo: 'hedvigZhang.png' },
  {
    name: 'Henrik Frienholt',
    role: 'Business Advisor',
    photo: 'henrikFrienholt.png',
    bio: 'Med stor variation har jag tillägnat mitt yrkesliv åt bolagbyggande och försäljning fokuserat på digitala tjänster och konsultnära tjänster. Fokuset har alltid varit att förnya, omvandla och översätta varumärkes-, försäljnings- och marknadsföringsstrategi till värde mot marknaden. Mitt entreprenörskap bygger på att få bedriva och skapa förändringar med ett "disruptive" mindset.',
    email: 'henrik@senseworks.io',
  },
  {
    name: 'Ian Powter',
    role: 'Key Account Manager',
    photo: 'ianPowter.png',
    bio: 'Det är mötet med kunden som gör jobbet roligt och meningsfullt för mig. Jag uppskattar att skapa smarta, hållbara lösningar som gör skillnad. Både för kundens vardag och den långsiktiga lönsamheten. Jag uppskattar verkligen att få bygga relationer, lyssna in behov, utmana idéer och tillsammans hitta lösningar som gynnar våra kunder.\n\nHör gärna av dig om du vill veta mer om hur Senseworks kan stärka er verksamhet, diskutera ett potentiellt partnerskap eller utbyta idéer kring digitalisering och framtidssäkring av ert byråerbjudande.',
    email: 'ian@senseworks.io',
  },
  { name: 'Isak Forslund', role: 'Quality Engineer', photo: 'isakForslund.png' },
  { name: 'Isak Hugosson', role: 'Data engineer', photo: 'isakHugosson.png' },
  { name: 'Jacob Norén', role: 'AI Engineer', photo: 'jacobNoren.png' },
  { name: 'Johan Hugg', role: 'Software Engineer', photo: 'johanHugg.png' },
  { name: 'Johan Jonsson', role: 'Head of Engineering', photo: 'johanJonsson.png' },
  { name: 'Jonny Jakobsson', role: 'Data Analyst', photo: 'jonnyJakobsson.png' },
  {
    name: 'Josefine Söderberg',
    role: 'Product Manager',
    photo: 'josefineSoderberg.png',
    email: 'josefine@senseworks.io',
  },
  {
    name: 'Linnéa Jonsson',
    role: 'Customer Success Manager',
    photo: 'linneaJonsson.png',
    email: 'linnea@senseworks.io',
  },
  { name: 'Lisa Fjellström', role: 'Software Engineer', photo: 'lisaFjellstrom.png' },
  { name: 'Mikael Olsson', role: 'Full Stack Developer', photo: 'mikaelOlsson.png' },
  { name: 'Mirjam Lundin', role: 'Marketing Manager', photo: 'mirjamLundin.png' },
  { name: 'P-A Bäckström', role: 'Senior Software Engineer', photo: 'paBackstrom.png' },
  { name: 'Per Strömgren', role: 'Software Engineer', photo: 'perStromgren.png' },
  { name: 'Rebecca Ludvigsson', role: 'Customer Success Manager', photo: 'rebeccaLudvigsson.png' },
  { name: 'Rickard Jonsson', role: 'DevOps Engineer', photo: 'rickardJonsson.png' },
  {
    name: 'Robert Winter',
    role: 'CTO',
    photo: 'robertWinter.png',
    bio: 'Jag är en teknisk ledare och ingenjör med lång erfarenhet från DevOps, utveckling, arkitektur och ledarskapsroller. Jag har byggt startups och skalat organisationer som CTO, VD och chef. Efter att ha arbetat både med tekniken och affären har jag en god förståelse för orsakerna till att teknik finns (aka affärskrav).\n\nPå Senseworks är jag CTO. Jag ansvarar för vår teknikorganisation och sitter i mycket dialoger med våra enterprise-kunder. Jag älskar att lära mig saker, läser mycket böcker och är en av grundarna av både Cloud Native Northern Sweden och Umeå Machine Learning-meetupsen.',
  },
  { name: 'Simon Lilliesköld Jonsson', role: 'AI Engineer', photo: 'simonLillieskoldJonsson.png' },
  { name: 'Sophie Birgersson', role: 'Head of Finance', photo: 'sophieBirgersson.png' },
]

function slugify(name: string) {
  // NFD + stripping combining marks transliterates å/ä/ö *and* accents
  // like the é in "Linnéa"/"Norén" in one pass (they all decompose to
  // a base letter + a combining diacritic) — a manual [åä]/ö replace
  // list silently misses anything outside that specific set.
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const uploadCache = new Map<string, { _type: 'image'; asset: { _type: 'reference'; _ref: string } }>()

async function uploadPhoto(filename: string) {
  if (uploadCache.has(filename)) return uploadCache.get(filename)!
  const stream = fs.createReadStream(path.join(ASSET_DIR, filename))
  const asset = await client.assets.upload('image', stream, { filename })
  const image = { _type: 'image' as const, asset: { _type: 'reference' as const, _ref: asset._id } }
  uploadCache.set(filename, image)
  return image
}

// Old placeholder author -> new teamMember id, so the seeded
// Knowledge Bank articles can be repointed at the real roster.
const AUTHOR_MIGRATION: Record<string, string> = {
  'author-isak-forslund': 'teamMember-isak-forslund',
  'author-linnea-jonsson': 'teamMember-linnea-jonsson',
}

async function run() {
  for (const person of TEAM) {
    const id = `teamMember-${slugify(person.name)}`
    const photo = person.photo ? await uploadPhoto(person.photo) : undefined

    await client.createOrReplace({
      _id: id,
      _type: 'teamMember',
      name: person.name,
      role: person.role,
      ...(photo ? { photo } : {}),
      ...(person.bio ? { bio: person.bio } : {}),
      ...(person.email ? { email: person.email } : {}),
    })
    console.log(`Upserted ${person.name}`)
  }

  const articles = await client.fetch<{ _id: string; author?: { _ref: string } }[]>(
    `*[_type == "article" && author->_id in $oldIds]{_id, author}`,
    { oldIds: Object.keys(AUTHOR_MIGRATION) },
  )

  for (const article of articles) {
    const newRef = AUTHOR_MIGRATION[article.author!._ref]
    await client
      .patch(article._id)
      .set({ author: { _type: 'reference', _ref: newRef } })
      .commit()
    console.log(`Repointed article ${article._id} -> ${newRef}`)
  }

  for (const oldId of Object.keys(AUTHOR_MIGRATION)) {
    await client.delete(oldId)
    console.log(`Deleted old placeholder doc ${oldId}`)
  }

  console.log(`Done — seeded ${TEAM.length} team members.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
