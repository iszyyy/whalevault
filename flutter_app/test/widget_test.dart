import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:whalevault_mobile/core/theme.dart';

void main() {
  test('AppTheme.dark uses dark brightness', () {
    final theme = AppTheme.dark();
    expect(theme.brightness, Brightness.dark);
  });
}
