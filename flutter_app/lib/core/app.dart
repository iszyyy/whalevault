import 'package:flutter/material.dart';

import '../features/alerts/alerts_page.dart';
import '../features/auth/login_page.dart';
import '../features/dashboard/dashboard_page.dart';
import '../features/settings/settings_page.dart';
import '../features/tracker/tracker_page.dart';
import 'app_scope.dart';
import 'app_state.dart';
import 'theme.dart';

class WhaleVaultApp extends StatefulWidget {
  const WhaleVaultApp({super.key});

  @override
  State<WhaleVaultApp> createState() => _WhaleVaultAppState();
}

class _WhaleVaultAppState extends State<WhaleVaultApp> {
  final AppState _state = AppState();

  @override
  void initState() {
    super.initState();
    _state.bootstrap();
  }

  @override
  Widget build(BuildContext context) {
    return AppScope(
      state: _state,
      child: MaterialApp(
        title: 'WhaleVault',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.dark(),
        home: AnimatedBuilder(
          animation: _state,
          builder: (_, __) {
            if (_state.isBootstrapping) {
              return const Scaffold(body: Center(child: CircularProgressIndicator()));
            }
            return _state.isAuthenticated ? const RootPage() : const LoginPage();
          },
        ),
      ),
    );
  }
}

class RootPage extends StatefulWidget {
  const RootPage({super.key});

  @override
  State<RootPage> createState() => _RootPageState();
}

class _RootPageState extends State<RootPage> {
  int index = 0;

  final pages = const [
    DashboardPage(),
    TrackerPage(),
    AlertsPage(),
    SettingsPage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: pages[index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: index,
        onDestinationSelected: (value) => setState(() => index = value),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.dashboard), label: 'Dashboard'),
          NavigationDestination(icon: Icon(Icons.currency_bitcoin), label: 'Tracker'),
          NavigationDestination(icon: Icon(Icons.notifications_active), label: 'Alerts'),
          NavigationDestination(icon: Icon(Icons.settings), label: 'Settings'),
        ],
      ),
    );
  }
}
