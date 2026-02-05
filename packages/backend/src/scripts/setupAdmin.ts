import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function setupAdmin() {
  try {
    console.log('🔐 Setting up Admin User...\n')

    const email = 'swapnilbibrale99@gmail.com'
    const name = 'Swapnil Bibrale'
    const password = 'TheAloneWolf@#2190'

    // Check if admin already exists
    const existing = await prisma.admin.findUnique({
      where: { email }
    })

    if (existing) {
      console.log('⚠️  Admin user already exists!')
      console.log(`   Email: ${existing.email}`)
      console.log(`   Name: ${existing.name}`)
      console.log('\n💡 To update password, delete the user first or use a different email.\n')
      await prisma.$disconnect()
      process.exit(0)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'admin'
      }
    })

    console.log('✅ Admin user created successfully!\n')
    console.log('📋 Login Credentials:')
    console.log(`   Email: ${admin.email}`)
    console.log(`   Name: ${admin.name}`)
    console.log(`   Password: ${password}`)
    console.log(`   ID: ${admin.id}\n`)
    console.log('🚀 You can now login at: http://localhost:5173/admin/login\n')

  } catch (error: any) {
    console.error('❌ Error creating admin:', error.message)
    if (error.code === 'P2002') {
      console.error('   Admin with this email already exists!')
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setupAdmin()

