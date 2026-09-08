import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const performers = [
  {
    slug: "angela-white",
    stageName: "Angela White",
    realName: null,
    bio: "Australian adult performer, director, and industry advocate. Multiple-time Performer of the Year award winner known for her work both in front of and behind the camera.",
    nationality: "Australian",
    birthYear: 1985,
    websiteUrl: "https://angelawhite.com",
    twitterUrl: "https://twitter.com/AngelaWhite",
    instagramUrl: "",
    onlyfansUrl: "",
    tags: ["Feature", "Director", "Australian"],
  },
  {
    slug: "asa-akira",
    stageName: "Asa Akira",
    realName: null,
    bio: "American adult performer, author, and podcast host. Known for her long career, mainstream crossover appearances, and candid writing about the industry.",
    nationality: "American",
    birthYear: 1985,
    websiteUrl: "",
    twitterUrl: "https://twitter.com/AsaAkira",
    instagramUrl: "",
    onlyfansUrl: "",
    tags: ["Feature", "Author", "Podcast"],
  },
  {
    slug: "riley-reid",
    stageName: "Riley Reid",
    realName: null,
    bio: "American adult performer recognized for a prolific career and major industry awards. Active on social platforms and subscription content.",
    nationality: "American",
    birthYear: 1991,
    websiteUrl: "",
    twitterUrl: "https://twitter.com/RileyReidx3",
    instagramUrl: "",
    onlyfansUrl: "",
    tags: ["Feature", "American"],
  },
  {
    slug: "mia-khalifa",
    stageName: "Mia Khalifa",
    realName: null,
    bio: "Lebanese-American media personality and former adult performer. Known for her brief adult career and subsequent work as a sports commentator and social media figure.",
    nationality: "Lebanese-American",
    birthYear: 1993,
    websiteUrl: "",
    twitterUrl: "https://twitter.com/miakhalifa",
    instagramUrl: "https://www.instagram.com/miakhalifa",
    onlyfansUrl: "",
    tags: ["Personality", "Mainstream"],
  },
  {
    slug: "lena-paul",
    stageName: "Lena Paul",
    realName: null,
    bio: "American adult performer known for her independent brand and strong social presence. Frequently collaborates with other creators.",
    nationality: "American",
    birthYear: 1993,
    websiteUrl: "",
    twitterUrl: "https://twitter.com/Lenaisapeach",
    instagramUrl: "",
    onlyfansUrl: "",
    tags: ["Independent", "American"],
  },
  {
    slug: "brandi-love",
    stageName: "Brandi Love",
    realName: null,
    bio: "American adult performer and entrepreneur. Known for her MILF branding and long-running presence in the industry.",
    nationality: "American",
    birthYear: 1973,
    websiteUrl: "",
    twitterUrl: "https://twitter.com/BrandiLove",
    instagramUrl: "",
    onlyfansUrl: "",
    tags: ["MILF", "Entrepreneur"],
  },
  {
    slug: "abella-danger",
    stageName: "Abella Danger",
    realName: null,
    bio: "American adult performer known for high-profile studio work and major industry awards early in her career.",
    nationality: "American",
    birthYear: 1995,
    websiteUrl: "",
    twitterUrl: "https://twitter.com/Abella_Danger",
    instagramUrl: "",
    onlyfansUrl: "",
    tags: ["Feature", "American"],
  },
  {
    slug: "stoya",
    stageName: "Stoya",
    realName: null,
    bio: "American adult performer, writer, and advocate. Known for her work with Evil Angel early in her career and later writing and commentary.",
    nationality: "American",
    birthYear: 1986,
    websiteUrl: "",
    twitterUrl: "https://twitter.com/stoya",
    instagramUrl: "",
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
        websiteUrl: data.websiteUrl || null,
        twitterUrl: data.twitterUrl || null,
        instagramUrl: data.instagramUrl || null,
        onlyfansUrl: data.onlyfansUrl || null,
        tags: { set: tagConnect },
      },
      create: {
        ...data,
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
