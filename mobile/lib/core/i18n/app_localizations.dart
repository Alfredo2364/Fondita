import 'package:flutter/material.dart';
import 'app_localizations_en.dart';
import 'app_localizations_es.dart';

/// Clase base para localizaciones de la app
abstract class AppLocalizations {
  // Método para obtener las localizaciones según el contexto
  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  // Idiomas soportados
  static const List<Locale> supportedLocales = [
    Locale('es'), // Español
    Locale('en'), // Inglés
  ];

  // Delegate para cargar las localizaciones
  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  // ===== TEXTOS GENERALES =====
  String get appName;
  String get settings;
  String get language;
  String get theme;
  String get lightTheme;
  String get darkTheme;
  String get logout;
  String get cancel;
  String get accept;
  String get save;
  String get delete;
  String get edit;
  String get search;
  String get loading;
  String get error;
  String get success;

  // ===== ROLES =====
  String get manager;
  String get waiter;
  String get kitchen;
  String get customer;

  // ===== PANTALLAS PRINCIPALES =====
  String get managerPanel;
  String get waiterMode;
  String get tables;
  String get attendance;
  String get kitchenDisplay;
  String get scanQR;

  // ===== MESAS =====
  String get table;
  String get available;
  String get occupied;
  String get reserved;
  String get capacity;
  String get tableNumber;
  String get changeStatus;
  String get viewDetails;

  // ===== ASISTENCIA =====
  String get checkIn;
  String get checkOut;
  String get checkedIn;
  String get notCheckedIn;
  String get attendanceHistory;
  String get today;
  String get employee;

  // ===== COCINA =====
  String get pending;
  String get cooking;
  String get ready;
  String get orderNumber;
  String get items;
  String get startCooking;
  String get markReady;
  String get deliver;

  // ===== QR SCANNER =====
  String get scanTableQR;
  String get scanningInstructions;
  String get tableScanned;
  String get invalidQR;

  // ===== ESTADÍSTICAS =====
  String get salesToday;
  String get activeOrders;
  String get totalDishes;
  String get quickActions;

  // ===== MENÚ =====
  String get manageInventory;
  String get manageStaff;
  String get manageTables;
  String get kitchenView;

  // ===== MENSAJES =====
  String get noTablesRegistered;
  String get noOrdersFound;
  String get checkInSuccess;
  String get checkOutSuccess;
  String get errorOccurred;
}

/// Delegate para cargar las localizaciones
class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return ['es', 'en'].contains(locale.languageCode);
  }

  @override
  Future<AppLocalizations> load(Locale locale) async {
    switch (locale.languageCode) {
      case 'en':
        return AppLocalizationsEn();
      case 'es':
      default:
        return AppLocalizationsEs();
    }
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}
