// Replaces the placeholder "Bjorn Lunden" article's body with the
// real Swedish copy and screenshots from the live Webflow article —
// gives us one genuinely real article (real images, real text) to
// verify the breakout-grid layout against, rather than only the
// gradient-placeholder seed content.
// Run with: npx sanity exec scripts/populate-bjorn-lunden-article.ts --with-user-token
import fs from 'node:fs'
import path from 'node:path'
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const ASSET_DIR = '/Users/danielbillingham/Documents/senseworks/web-bits/Test - Article'
const ARTICLE_ID = 'article-bjorn-lunden-integration-allt-du-behover-veta'
const AUTHOR_ID = 'author-linnea-jonsson'

async function uploadImage(filename: string) {
  const stream = fs.createReadStream(path.join(ASSET_DIR, filename))
  const asset = await client.assets.upload('image', stream, { filename })
  return { _type: 'image' as const, asset: { _type: 'reference' as const, _ref: asset._id } }
}

function textBlock(key: string, style: 'normal' | 'h2', text: string) {
  return {
    _type: 'block',
    _key: key,
    style,
    children: [{ _type: 'span', _key: `${key}-span`, text }],
  }
}

function bulletBlock(key: string, text: string) {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    children: [{ _type: 'span', _key: `${key}-span`, text }],
  }
}

function imageBlock(key: string, image: Awaited<ReturnType<typeof uploadImage>>) {
  return { ...image, _key: key }
}

