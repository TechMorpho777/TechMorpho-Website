import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query: string): Promise<string> => {
  return new Promise(resolve => rl.question(query, resolve))
}

async function createAdmin() {
  try {
    console.log('🔐 Create Admin User\n')

    const email = await question('Email: ')
    const name = await question('Name: ')
    const password = await question('Password: ')

    if (!email || !name || !password) {
      console.error('❌ All fields are required')
      process.exit(1)
    }

    if (password.length < 6) {
      console.error('❌ Password must be at least 6 characters')
      process.exit(1)
    }

    // Check if admin exists
    const existing = await prisma.admin.findUnique({
      where: { email }
    })

    if (existing) {
      console.error('❌ Admin with this email already exists')
      process.exit(1)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = await prisma.admin.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'admin'
      }
    })

    console.log('\n✅ Admin created successfully!')
    console.log(`   Email: ${admin.email}`)
    console.log(`   Name: ${admin.name}`)
    console.log(`   ID: ${admin.id}\n`)

  } catch (error) {
    console.error('❌ Error creating admin:', error)
    process.exit(1)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

createAdmin()

