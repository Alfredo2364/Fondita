import 'app_localizations.dart';

/// English Translations
class AppLocalizationsEn extends AppLocalizations {
  // ===== GENERAL TEXTS =====
  @override
  String get appName => 'Fondita App';
  @override
  String get settings => 'Settings';
  @override
  String get language => 'Language';
  @override
  String get theme => 'Theme';
  @override
  String get lightTheme => 'Light';
  @override
  String get darkTheme => 'Dark';
  @override
  String get logout => 'Logout';
  @override
  String get cancel => 'Cancel';
  @override
  String get accept => 'Accept';
  @override
  String get save => 'Save';
  @override
  String get delete => 'Delete';
  @override
  String get edit => 'Edit';
  @override
  String get search => 'Search';
  @override
  String get loading => 'Loading...';
  @override
  String get error => 'Error';
  @override
  String get success => 'Success';

  // ===== ROLES =====
  @override
  String get manager => 'Manager';
  @override
  String get waiter => 'Waiter';
  @override
  String get kitchen => 'Kitchen';
  @override
  String get customer => 'Customer';

  // ===== MAIN SCREENS =====
  @override
  String get managerPanel => 'Manager Panel';
  @override
  String get waiterMode => 'Waiter Mode';
  @override
  String get tables => 'Tables';
  @override
  String get attendance => 'Attendance';
  @override
  String get kitchenDisplay => 'Kitchen';
  @override
  String get scanQR => 'Scan QR';

  // ===== TABLES =====
  @override
  String get table => 'Table';
  @override
  String get available => 'Available';
  @override
  String get occupied => 'Occupied';
  @override
  String get reserved => 'Reserved';
  @override
  String get capacity => 'Capacity';
  @override
  String get tableNumber => 'Table';
  @override
  String get changeStatus => 'Change Status';
  @override
  String get viewDetails => 'View Details';

  // ===== ATTENDANCE =====
  @override
  String get checkIn => 'Check In';
  @override
  String get checkOut => 'Check Out';
  @override
  String get checkedIn => 'Active Shift';
  @override
  String get notCheckedIn => 'No Active Shift';
  @override
  String get attendanceHistory => 'Today\'s History';
  @override
  String get today => 'Today';
  @override
  String get employee => 'Employee';

  // ===== KITCHEN =====
  @override
  String get pending => 'Pending';
  @override
  String get cooking => 'Cooking';
  @override
  String get ready => 'Ready';
  @override
  String get orderNumber => 'Order';
  @override
  String get items => 'Items';
  @override
  String get startCooking => 'Start';
  @override
  String get markReady => 'Mark Ready';
  @override
  String get deliver => 'Deliver';

  // ===== QR SCANNER =====
  @override
  String get scanTableQR => 'Scan Table QR';
  @override
  String get scanningInstructions => 'Point the camera at the table QR code';
  @override
  String get tableScanned => 'Table scanned';
  @override
  String get invalidQR => 'Invalid QR code';

  // ===== STATISTICS =====
  @override
  String get salesToday => 'Sales Today';
  @override
  String get activeOrders => 'Active Orders';
  @override
  String get totalDishes => 'Total Dishes';
  @override
  String get quickActions => 'Quick Actions';

  // ===== MENU =====
  @override
  String get manageInventory => 'Manage Inventory';
  @override
  String get manageStaff => 'Manage Staff';
  @override
  String get manageTables => 'Manage Tables';
  @override
  String get kitchenView => 'Kitchen View';

  // ===== MESSAGES =====
  @override
  String get noTablesRegistered => 'No tables registered.';
  @override
  String get noOrdersFound => 'No orders found.';
  @override
  String get checkInSuccess => 'Check-in successful';
  @override
  String get checkOutSuccess => 'Check-out successful';
  @override
  String get errorOccurred => 'An error occurred';
}