async function run() {
  console.log('Uploading images...')
  const hero = await uploadImage('6a0f145cecdd2bb98da62206_HERO.png')
  const linneaPhoto = await uploadImage('6787bed2fdc549807037c466_Linnea-p-1600.png')
  const bl1 = await uploadImage('6a0f12fc4e8980ff20778dd6_BL1.png')
  const bl2 = await uploadImage('6a0f13215aa6b5fc5466a743_BL2.png')
  const bl3 = await uploadImage('6a0f1340d2aa0d55327343b0_BL3.png')
  const bl4 = await uploadImage('6a0f1429d05e5311078cea07_BL4.png')
  const bl5 = await uploadImage('6a0f144e4e8980ff20791347_BL5.png')

  await client.patch(AUTHOR_ID).set({ photo: linneaPhoto }).commit()
  console.log('Updated Linnéa Jonsson photo.')

  const body = [
    textBlock('b1', 'h2', 'Vad får jag ut av att skapa en integration?'),
    textBlock(
      'b2',
      'normal',
      'Integrationen hämtar både huvudboksdata och fakturaunderlag från Bjorn Lunden till Senseworks. Huvudboksdata hämtas för valt räkenskapsår och läses in i Senseworks på samma sätt som vid import av en SIE4-fil. Samtidigt hämtas dokument och fakturaunderlag som är kopplade till verifikaten i Bjorn Lunden.',
    ),
    textBlock(
      'b3',
      'normal',
      'Detta gör det möjligt att automatiskt inhämta och matcha fakturaunderlag mot bokföringen, vilket förenklar avstämningar och gör det snabbt och enkelt att granska stickprov direkt i Senseworks.',
    ),

    textBlock('b4', 'h2', 'Vad krävs för att skapa en integration?'),
    textBlock('b5', 'normal', 'Bjorn Lunden ställer följande krav:'),
    bulletBlock('b6', 'Företaget har modulen Bokföring i Lundify eller BL Administration'),
    bulletBlock('b7', 'Företaget har en integrationslicens'),
    bulletBlock('b8', 'Du som aktiverar integrationen är administratör på företaget'),

    textBlock('b9', 'h2', 'Hur får jag tillgång till företagsnyckeln från Bjorn Lunden?'),
    textBlock(
      'b10',
      'normal',
      'Välj det företag du vill skapa integration för i Senseworks och gå till Data för att aktivera integrationen. För att skapa kopplingen behöver du en företagsnyckel från Bjorn Lunden. I Senseworks finns ett färdigt exempelmail som kan skickas till behörig kontakt hos kunden med instruktioner för hur integrationen aktiveras. Företagsnyckeln finns tillgänglig i Bjorn Lunden för respektive företag. Som revisor behöver du därför begära företagsnyckeln från den person som är administratör för företaget i Bjorn Lunden.',
    ),
    imageBlock('b11', bl1),

    textBlock('b12', 'h2', 'Så ansluter du som administratör i Bjorn Lunden'),
    textBlock('b13', 'normal', 'För dig som arbetar i Lundify: Logga in på Lundify.com med ditt Bjorn ID eller BankID.'),
    textBlock('b14', 'normal', 'För dig som arbetar i BL Administration: Öppna BL Administration och gå till Arkiv.'),
    textBlock('b15', 'normal', 'Aktivera integrationen:'),
    bulletBlock('b16', 'Klicka på Integrationer i menyn till vänster'),
    bulletBlock('b17', 'Leta upp Senseworks i listan och klicka på Aktivera'),
    bulletBlock('b18', 'Ett fönster visas med information om vad integrationen omfattar'),
    bulletBlock('b19', 'Bekräfta genom att klicka på "Ja, påbörja integrationen"'),
    bulletBlock('b20', 'Klicka därefter på kugghjulet längst upp till höger'),
    bulletBlock('b21', 'Kopiera företagsnyckeln och skicka den till revisorn'),
    imageBlock('b22', bl2),

    textBlock('b23', 'h2', 'Så slutför du som revisor integrationen i Senseworks'),
    textBlock(
      'b24',
      'normal',
      'När du som revisor har fått företagsnyckeln läggs den in i integrationskortet under Data i Senseworks. Först när företagsnyckeln har registrerats blir kopplingen aktiv och data kan börja synkas mellan systemen.',
    ),
    imageBlock('b25', bl3),

    textBlock('b26', 'h2', 'Hämta data när integrationen aktiverats'),
    textBlock(
      'b27',
      'normal',
      'När kopplingen har godkänts aktiveras integrationen och du ser att den är aktiv när knappen blir grön och visar Hantera. När integrationen är aktiv kan data hämtas från Bjorn Lunden direkt i Senseworks och data för de två senaste räkenskapsåren hämtas automatiskt.',
    ),
    imageBlock('b28', bl4),

    textBlock('b29', 'h2', 'Synka fler räkenskapsår och kombinera datakällor'),
    textBlock(
      'b30',
      'normal',
      "I Senseworks går det även att synka data för fler räkenskapsår via sidan 'Inläst data' under Bokföring. Vill du synka fler räkenskapsår går du till 'Hantera räkenskapsår' och lägger till de år du vill arbeta med. För varje räkenskapsår kan du sedan klicka på 'Hämta data' för att läsa in data från Bjorn Lunden.",
    ),
    textBlock(
      'b31',
      'normal',
      "Om data redan har hämtats visas istället knappen 'Synka' för att uppdatera informationen. Vid synkning hämtas alltid dokument och fakturaunderlag från Bjorn Lunden. Om Bjorn Lunden används som källa för huvudbok hämtas även huvudboksdata automatiskt.",
    ),
    textBlock(
      'b32',
      'normal',
      'Om huvudboken istället kommer från en inläst SIE4 fil får du välja om huvudboksdata från Bjorn Lunden ska ersätta den befintliga datan eller inte. Detta gör det möjligt att läsa in en SIE4 fil från exempelvis ett bokslutsprogram när bokslutsbokningar inte har registrerats i Bjorn Lunden och därför saknas i den data som kan synkas från integrationen. På så sätt kan du kombinera bokslutsbokningar från SIE4 filen med dokument och fakturaunderlag från Bjorn Lunden.',
    ),
    imageBlock('b33', bl5),
  ]

  await client.patch(ARTICLE_ID).set({ coverImage: hero, body }).commit()
  console.log('Populated the Bjorn Lunden article with real content and images.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
