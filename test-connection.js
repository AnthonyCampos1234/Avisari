const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    try {
        const result = await prisma.$queryRaw`SELECT 1+1 AS result`
        console.log('Database connection successful', result)

        const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
        console.log('Tables in the database:', tables)
    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())