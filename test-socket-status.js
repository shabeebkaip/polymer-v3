// Test script to verify socket service user status methods
const { socketService } = require('./lib/socketService.ts');

// Mock user ID for testing
const testUserId = 'test-user-123';
const supplierUserId = 'supplier-456';

console.log('🧪 Testing Socket Service User Status Methods');

// Test 1: Check initial online status (should be false when not connected)
console.log('\n1. Testing checkUserOnline (not connected):');
const initialStatus = socketService.checkUserOnline(supplierUserId);
console.log(`Initial status: ${initialStatus}`);

// Test 2: Subscribe to user status
console.log('\n2. Testing subscribeToUserStatus:');
const currentStatus = socketService.subscribeToUserStatus(supplierUserId, (isOnline) => {
  console.log(`📡 Status callback triggered: ${isOnline}`);
});
console.log(`Current cached status: ${currentStatus}`);

// Test 3: Test unsubscribe
console.log('\n3. Testing unsubscribeFromUserStatus:');
socketService.unsubscribeFromUserStatus(supplierUserId);
console.log('Unsubscribed from status updates');

console.log('\n✅ Socket service methods test completed');
