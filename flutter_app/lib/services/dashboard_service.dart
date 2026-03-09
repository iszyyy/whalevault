import '../models/dashboard_stats.dart';
import '../models/whale_transaction.dart';
import 'api_service.dart';

class DashboardService {
  DashboardService(this.api);

  final ApiService api;

  Future<DashboardStats> fetchStats() async {
    final json = await api.getJson('/api/dashboard/stats');
    return DashboardStats.fromJson(json);
  }

  Future<List<WhaleTransaction>> fetchWhaleActivity() async {
    final json = await api.getJson('/api/v1/transactions?limit=20&min_amount=100000');
    final list = (json['transactions'] as List?) ?? [];
    return list.whereType<Map<String, dynamic>>().map(WhaleTransaction.fromJson).toList();
  }
}
