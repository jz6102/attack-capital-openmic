require('dotenv').config();
const mongoose = require('mongoose');
const Patient = require('../models/Patient'); // We'll keep the filename for simplicity

async function run() {
  const uri = process.env.MONGO_URI;
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to mongo for seeding');

  const employees = [
    {
      employeeId: '1234',
      name: 'Saanvi',
      department: 'Engineering',
      location: 'Building A, 4th Floor'
    },
    {
      employeeId: '5678',
      name: 'Liam',
      department: 'Marketing',
      location: 'Building C, 2nd Floor'
    }
  ];

  for (const emp of employees) {
    await Patient.findOneAndUpdate({ employeeId: emp.employeeId }, emp, { upsert: true });
    console.log('Seeded employee:', emp.name);
  }

  console.log('Done seeding');
  process.exit(0);
}

run().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});