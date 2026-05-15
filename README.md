# MojPrevoz

MojPrevoz is a ride-sharing app for coordinating trips across North Macedonia. This repository is organized for public sharing and now contains:

- `frontend/` - the Expo / React Native mobile app
- `api/` - the ASP.NET Core backend API

## Project Structure

```text
Moj-Prevoz/
|- frontend/
`- api/
```

## Frontend Setup

1. Copy `frontend/.env.example` to `frontend/.env`
2. Fill in the required values:
   - `EXPO_PUBLIC_API_BASE_URL`
   - `EXPO_PUBLIC_WS_URL`
   - `EXPO_PUBLIC_ENCRYPTED_API_KEY`
   - `EXPO_PUBLIC_IMGBB_API_KEY`
3. Install dependencies and run the app:

```bash
cd frontend
npm install
npm start
```

## API Setup

Update `api/MojPrevoz.Api/appsettings.json` or provide environment variables / secret overrides for:

- `ConnectionStrings:DefaultConnection`
- `AppSettings:Secret`
- `AppSettings:ApiKeyToValidate`
- `AppSettings:EncryptionApiKey`
- `AppSettings:EncryptionIV`
- `AppSettings:EncryptedApiKey`
- `MailSettings:*`
- `Twilio:*`

Then run:

```bash
cd api
dotnet build MojPrevoz.Api.sln
dotnet run --project MojPrevoz.Api/MojPrevoz.Api.csproj
```

## Notes

- Secrets and deployment-specific files were removed from the tracked repo before publication.
- If any of the old secrets were ever used outside a private local environment, rotate them before making the repository public.
