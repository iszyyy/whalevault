class DashboardStats {
  DashboardStats({
    required this.totalVolumeTracked,
    required this.activeWhaleWallets,
    required this.alertsTriggered24h,
    required this.sentimentLabel,
  });

  final double totalVolumeTracked;
  final int activeWhaleWallets;
  final int alertsTriggered24h;
  final String sentimentLabel;

  factory DashboardStats.fromJson(Map<String, dynamic> json) {
    final sentiment = (json['sentiment'] as Map<String, dynamic>?) ?? const {};

    return DashboardStats(
      totalVolumeTracked: (json['totalVolumeTracked'] ?? 0).toDouble(),
      activeWhaleWallets: json['activeWhaleWallets'] ?? 0,
      alertsTriggered24h: json['alertsTriggered24h'] ?? 0,
      sentimentLabel: (sentiment['label'] ?? 'neutral').toString(),
    );
  }
}
