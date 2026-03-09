class WhaleTransaction {
  WhaleTransaction({
    required this.hash,
    required this.chain,
    required this.amountUsd,
    required this.from,
    required this.to,
  });

  final String hash;
  final String chain;
  final double amountUsd;
  final String from;
  final String to;

  factory WhaleTransaction.fromJson(Map<String, dynamic> json) {
    return WhaleTransaction(
      hash: (json['hash'] ?? '').toString(),
      chain: (json['chain'] ?? 'unknown').toString(),
      amountUsd: (json['usdValue'] ?? 0).toDouble(),
      from: (json['fromAddress'] ?? 'unknown').toString(),
      to: (json['toAddress'] ?? 'unknown').toString(),
    );
  }
}
