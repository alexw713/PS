import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { slugify } from "@/lib/slug";

type Ctx = { params: { id: string } };

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

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.stageName || !body?.bio) {
    return NextResponse.json({ error: "stageName and bio are required" }, { status: 400 });
  }
  const slug = slugify(body.slug || body.stageName);
  if (!slug) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });

  const clash = await prisma.performer.findFirst({
    where: { slug, NOT: { id: params.id } },
  });
  if (clash) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

  const tags = await upsertTags(Array.isArray(body.tags) ? body.tags : []);

  try {
    const performer = await prisma.performer.update({
      where: { id: params.id },
      data: {
        stageName: String(body.stageName),
        slug,
        realName: body.realName ? String(body.realName) : null,
        bio: String(body.bio),
        nationality: body.nationality ? String(body.nationality) : null,
        birthYear: body.birthYear != null && body.birthYear !== "" ? Number(body.birthYear) : null,
        websiteUrl: body.websiteUrl || null,
        twitterUrl: body.twitterUrl || null,
        instagramUrl: body.instagramUrl || null,
        onlyfansUrl: body.onlyfansUrl || null,
        active: body.active !== false,
        tags: { set: tags.map((t) => ({ id: t.id })) },
      },
      include: { tags: true },
    });
    return NextResponse.json(performer);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await prisma.performer.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
