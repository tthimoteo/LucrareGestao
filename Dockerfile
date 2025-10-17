# Use the official .NET SDK image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

# Copy csproj and restore as distinct layers
COPY backend/*.csproj ./backend/
RUN dotnet restore ./backend/backend.csproj

# Copy everything else and build
COPY backend/ ./backend/
WORKDIR /app/backend
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/backend/out .

# Create a non-root user
RUN addgroup --system --gid 1001 dotnetuser
RUN adduser --system --uid 1001 --ingroup dotnetuser dotnetuser
USER dotnetuser

EXPOSE 10000

ENTRYPOINT ["dotnet", "backend.dll"]