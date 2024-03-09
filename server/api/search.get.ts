import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const searchKeyword = getQuery(event).keyword as string
  const prisma = new PrismaClient()

  const glyphs = await prisma.glyph.findMany({
    where: {
      OR: [
        {
          simplified: searchKeyword,
        },
        {
          traditional: searchKeyword,
        },
      ],
    },
  })

  return glyphs.map(g => g.classId)
})
