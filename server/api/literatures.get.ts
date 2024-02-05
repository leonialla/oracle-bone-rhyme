import { PrismaClient } from '~/prisma/client'

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const classId = getQuery(event).classId as string

  if (!classId)
    return

  const glyphPageAssociations: GlyphPageAssociation[] = []

  const associations = await prisma.glyphPageAssociation.findMany({
    where: {
      classId,
    },
    select: {
      literatureId: true,
      page: true,
    },
  })

  const associatedPages = associations.reduce((acc, cur) => {
    const { literatureId, page } = cur
    if (!acc[literatureId])
      acc[literatureId] = []
    acc[literatureId].push(page)
    return acc
  }, {} as Record<number, number[]>)

  for (const literatureId in associatedPages) {
    const literature = await prisma.literature.findUnique({
      where: {
        id: Number(literatureId),
      },
      select: {
        title: true,
        author: true,
        isbn: true,
        organization: true,
        publishingHouse: true,
        description: true,
        totalPages: true,
      },
    }) as Literature

    glyphPageAssociations.push({
      literature,
      pages: associatedPages[literatureId],
    })
  }

  return glyphPageAssociations
})
