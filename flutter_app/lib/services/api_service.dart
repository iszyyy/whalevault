import 'dart:convert';

import 'package:http/http.dart' as http;

import '../core/constants.dart';

class ApiService {
  ApiService(this.apiKey);

  final String apiKey;

  Future<Map<String, dynamic>> getJson(String path) async {
    final response = await http.get(
      Uri.parse('${AppConstants.apiBaseUrl}$path'),
      headers: {
        'Content-Type': 'application/json',
        if (apiKey.isNotEmpty) 'X-API-Key': apiKey,
      },
    );

    if (response.statusCode >= 400) {
      throw Exception('API call failed (${response.statusCode}) for $path');
    }

    final decoded = jsonDecode(response.body);
    if (decoded is Map<String, dynamic>) {
      return decoded;
    }

    return {'data': decoded};
  }
}
