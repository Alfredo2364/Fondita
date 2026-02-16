import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'firebase_options.dart';
import 'features/auth/login_screen.dart';
import 'features/home/home_screen.dart';
import 'features/home/waiter_home_screen.dart';
import 'features/home/manager_home_screen.dart';
import 'core/providers/auth_provider.dart';
import 'core/theme/app_theme.dart';
import 'core/providers/theme_provider.dart';
import 'core/providers/locale_provider.dart';
import 'core/i18n/app_localizations.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
  } catch (e) {
    debugPrint('Firebase initialization failed: $e');
  }
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);
    final roleState = ref.watch(userRoleProvider);
    final isDarkMode = ref.watch(themeProvider);
    final currentLocale = ref.watch(localeProvider);

    return MaterialApp(
      title: 'Fondita App',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: isDarkMode ? ThemeMode.dark : ThemeMode.light,
      debugShowCheckedModeBanner: false,
      locale: currentLocale,
      supportedLocales: AppLocalizations.supportedLocales,
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      home: authState.when(
        data: (user) {
          if (user == null) return const LoginScreen();

          return roleState.when(
            data: (role) {
              if (role == 'admin') return const ManagerHomeScreen();
              if (role == 'staff') return const WaiterHomeScreen();
              return const HomeScreen(); // Customer
            },
            loading: () => const Scaffold(
              body: Center(child: CircularProgressIndicator()),
            ),
            error: (e, s) =>
                Scaffold(body: Center(child: Text('Error rol: $e'))),
          );
        },
        loading: () =>
            const Scaffold(body: Center(child: CircularProgressIndicator())),
        error: (e, s) => Scaffold(body: Center(child: Text('Error auth: $e'))),
      ),
    );
  }
}
