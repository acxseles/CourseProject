# Базовый образ для сборки .NET приложений
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Копируем файл проекта и устанавливаем зависимости
COPY SchoolSwedishAPI.csproj .
RUN dotnet restore

# Копируем ВСЕ остальные файлы и собираем приложение
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Базовый образ для запуска
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Копируем собранное приложение
COPY --from=build /app/publish .

# Открываем порт 5000
EXPOSE 5000

# Запускаем приложение
ENTRYPOINT ["dotnet", "SchoolSwedishAPI.dll"]