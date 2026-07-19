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
    const db = client.db('quotelydb');

    console.log('Connected to MongoDB quotelydb');

    const businessId = new ObjectId();
    const adminUserId = new ObjectId();
    const customerId1 = new ObjectId();
    const customerId2 = new ObjectId();
    const catWebId = new ObjectId();
    const catSeoId = new ObjectId();

    await db.collection('users').deleteMany({});
    await db.collection('businesses').deleteMany({});
    await db.collection('customers').deleteMany({});
    await db.collection('categories').deleteMany({});
    await db.collection('products').deleteMany({});
    await db.collection('quotationsettings').deleteMany({});
    console.log('Cleared existing data.');

    await db.collection('businesses').insertOne({
      _id: businessId,
      profile: {
        businessName: 'TechVision Solutions',
        legalBusinessName: 'TechVision Solutions Pvt Ltd',
        businessType: 'Private Limited',
        industry: 'Technology',
        businessCategory: 'IT Services',
        registrationNumber: 'REG/2020/TECH001',
        gstVatNumber: '29AAAAA0000A1Z5',
        panTaxNumber: 'ABCDE1234F',
        yearEstablished: '2020',
        description: 'Full-stack technology solutions provider specializing in web development, mobile apps, and cloud infrastructure.',
      },
      contact: {
        email: 'contact@techvision.com',
        phone: '+91 98765 43210',
        mobile: '+91 98765 43211',
        whatsapp: '+91 98765 43210',
        website: 'www.techvision.example.com',
      },
      address: {
        addressLine1: '123 Tech Park, Sector 5',
        addressLine2: 'Building A, 3rd Floor',
        city: 'Mumbai',
        district: 'Mumbai Suburban',
        state: 'Maharashtra',
        country: 'India',
        postalCode: '400051',
      },
      owner: {
        ownerName: 'Admin User',
        designation: 'CEO & Founder',
        email: 'business@example.com',
        phone: '+91 98765 43210',
      },
      branding: {
        logo: null,
        seal: null,
        primaryColor: '#4f46e5',
        secondaryColor: '#0ea5e9',
        accentColor: '#10b981',
        defaultFont: 'Inter, sans-serif',
        tagline: 'Innovation Meets Excellence',
      },
      signatures: [],
      quotationSettings: {
        quotationPrefix: 'QT',
        currency: 'INR',
        taxPercent: 18,
        validityDays: 30,
        paymentTerms: '50% advance, balance on delivery',
        defaultTerms: '1. Valid for 30 days.\n2. 50% advance payment required.\n3. Prices are inclusive of applicable taxes.',
        bankDetails: 'Bank: State Bank of India\nAccount: 123456789\nIFSC: SBIN0001234',
        footerText: 'Thank you for your business!',
        quotationTitle: 'QUOTATION',
        dateFormat: 'DD MMM YYYY',
        headerLayout: 'logo-left',
        tableStyle: 'striped',
        fontSize: 'md',
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
      },
      preferences: {
        language: 'en',
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD MMM YYYY',
        numberFormat: 'en-IN',
        emailNotifications: true,
        autoSave: true,
      },
      socialLinks: {
        facebook: '',
        instagram: '',
        linkedin: '',
        twitter: '',
        youtube: '',
      },
      status: 'Active',
      categories: [catWebId, catSeoId],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.collection('users').insertOne({
      _id: adminUserId,
      name: 'Admin User',
      email: 'business@example.com',
      password: 'password123',
      role: 'business',
      businessId: businessId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

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

    await db.collection('categories').insertMany([
      { _id: catWebId, businessId: businessId, name: 'Web Development', description: 'Website building services', status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date() },
      { _id: catSeoId, businessId: businessId, name: 'Marketing', description: 'SEO and Digital Marketing', status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date() }
    ]);

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

    console.log('Dummy data successfully inserted into MongoDB with new nested schema!');

  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await client.close();
  }
}

seed();
