import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Verified 2026-09-08 — see VERIFICATION.md for sources and confidence. */
const performers = [
  {
    slug: "angela-white",
    stageName: "Angela White",
    realName: null,
    bio: "Australian adult performer, director, and industry advocate. Multiple-time Performer of the Year award winner known for her work both in front of and behind the camera.",
    nationality: "Australian",
    birthYear: 1985,
    imageUrl: "/performers/angela-white.jpg",
    websiteUrl: "https://angelawhite.com",
    twitterUrl: "https://twitter.com/AngelaWhite",
    instagramUrl: "https://www.instagram.com/theangelawhite",
    onlyfansUrl: "https://onlyfans.com/angelawhite",
    tags: ["Feature", "Director", "Australian"],
  },
  {
    slug: "asa-akira",
    stageName: "Asa Akira",
    realName: null,
    bio: "American adult performer, author, and podcast host. Known for her long career, mainstream crossover appearances, and candid writing about the industry.",
    nationality: "American",
    birthYear: 1985,
    imageUrl: "/performers/asa-akira.jpg",
    websiteUrl: "https://asaakira.com",
    twitterUrl: "https://twitter.com/AsaAkira",
    instagramUrl: "https://www.instagram.com/asahole",
    onlyfansUrl: "https://onlyfans.com/asaakira",
    tags: ["Feature", "Author", "Podcast"],
  },
  {
    slug: "riley-reid",
    stageName: "Riley Reid",
    realName: null,
    bio: "American adult performer recognized for a prolific career and major industry awards. Active on social platforms and subscription content.",
    nationality: "American",
    birthYear: 1991,
    imageUrl: "/performers/riley-reid.jpg",
    websiteUrl: "https://reidmylips.com",
    twitterUrl: "https://twitter.com/RileyReidx3",
    instagramUrl: "https://www.instagram.com/letrileylive",
    onlyfansUrl: "https://onlyfans.com/rileyreidx3",
    tags: ["Feature", "American"],
  },
  {
    slug: "mia-khalifa",
    stageName: "Mia Khalifa",
    realName: null,
    bio: "Lebanese-American media personality and former adult performer. Known for her brief adult career and subsequent work as a sports commentator and social media figure.",
    nationality: "Lebanese-American",
    birthYear: 1993,
    imageUrl: "/performers/mia-khalifa.jpg",
    websiteUrl: "",
    twitterUrl: "https://twitter.com/miakhalifa",
    instagramUrl: "https://www.instagram.com/miakhalifa",
    onlyfansUrl: "https://onlyfans.com/miakhalifa",
    tags: ["Personality", "Mainstream"],
  },
  {
    slug: "lena-paul",
    stageName: "Lena Paul",
    realName: null,
    bio: "American adult performer known for her independent brand and strong social presence. Frequently collaborates with other creators.",
    nationality: "American",
    birthYear: 1993,
    imageUrl: "/performers/lena-paul.jpg",
    websiteUrl: "",
    twitterUrl: "https://twitter.com/Lenaisapeach",
    instagramUrl: "https://www.instagram.com/lenapaulxo",
    onlyfansUrl: "https://onlyfans.com/lenaisapeach",
    tags: ["Independent", "American"],
  },
  {
    slug: "brandi-love",
    stageName: "Brandi Love",
    realName: null,
    bio: "American adult performer and entrepreneur. Known for her MILF branding and long-running presence in the industry.",
    nationality: "American",
    birthYear: 1973,
    imageUrl: "/performers/brandi-love.jpg",
    websiteUrl: "https://www.brandilove.com",
    twitterUrl: "https://twitter.com/Brandi_Love",
    instagramUrl: "https://www.instagram.com/brandi_love",
    onlyfansUrl: "https://onlyfans.com/brandi_love",
    tags: ["MILF", "Entrepreneur"],
  },
  {
    slug: "abella-danger",
    stageName: "Abella Danger",
    realName: null,
    bio: "American adult performer known for high-profile studio work and major industry awards early in her career.",
    nationality: "American",
    birthYear: 1995,
    imageUrl: "/performers/abella-danger.jpg",
    websiteUrl: "",
    twitterUrl: "https://twitter.com/Abella_Danger",
    instagramUrl: "https://www.instagram.com/dangershewrote",
    onlyfansUrl: "https://onlyfans.com/abelladanger",
    tags: ["Feature", "American"],
  },
  {
    slug: "stoya",
    stageName: "Stoya",
    realName: null,
    bio: "American adult performer, writer, and advocate. Known for her work with Evil Angel early in her career and later writing and commentary.",
    nationality: "American",
    birthYear: 1986,
    imageUrl: "/performers/stoya.jpg",
    websiteUrl: "https://hellostoya.com",
    twitterUrl: "https://twitter.com/stoya",
    instagramUrl: "https://www.instagram.com/stoya",
    onlyfansUrl: "",
    tags: ["Feature", "Writer"],
  },
];

async function main() {
  for (const p of performers) {
    const tagConnect = [];
    for (const tagName of p.tags) {
      const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { name: tagName, slug: tagSlug },
      });
      tagConnect.push({ id: tag.id });
    }

    const { tags: _tags, ...data } = p;
    await prisma.performer.upsert({
      where: { slug: p.slug },
      update: {
        stageName: data.stageName,
        realName: data.realName,
        bio: data.bio,
        nationality: data.nationality,
        birthYear: data.birthYear,
        imageUrl: data.imageUrl || null,
        websiteUrl: data.websiteUrl || null,
        twitterUrl: data.twitterUrl || null,
        instagramUrl: data.instagramUrl || null,
        onlyfansUrl: data.onlyfansUrl || null,
        tags: { set: tagConnect },
      },
      create: {
        ...data,
        imageUrl: data.imageUrl || null,
        websiteUrl: data.websiteUrl || null,
        twitterUrl: data.twitterUrl || null,
        instagramUrl: data.instagramUrl || null,
        onlyfansUrl: data.onlyfansUrl || null,
        tags: { connect: tagConnect },
      },
    });
  }
  console.log(`Seeded ${performers.length} performers`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
