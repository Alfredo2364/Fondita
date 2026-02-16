import 'app_localizations.dart';

/// Traducciones en Español
class AppLocalizationsEs extends AppLocalizations {
  // ===== TEXTOS GENERALES =====
  @override
  String get appName => 'Fondita App';
  @override
  String get settings => 'Configuración';
  @override
  String get language => 'Idioma';
  @override
  String get theme => 'Tema';
  @override
  String get lightTheme => 'Claro';
  @override
  String get darkTheme => 'Oscuro';
  @override
  String get logout => 'Cerrar Sesión';
  @override
  String get cancel => 'Cancelar';
  @override
  String get accept => 'Aceptar';
  @override
  String get save => 'Guardar';
  @override
  String get delete => 'Eliminar';
  @override
  String get edit => 'Editar';
  @override
  String get search => 'Buscar';
  @override
  String get loading => 'Cargando...';
  @override
  String get error => 'Error';
  @override
  String get success => 'Éxito';

  // ===== ROLES =====
  @override
  String get manager => 'Jefe';
  @override
  String get waiter => 'Mesero';
  @override
  String get kitchen => 'Cocina';
  @override
  String get customer => 'Cliente';

  // ===== PANTALLAS PRINCIPALES =====
  @override
  String get managerPanel => 'Panel de Jefe';
  @override
  String get waiterMode => 'Modo Mesero';
  @override
  String get tables => 'Mesas';
  @override
  String get attendance => 'Asistencia';
  @override
  String get kitchenDisplay => 'Cocina';
  @override
  String get scanQR => 'Escanear QR';

  // ===== MESAS =====
  @override
  String get table => 'Mesa';
  @override
  String get available => 'Disponible';
  @override
  String get occupied => 'Ocupada';
  @override
  String get reserved => 'Reservada';
  @override
  String get capacity => 'Capacidad';
  @override
  String get tableNumber => 'Mesa';
  @override
  String get changeStatus => 'Cambiar Estado';
  @override
  String get viewDetails => 'Ver Detalles';

  // ===== ASISTENCIA =====
  @override
  String get checkIn => 'Registrar Entrada';
  @override
  String get checkOut => 'Registrar Salida';
  @override
  String get checkedIn => 'Turno Activo';
  @override
  String get notCheckedIn => 'Sin Turno Activo';
  @override
  String get attendanceHistory => 'Historial de Hoy';
  @override
  String get today => 'Hoy';
  @override
  String get employee => 'Empleado';

  // ===== COCINA =====
  @override
  String get pending => 'Pendiente';
  @override
  String get cooking => 'Cocinando';
  @override
  String get ready => 'Listo';
  @override
  String get orderNumber => 'Orden';
  @override
  String get items => 'Platillos';
  @override
  String get startCooking => 'Iniciar';
  @override
  String get markReady => 'Marcar Listo';
  @override
  String get deliver => 'Entregar';

  // ===== QR SCANNER =====
  @override
  String get scanTableQR => 'Escanear QR de Mesa';
  @override
  String get scanningInstructions => 'Apunta la cámara al código QR de la mesa';
  @override
  String get tableScanned => 'Mesa escaneada';
  @override
  String get invalidQR => 'Código QR inválido';

  // ===== ESTADÍSTICAS =====
  @override
  String get salesToday => 'Ventas Hoy';
  @override
  String get activeOrders => 'Pedidos Activos';
  @override
  String get totalDishes => 'Total Platillos';
  @override
  String get quickActions => 'Acciones Rápidas';

  // ===== MENÚ =====
  @override
  String get manageInventory => 'Gestionar Inventario';
  @override
  String get manageStaff => 'Gestionar Personal';
  @override
  String get manageTables => 'Gestionar Mesas';
  @override
  String get kitchenView => 'Vista de Cocina';

  // ===== MENSAJES =====
  @override
  String get noTablesRegistered => 'No hay mesas registradas.';
  @override
  String get noOrdersFound => 'No hay órdenes.';
  @override
  String get checkInSuccess => 'Entrada registrada exitosamente';
  @override
  String get checkOutSuccess => 'Salida registrada exitosamente';
  @override
  String get errorOccurred => 'Ocurrió un error';
}
