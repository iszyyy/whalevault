# WhaleVault Flutter Mobile App

Native Flutter client for WhaleVault.

- **Base URL**: `https://whalevault.iszy.cloud`
- **Auth model used by app**: `X-API-Key` header (stored locally on device)

## Included

- API key sign-in flow
- Dashboard metrics from `/api/dashboard/stats`
- Whale transaction feed from `/api/v1/transactions`
- Tabs: Dashboard, Tracker, Alerts, Settings
- APK-ready Flutter app code in `lib/`

## Local build

```bash
# from flutter_app/
flutter create . --platforms=android,ios
flutter pub get
flutter run
flutter build apk --release
```

APK output:

```text
build/app/outputs/flutter-apk/app-release.apk
```

## Build on GitHub Actions

Yes — this repo now includes `.github/workflows/flutter-apk.yml`.

It will:
1. Install Flutter + Java
2. Generate Android platform files via `flutter create . --platforms=android`
3. Run `flutter pub get`
4. Run `flutter analyze`
5. Build `app-release.apk`
6. Upload the APK as workflow artifact `whalevault-app-release-apk`

You can trigger it manually via **Actions → Build WhaleVault Flutter APK → Run workflow**.
