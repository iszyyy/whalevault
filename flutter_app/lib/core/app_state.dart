import 'package:flutter/material.dart';

import '../models/dashboard_stats.dart';
import '../models/whale_transaction.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../services/dashboard_service.dart';

class AppState extends ChangeNotifier {
  final AuthService _authService = AuthService();

  String _apiKey = '';
  bool isBootstrapping = true;
  bool isAuthenticated = false;
  bool isLoadingDashboard = false;
  String? error;

  DashboardStats dashboardStats = DashboardStats(
    totalVolumeTracked: 0,
    activeWhaleWallets: 0,
    alertsTriggered24h: 0,
    sentimentLabel: 'neutral',
  );

  List<WhaleTransaction> whaleTransactions = [];

  Future<void> bootstrap() async {
    isBootstrapping = true;
    notifyListeners();
    _apiKey = await _authService.getApiKey() ?? '';
    isAuthenticated = _apiKey.isNotEmpty;
    isBootstrapping = false;
    notifyListeners();
    if (isAuthenticated) {
      await refreshDashboard();
    }
  }

  Future<void> login(String apiKey) async {
    error = null;
    await _authService.saveApiKey(apiKey);
    _apiKey = apiKey;
    isAuthenticated = true;
    notifyListeners();
    await refreshDashboard();
  }

  Future<void> refreshDashboard() async {
    isLoadingDashboard = true;
    error = null;
    notifyListeners();
    try {
      final dashboardService = DashboardService(ApiService(_apiKey));
      dashboardStats = await dashboardService.fetchStats();
      whaleTransactions = await dashboardService.fetchWhaleActivity();
    } catch (e) {
      error = e.toString();
    } finally {
      isLoadingDashboard = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    _apiKey = '';
    isAuthenticated = false;
    whaleTransactions = [];
    dashboardStats = DashboardStats(
      totalVolumeTracked: 0,
      activeWhaleWallets: 0,
      alertsTriggered24h: 0,
      sentimentLabel: 'neutral',
    );
    notifyListeners();
  }
}
