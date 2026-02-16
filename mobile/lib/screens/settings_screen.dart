import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/theme/app_theme.dart';
import '../core/i18n/app_localizations.dart';
import '../core/providers/theme_provider.dart';
import '../core/providers/locale_provider.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDarkMode = ref.watch(themeProvider);
    final currentLocale = ref.watch(localeProvider);
    final l10n = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.settings),
        backgroundColor: AppColors.primary,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Sección de Tema
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        isDarkMode ? Icons.dark_mode : Icons.light_mode,
                        color: AppColors.primary,
                      ),
                      const SizedBox(width: 12),
                      Text(
                        l10n.theme,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        isDarkMode ? l10n.darkTheme : l10n.lightTheme,
                        style: const TextStyle(fontSize: 16),
                      ),
                      Switch(
                        value: isDarkMode,
                        onChanged: (_) {
                          ref.read(themeProvider.notifier).toggleTheme();
                        },
                        activeColor: AppColors.primary,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Sección de Idioma
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.language, color: AppColors.primary),
                      const SizedBox(width: 12),
                      Text(
                        l10n.language,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        currentLocale.languageCode == 'es'
                            ? 'Español'
                            : 'English',
                        style: const TextStyle(fontSize: 16),
                      ),
                      SegmentedButton<String>(
                        segments: const [
                          ButtonSegment(
                            value: 'es',
                            label: Text('ES'),
                            icon: Icon(Icons.flag, size: 16),
                          ),
                          ButtonSegment(
                            value: 'en',
                            label: Text('EN'),
                            icon: Icon(Icons.flag, size: 16),
                          ),
                        ],
                        selected: {currentLocale.languageCode},
                        onSelectionChanged: (Set<String> selected) {
                          ref
                              .read(localeProvider.notifier)
                              .setLocale(Locale(selected.first));
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 32),

          // Vista previa de colores
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Color Preview',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      _buildColorChip('Primary', AppColors.primary),
                      _buildColorChip('Secondary', AppColors.secondary),
                      _buildColorChip('Accent', AppColors.accent),
                      _buildColorChip('Success', AppColors.success),
                      _buildColorChip('Warning', AppColors.warning),
                      _buildColorChip('Error', AppColors.error),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildColorChip(String label, Color color) {
    return Chip(
      avatar: CircleAvatar(backgroundColor: color),
      label: Text(label),
      backgroundColor: color.withOpacity(0.1),
    );
  }
}
