import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: 'admin@techmorpho.com' }
  })

  if (existingAdmin) {
    console.log('✅ Admin user already exists')
    return
  }

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@techmorpho.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      active: true
    }
  })

  console.log('✅ Created admin user:')
  console.log('   Email: admin@techmorpho.com')
  console.log('   Password: admin123')
  console.log('   ID:', admin.id)
  console.log('⚠️  Please change the password after first login!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

