import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@teleworker.fun";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin123!ChangeMe";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: {
      email: adminEmail,
      name: "Admin",
      role: "ADMIN",
      passwordHash: await hashPassword(adminPassword),
      emailVerified: new Date(),
    },
  });

  const products = [
    {
      slug: "agent-starter",
      name: "Starter Agent",
      description: "Один AI-аккаунт для личных диалогов и базового RAG.",
      features: ["Личные сообщения", "RAG до 50 блоков", "Gigachat", "500 сообщ/мес"],
      priceRub: 499000,
      priceUsd: 4900,
      sortOrder: 1,
    },
    {
      slug: "agent-pro",
      name: "Pro Agent",
      description: "Агент для лички, групп и каналов с расширенными сценариями.",
      features: ["Группы и реакции", "Gigachat / Grok", "2000 сообщ/мес", "Приоритетная выдача"],
      priceRub: 1499000,
      priceUsd: 14900,
      sortOrder: 2,
    },
    {
      slug: "agent-business",
      name: "Business Agent",
      description: "Продвинутый агент с Claude и кастомными промптами.",
      features: ["Claude", "Неограниченный RAG", "Вебхуки", "Аналитика"],
      priceRub: 3999000,
      priceUsd: 39900,
      sortOrder: 3,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  const plans = [
    {
      slug: "starter",
      name: "Starter",
      description: "1 агент",
      monthlyPriceRub: 499000,
      monthlyPriceUsd: 4900,
      maxAgents: 1,
      features: ["1 агент", "Email поддержка"],
      sortOrder: 1,
    },
    {
      slug: "pro",
      name: "Pro",
      description: "3 агента",
      monthlyPriceRub: 1499000,
      monthlyPriceUsd: 14900,
      maxAgents: 3,
      features: ["3 агента", "Группы", "Grok"],
      sortOrder: 2,
    },
    {
      slug: "business",
      name: "Business",
      description: "10 агентов",
      monthlyPriceRub: 3999000,
      monthlyPriceUsd: 39900,
      maxAgents: 10,
      features: ["10 агентов", "Claude", "API"],
      sortOrder: 3,
    },
    {
      slug: "enterprise",
      name: "Enterprise",
      description: "Кастом",
      monthlyPriceRub: 0,
      monthlyPriceUsd: 0,
      maxAgents: 999,
      features: ["SLA", "On-prem", "Выделенная поддержка"],
      sortOrder: 4,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
  }

  console.log("Seed OK. Admin:", adminEmail);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
