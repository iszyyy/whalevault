import 'package:flutter/material.dart';

class AlertsPage extends StatelessWidget {
  const AlertsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: const [
        Text('Alerts', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
        SizedBox(height: 10),
        Card(
          child: ListTile(
            leading: Icon(Icons.notifications_active_outlined),
            title: Text('Whale transfer alerts'),
            subtitle: Text('Configure rules in WhaleVault backend and receive push/email/telegram alerts.'),
          ),
        ),
        Card(
          child: ListTile(
            leading: Icon(Icons.insights_outlined),
            title: Text('Price and sentiment alerts'),
            subtitle: Text('This tab can be extended to create/edit rules from /api/v1/alerts endpoints.'),
          ),
        ),
      ],
    );
  }
}
