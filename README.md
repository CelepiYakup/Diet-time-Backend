# Diet Time Backend

Diet uygulaması için backend API servisi.

## Docker ile çalıştırma

1. Gerekli çevre değişkenleri dosyalarını oluşturun:
   ```
   cp .env.example .env
   cp postgres.env.example postgres.env
   ```

2. Docker Compose ile uygulamayı başlatın:
   ```
   docker-compose up -d
   ```

3. Backend API servisi http://localhost:5000 adresinde çalışacaktır.
   
4. Veritabanına erişmek için:
   ```
   Host: localhost
   Port: 5433
   Username: postgres (veya postgres.env dosyasında belirttiğiniz)
   Password: postgres (veya postgres.env dosyasında belirttiğiniz)
   Database: postgres (veya postgres.env dosyasında belirttiğiniz)
   ``` # Diet-time-Backend
