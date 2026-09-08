import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { slugify } from "@/lib/slug";

async function upsertTags(names: string[]) {
  const tags = [];
  for (const name of names) {
    const slug = slugify(name);
    if (!slug) continue;
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
    tags.push(tag);
  }
  return tags;
}

export async function GET() {
  const performers = await prisma.performer.findMany({
    include: { tags: true },
    orderBy: { stageName: "asc" },
  });
  return NextResponse.json(performers);
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.stageName || !body?.bio) {
    return NextResponse.json({ error: "stageName and bio are required" }, { status: 400 });
  }
  const slug = slugify(body.slug || body.stageName);
  if (!slug) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });

  const existing = await prisma.performer.findUnique({ where: { slug } });
  if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

  const tags = await upsertTags(Array.isArray(body.tags) ? body.tags : []);

  const performer = await prisma.performer.create({
    data: {
      stageName: String(body.stageName),
      slug,
      realName: body.realName ? String(body.realName) : null,
      bio: String(body.bio),
      nationality: body.nationality ? String(body.nationality) : null,
      birthYear: body.birthYear != null && body.birthYear !== "" ? Number(body.birthYear) : null,
      imageUrl: body.imageUrl || null,
      websiteUrl: body.websiteUrl || null,
      twitterUrl: body.twitterUrl || null,
      instagramUrl: body.instagramUrl || null,
      onlyfansUrl: body.onlyfansUrl || null,
      active: body.active !== false,
      tags: { connect: tags.map((t) => ({ id: t.id })) },
    },
    include: { tags: true },
  });
  return NextResponse.json(performer, { status: 201 });
}
