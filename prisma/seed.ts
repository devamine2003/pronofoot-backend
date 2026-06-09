import { PrismaClient, MatchStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Sample users — avec pseudo obligatoire
  const user1 = await prisma.user.upsert({
    where: { pseudo: 'Anas94' },
    update: {},
    create: {
      uuid: '00000000-0000-0000-0000-000000000001',
      pseudo: 'Anas94',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { pseudo: 'SarahFoot' },
    update: {},
    create: {
      uuid: '00000000-0000-0000-0000-000000000002',
      pseudo: 'SarahFoot',
    },
  });

  // Matchs
  const match1 = await prisma.match.upsert({
    where: { apiMatchId: 'seed-001' },
    update: {},
    create: {
      apiMatchId: 'seed-001',
      homeTeam: 'France',
      awayTeam: 'Maroc',
      homeFlag: 'https://crests.football-data.org/773.svg',
      awayFlag: 'https://crests.football-data.org/1009.svg',
      kickoff: new Date('2026-06-15T18:00:00Z'),
      status: MatchStatus.SCHEDULED,
      stage: 'GROUP_STAGE',
      venue: 'SoFi Stadium, Los Angeles',
      homeOdds: 1.75,
      drawOdds: 3.5,
      awayOdds: 4.8,
    },
  });

  const match2 = await prisma.match.upsert({
    where: { apiMatchId: 'seed-002' },
    update: {},
    create: {
      apiMatchId: 'seed-002',
      homeTeam: 'Brésil',
      awayTeam: 'Espagne',
      homeFlag: 'https://crests.football-data.org/764.svg',
      awayFlag: 'https://crests.football-data.org/760.svg',
      kickoff: new Date('2026-06-16T16:00:00Z'),
      status: MatchStatus.SCHEDULED,
      stage: 'GROUP_STAGE',
      venue: 'MetLife Stadium, New York',
      homeOdds: 2.1,
      drawOdds: 3.3,
      awayOdds: 3.2,
    },
  });

  const match3 = await prisma.match.upsert({
    where: { apiMatchId: 'seed-003' },
    update: {},
    create: {
      apiMatchId: 'seed-003',
      homeTeam: 'Allemagne',
      awayTeam: 'Argentine',
      homeFlag: 'https://crests.football-data.org/759.svg',
      awayFlag: 'https://crests.football-data.org/762.svg',
      kickoff: new Date('2026-06-14T19:00:00Z'),
      status: MatchStatus.FINISHED,
      homeScore: 1,
      awayScore: 3,
      stage: 'GROUP_STAGE',
      venue: 'AT&T Stadium, Dallas',
      homeOdds: 2.5,
      drawOdds: 3.2,
      awayOdds: 2.7,
    },
  });

  // Pronostics sur le match terminé
  await prisma.prediction.upsert({
    where: { userId_matchId: { userId: user1.id, matchId: match3.id } },
    update: {},
    create: {
      userId: user1.id,
      matchId: match3.id,
      predictedHomeScore: 1,
      predictedAwayScore: 3,
      pointsEarned: 5,
      bonusPoints: 0,
      isCalculated: true,
    },
  });

  await prisma.prediction.upsert({
    where: { userId_matchId: { userId: user2.id, matchId: match3.id } },
    update: {},
    create: {
      userId: user2.id,
      matchId: match3.id,
      predictedHomeScore: 0,
      predictedAwayScore: 2,
      pointsEarned: 3,
      bonusPoints: 0,
      isCalculated: true,
    },
  });

  console.log('Seed complete!');
  console.log('Users:', user1.pseudo, user2.pseudo);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());