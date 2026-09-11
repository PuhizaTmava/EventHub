# EventHub

Aplikacion mobil per krijimin, menaxhimin dhe zbulimin e eventeve/aktiviteteve bazuar ne lokacion.

Projekt per lenden Mobile Programming.

## Teknologjite

- React Native (JavaScript) + Expo
- Firebase (Authentication, Firestore Database)
- React Navigation (Bottom Tabs + Native Stack)

## Funksionalitetet kryesore

### Autentikimi

- Regjistrim/Kycje me Email & Password
- Kycje me Phone Authentication (SMS verification)
- Role-t Admin dhe User:
  - Admin: mund te shtoje, editoje dhe fshije evente
  - User: mund te shikoje, kerkoje, te beje favorite dhe te "bleje" tiketa (mock)

### Eventet

- Krijim/editim eventesh me: titull, pershkrim, date, adrese manuale, foto
- GPS/Location automatik (koordinata reale te perdoruesit) - expo-location
- Renditje automatike e eventeve sipas distances nga perdoruesi (formula Haversine)
- Search bar per kerkim eventesh sipas titullit
- Validim: s'lejohen evente me date ne te kaluaren

### Ekstra

- Kalendar interaktiv - shfaq eventet sipas dates
- Favoritet - perdoruesit mund te "like" eventet
- Tiketat - sistem mock per "blerjen" e tiketave (pa pagese reale), me kod unik tiketash

## Ekranet

1. Login
2. Register
3. Phone Login
4. Home (liste eventesh + kerkim)
5. Event Detail
6. Add/Edit Event (vetem Admin)
7. Calendar
8. Favorites
9. Tickets
10. Ticket Detail
11. Profile

## Firebase - Struktura e te dhenave (Firestore)

Koleksioni events:

```
{
  title, description, address, eventDate,
  imageBase64, location: {latitude, longitude},
  createdBy, createdByEmail, createdAt
}
```

Koleksioni favorites:

```
{ userId, eventId, createdAt }
```

Koleksioni tickets:

```
{ userId, eventId, eventTitle, eventDate, ticketCode, purchasedAt }
```

## Optimizimi i performances

- FlatList per krejt listat (Home, Calendar, Favorites, Tickets)
- useMemo - renditja/filtrimi i eventeve (HomeScreen), markimi i datave (CalendarScreen)
- useCallback - funksionet e renderItem dhe handler-at, per te shmangur ri-krijimin ne cdo render
- React.memo - EventCard s'ri-renderohet nese props-at s'ndryshojne

## Testet

```
npm test
```

- Snapshot test: __tests__/EventCard.test.js
- Mocking test: __tests__/distance.test.js (funksioni Haversine)
- Interaction test: __tests__/LoginScreen.test.js (simulim shtypje butonash + mock Firebase)

## Si te ekzekutohet projekti

```
npm install
npx expo start
```

Skano QR kodin me aplikacionin Expo Go (iOS/Android).

## Llogari testimi

User i thjeshte:
- Regjistro cdo email tjeter, ose perdor Phone Login me:
  - Numer: +1 650-555-1234 ose +383 44 0000000
  - Kodi i verifikimit: 123456

## Verejtje

- Firestore eshte aktualisht ne test mode (rregullat e sigurise hapen deri me 11 Tetor 2026) - per prodhim te vertete do te duheshin Security Rules restriktive.
- Fotot ruhen si base64 direkt ne Firestore (jo Firebase Storage) per te shmangur nevojen e planit Blaze (pagese).
- Google Sign-In eshte konfiguruar ne kod, por kerkon development build (jo Expo Go) per te funksionuar plotesisht - per kete arsye eshte perdorur Phone Authentication si provider i dyte.