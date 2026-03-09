import 'package:flutter/material.dart';

class TrackerPage extends StatelessWidget {
  const TrackerPage({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: const [
        Text('Wallet Tracker', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
        SizedBox(height: 10),
        Card(
          child: ListTile(
            leading: Icon(Icons.account_balance_wallet),
            title: Text('Track Ethereum, Solana, and exchange wallets'),
            subtitle: Text('Connect wallets in backend dashboard. This mobile app reads synced data in real time.'),
          ),
        ),
        Card(
          child: ListTile(
            leading: Icon(Icons.link),
            title: Text('API: /api/v1/wallets/:address/activity'),
            subtitle: Text('Use this endpoint for per-wallet activity details and timeline visualizations.'),
          ),
        ),
      ],
    );
  }
}
