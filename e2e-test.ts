import axios from 'axios';

const API_URL = 'http://localhost:3000';

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  console.log('--- Starting E2E Tests ---');

  try {
    const timestamp = Date.now();
    
    // 1. Register Organizer
    console.log('\n1. Registering Organizer...');
    const organizerRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test Organizer',
      email: `organizer_${timestamp}@test.com`,
      password: 'password123',
      role: 'ORGANIZER'
    });
    console.log('Organizer Registered:', organizerRes.data.success);
    
    const orgLogin = await axios.post(`${API_URL}/auth/login`, {
      email: `organizer_${timestamp}@test.com`,
      password: 'password123'
    });
    const orgToken = orgLogin.data.data.token;

    // 2. Register Customer
    console.log('\n2. Registering Customer...');
    const customerRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test Customer',
      email: `customer_${timestamp}@test.com`,
      password: 'password123',
      role: 'CUSTOMER'
    });
    console.log('Customer Registered:', customerRes.data.success);

    const custLogin = await axios.post(`${API_URL}/auth/login`, {
      email: `customer_${timestamp}@test.com`,
      password: 'password123'
    });
    const custToken = custLogin.data.data.token;

    // 3. Organizer creates an Event
    console.log('\n3. Organizer Creating Event...');
    const createEventRes = await axios.post(`${API_URL}/events`, {
      title: 'Summer Music Festival',
      description: 'The best music festival of the summer.',
      venue: 'Central Park',
      eventDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      totalTickets: 100
    }, { headers: { Authorization: `Bearer ${orgToken}` } });
    
    const eventId = createEventRes.data.data.id;
    console.log('Event Created! ID:', eventId);

    // 4. Customer Browses Events
    console.log('\n4. Customer Browsing Events...');
    const eventsList = await axios.get(`${API_URL}/events`);
    console.log(`Found ${eventsList.data.data.length} events available.`);

    // 5. Customer Books Ticket
    console.log('\n5. Customer Booking Ticket...');
    const bookingRes = await axios.post(`${API_URL}/bookings`, {
      eventId: eventId,
      ticketCount: 2
    }, { headers: { Authorization: `Bearer ${custToken}` } });
    console.log('Ticket Booked successfully! ID:', bookingRes.data.data.id);
    
    // Allow background worker time to process email
    console.log('Waiting 2 seconds for BullMQ Email Job...');
    await delay(2000);

    // 6. Organizer Updates Event
    console.log('\n6. Organizer Updating Event...');
    const updateRes = await axios.put(`${API_URL}/events/${eventId}`, {
      venue: 'Madison Square Garden'
    }, { headers: { Authorization: `Bearer ${orgToken}` } });
    console.log('Event Updated successfully!');

    // Allow background worker time to process notification
    console.log('Waiting 2 seconds for BullMQ Notification Job...');
    await delay(2000);

    // 7. Customer Views Bookings
    console.log('\n7. Customer Viewing Bookings...');
    const myBookings = await axios.get(`${API_URL}/bookings/my-bookings`, {
      headers: { Authorization: `Bearer ${custToken}` }
    });
    console.log(`Customer has ${myBookings.data.data.length} bookings.`);

    console.log('\n--- E2E Tests Completed Successfully ---');

  } catch (error: any) {
    console.error('E2E Test Failed:');
    console.error(error);
    process.exit(1);
  }
}

runTests();
