const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');

// Parse .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf8');
let mongoUri = '';
envFile.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key === 'DATABASE') {
    mongoUri = rest.join('=').trim().replace(/['"]/g, '');
  }
});

if (!mongoUri) {
  console.error('DATABASE environment variable not found in .env.local');
  process.exit(1);
}

const client = new MongoClient(mongoUri);

async function seed() {
  try {
    await client.connect();
    const db = client.db('Quotely'); // Database name specified previously

    console.log('Connected to MongoDB Quotely');

    // Generate specific ObjectIds so we can link them
    const businessId = new ObjectId();
    const adminUserId = new ObjectId();
    const customerId1 = new ObjectId();
    const customerId2 = new ObjectId();
    const catWebId = new ObjectId();
    const catSeoId = new ObjectId();

    // 1. Clear existing specific collections
    await db.collection('users').deleteMany({});
    await db.collection('businesses').deleteMany({});
    await db.collection('customers').deleteMany({});
    await db.collection('categories').deleteMany({});
    await db.collection('products').deleteMany({});
    await db.collection('quotationsettings').deleteMany({});
    console.log('Cleared existing data.');

    // 2. Create Business
    await db.collection('businesses').insertOne({
      _id: businessId,
      name: 'TechVision Solutions',
      email: 'contact@techvision.com',
      phone: '+1 234 567 8900',
      address: '123 Tech Park, Silicon Valley, CA 94025',
      logoUrl: '',
      website: 'www.techvision.example.com',
      taxId: 'US123456789',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // 3. Create Admin User (FIXED ROLE CASING)
    await db.collection('users').insertOne({
      _id: adminUserId,
      name: 'Admin User',
      email: 'business@example.com',
      password: 'password123', // In a real app this would be hashed
      role: 'business',
      businessId: businessId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // 4. Create Default Settings for Business
    await db.collection('quotationsettings').insertOne({
      businessId: businessId,
      primaryColor: '#4f46e5',
      accentColor: '#0ea5e9',
      fontFamily: 'Inter, sans-serif',
      fontSize: 'md',
      quotationTitle: 'QUOTATION',
      headerLayout: 'logo-left',
      logoSize: 'md',
      showLogo: true,
      showBusinessInfo: true,
      showCustomerInfo: true,
      showQuotationNumber: true,
      showDates: true,
      showDiscounts: true,
      showTax: true,
      showSubtotal: true,
      showItemNotes: false,
      showTerms: true,
      showNotes: true,
      showSignature: false,
      showBankDetails: true,
      showFooter: true,
      tableStyle: 'striped',
      footerText: 'Thank you for your business!',
      bankDetails: 'Bank: State Bank\nAccount: 123456789\nIFSC: SBIN0001234',
      defaultTerms: '1. Valid for 30 days.\n2. 50% advance payment required.',
      quotationPrefix: 'QT',
      dateFormat: 'DD MMM YYYY',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // 5. Create Customers
    await db.collection('customers').insertMany([
      {
        _id: customerId1,
        businessId: businessId,
        name: 'Rohan Mehta',
        companyName: 'Acme Corp',
        email: 'rohan@acmecorp.example.com',
        phone: '+91 9876543210',
        billingAddress: '45, Acme Heights, Mumbai',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: customerId2,
        businessId: businessId,
        name: 'Jane Doe',
        companyName: 'Global Tech',
        email: 'jane@globaltech.example.com',
        phone: '+1 555 123 4567',
        billingAddress: '789 Business Rd, NY',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // 6. Create Categories
    await db.collection('categories').insertMany([
      { _id: catWebId, businessId: businessId, name: 'Web Development', description: 'Website building services', status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date() },
      { _id: catSeoId, businessId: businessId, name: 'Marketing', description: 'SEO and Digital Marketing', status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date() }
    ]);

    // 7. Create Products
    await db.collection('products').insertMany([
      {
        businessId: businessId,
        categoryId: catWebId,
        name: 'E-commerce Website',
        description: 'Full stack e-commerce platform',
        type: 'SERVICE',
        unitPrice: 50000,
        unit: 'PROJECT',
        taxPercent: 18,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        businessId: businessId,
        categoryId: catWebId,
        name: 'Landing Page',
        description: 'Single page promotional site',
        type: 'SERVICE',
        unitPrice: 15000,
        unit: 'PROJECT',
        taxPercent: 18,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        businessId: businessId,
        categoryId: catSeoId,
        name: 'Monthly SEO Retainer',
        description: 'On-page and off-page optimization',
        type: 'SERVICE',
        unitPrice: 20000,
        unit: 'MONTH',
        taxPercent: 18,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('✅ Dummy data successfully inserted into MongoDB! (Roles fixed)');

  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await client.close();
  }
}

seed();
