import 'package:flutter/material.dart';

import '../../core/app_scope.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _apiKeyController = TextEditingController();
  bool _submitting = false;

  @override
  void dispose() {
    _apiKeyController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() => _submitting = true);
    final appState = AppScope.of(context);

    try {
      await appState.login(_apiKeyController.text.trim());
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(appState.error ?? 'Authentication failed')),
      );
    } finally {
      if (mounted) {
        setState(() => _submitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text('Connect WhaleVault', style: Theme.of(context).textTheme.headlineSmall),
                        const SizedBox(height: 8),
                        const Text('Paste your WhaleVault API key to unlock whale transactions and analytics.'),
                        const SizedBox(height: 20),
                        TextFormField(
                          controller: _apiKeyController,
                          decoration: const InputDecoration(labelText: 'X-API-Key'),
                          validator: (value) => (value == null || value.trim().length < 10) ? 'Valid API key required' : null,
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: _submitting ? null : _submit,
                          child: _submitting
                              ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2))
                              : const Text('Continue'),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
