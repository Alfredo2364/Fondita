import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Provider para gestionar el idioma de la aplicación
class LocaleNotifier extends StateNotifier<Locale> {
  LocaleNotifier() : super(const Locale('es')) {
    _loadLocale();
  }

  // Cargar idioma guardado
  Future<void> _loadLocale() async {
    final prefs = await SharedPreferences.getInstance();
    final languageCode = prefs.getString('languageCode') ?? 'es';
    state = Locale(languageCode);
  }

  // Cambiar idioma
  Future<void> setLocale(Locale locale) async {
    state = locale;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('languageCode', locale.languageCode);
  }

  // Alternar entre español e inglés
  Future<void> toggleLocale() async {
    final newLocale = state.languageCode == 'es'
        ? const Locale('en')
        : const Locale('es');
    await setLocale(newLocale);
  }
}

/// Provider global para el idioma
final localeProvider = StateNotifierProvider<LocaleNotifier, Locale>((ref) {
  return LocaleNotifier();
});
