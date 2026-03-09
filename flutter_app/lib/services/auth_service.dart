import 'package:shared_preferences/shared_preferences.dart';

import '../core/constants.dart';

class AuthService {
  Future<String?> getApiKey() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(AppConstants.apiKeyStorageKey);
  }

  Future<void> saveApiKey(String apiKey) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(AppConstants.apiKeyStorageKey, apiKey.trim());
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConstants.apiKeyStorageKey);
  }
}
