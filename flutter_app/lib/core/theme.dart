import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData dark() {
    const baseColor = Color(0xFF5EEAD4);
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: ColorScheme.fromSeed(
        seedColor: baseColor,
        brightness: Brightness.dark,
      ),
      scaffoldBackgroundColor: const Color(0xFF0B0F19),
      cardTheme: CardThemeData(
        color: const Color(0xFF111827),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFF1F2937),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
}
