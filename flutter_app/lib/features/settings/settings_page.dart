import 'package:flutter/material.dart';

import '../../core/app_scope.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final state = AppScope.of(context);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('Settings', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        const Card(
          child: ListTile(
            leading: Icon(Icons.cloud_done_outlined),
            title: Text('Environment'),
            subtitle: Text('Production API: https://whalevault.iszy.cloud'),
          ),
        ),
        Card(
          child: ListTile(
            leading: const Icon(Icons.sync),
            title: const Text('Refresh dashboard data'),
            onTap: () => state.refreshDashboard(),
          ),
        ),
        Card(
          child: ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Clear API key'),
            subtitle: const Text('Sign out of this device.'),
            onTap: () => state.logout(),
          ),
        ),
      ],
    );
  }
}
