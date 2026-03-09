import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../core/app_scope.dart';
import '../../widgets/stat_card.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    final state = AppScope.of(context);
    final currency = NumberFormat.compactSimpleCurrency(name: 'USD');

    return RefreshIndicator(
      onRefresh: state.refreshDashboard,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('WhaleVault', style: Theme.of(context).textTheme.headlineMedium),
          const SizedBox(height: 8),
          Text('Live from whalevault.iszy.cloud', style: Theme.of(context).textTheme.bodySmall),
          const SizedBox(height: 16),
          GridView.count(
            crossAxisCount: 2,
            childAspectRatio: 1.4,
            physics: const NeverScrollableScrollPhysics(),
            shrinkWrap: true,
            children: [
              StatCard(label: 'Volume Tracked', value: currency.format(state.dashboardStats.totalVolumeTracked)),
              StatCard(label: 'Whale Wallets', value: '${state.dashboardStats.activeWhaleWallets}'),
              StatCard(label: '24h Alerts', value: '${state.dashboardStats.alertsTriggered24h}'),
              StatCard(label: 'Sentiment', value: state.dashboardStats.sentimentLabel.toUpperCase()),
            ],
          ),
          const SizedBox(height: 12),
          if (state.isLoadingDashboard) const LinearProgressIndicator(),
          if (state.error != null)
            Padding(
              padding: const EdgeInsets.only(top: 12),
              child: Text(state.error!, style: const TextStyle(color: Colors.redAccent)),
            ),
          const SizedBox(height: 16),
          Text('Whale Activity', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 10),
          ...state.whaleTransactions.map(
            (tx) => Card(
              child: ListTile(
                title: Text('${tx.chain.toUpperCase()} • ${currency.format(tx.amountUsd)}'),
                subtitle: Text('From ${tx.from} → ${tx.to}'),
                trailing: Text(tx.hash.isEmpty ? '-' : tx.hash.substring(0, tx.hash.length > 8 ? 8 : tx.hash.length)),
              ),
            ),
          ),
          if (state.whaleTransactions.isEmpty && !state.isLoadingDashboard)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Text('No whale activity found for this key yet.'),
              ),
            ),
        ],
      ),
    );
  }
}
