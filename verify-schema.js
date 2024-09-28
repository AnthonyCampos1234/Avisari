const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    try {
        // Try to query the User table
        const users = await prisma.user.findMany({ take: 1 })
        console.log('Successfully queried User table:', users)

        // Get the current schema
        const schema = await prisma.$queryRaw`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
    `
        console.log('Current database schema:', schema)
    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
    .catch(console.error)