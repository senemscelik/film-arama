# 🎬 Sinemaskop — Film Arama

TMDB API'si ile türe ve isme göre film arama uygulaması.

**Teknolojiler:** Vite · React 18 · SCSS · CSS Grid · Fetch API

## Kurulum

1. [Node.js](https://nodejs.org/) (18+) kurun.
2. `.env.example` dosyasını `.env` olarak kopyalayıp TMDB anahtarınızı girin:
   ```
   VITE_TMDB_KEY=xxxxxxxxxxxxxxxx
   ```
   v3 **API Key** ya da v4 **Read Access Token** kullanılabilir; uygulama hangisi olduğunu otomatik algılar.
3. Bağımlılıkları kurup geliştirme sunucusunu başlatın:
   ```bash
   npm install
   npm run dev
   ```

## Özellikler

- İsimle arama (debounce ile, her tuşta istek atmaz)
- Türlere göre filtreleme (birden fazla tür seçilebilir, VEYA mantığı)
- Popülerlik / puan / tarih / hasılata göre sıralama
- Film detay penceresi: özet, süre, yönetmen, oyuncular, fragman bağlantısı
- Koyu / açık tema (sistem tercihini algılar, seçimi hatırlar)
- CSS Grid ile sayfa iskeleti ve otomatik sütunlu film ızgarası
- Mobil, tablet ve masaüstü uyumlu
- Film greni, ızgara deseni, gradyan ışıklar ve buzlu cam yüzeyler

## Klasör yapısı

```
src/
├── api/tmdb.js          # fetch tabanlı TMDB istemcisi
├── hooks/               # useTheme, useDebounce
├── components/          # Her bileşen kendi .scss dosyasıyla
├── styles/
│   ├── _theme.scss      # Koyu/açık tema token'ları (CSS değişkenleri)
│   ├── _mixins.scss     # breakpoint, glass, shimmer vb.
│   ├── global.scss      # Reset, arka plan dokuları, animasyonlar
│   └── App.scss         # Grid template areas ile sayfa yerleşimi
├── App.jsx
└── main.jsx
```

> Not: TMDB'nin arama uç noktası tür filtresini desteklemediği için, isimle arama yapılırken seçili türler mevcut sayfa sonuçları üzerinde istemci tarafında uygulanır.
