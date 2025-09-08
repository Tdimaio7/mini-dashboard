project:
  name: "Mini Dashboard - BTC vs ETH"
  description: "Mini-dashboard en React + TypeScript que consume API, aplica transformaciones de datos y muestra visualizaciones interactivas con filtros y drill-down."
  
objective: "Construir un mini-dashboard en React + TypeScript con backend ligero y trazas de ejecución."

data_sources:
  api_publica:
    - url: "/crypto/history?coin=bitcoin&days=30"
    - url: "/crypto/history?coin=ethereum&days=30"
  mock_local: "/mock"

environment_variables:
  local_file: ".env.local"
  example_file: ".env.example"
  variables:
    - ADMIRA_TOKEN: "YOUR_TOKEN_HERE"
    - WEBHOOK_URL: "YOUR_WEBHOOK_URL_HERE"

setup_instructions:
  backend:
    path: "backend"
    commands:
      - "npm install"
      - "npm run dev"
  frontend:
    path: "frontend"
    commands:
      - "npm install"
      - "npm run dev"
  url_local: "http://localhost:5173"

transformations:
  - name: "Promedio por día"
    function: "averagePriceByDay"
    description: "Agrupa datos por fecha y calcula promedio de precio diario."
  - name: "Media móvil 7 días"
    function: "rollingAverageByCoin"
    description: "Suaviza tendencia de precios calculando media móvil."
  - name: "Cambio diario (%)"
    function: "dailyPercentChangeByCoin"
    description: "Calcula variación porcentual diaria del precio por coin."
  - name: "Top 5 Market Cap"
    function: "topNByMarketCap"
    description: "Selecciona las 5 monedas con mayor capitalización de mercado."
  - name: "Normalización de precios"
    function: "normalizeByCoin"
    description: "Escala precios entre 0 y 1 para comparativa BTC vs ETH."
  - name: "Drill-down BTC vs ETH"
    function: "diffData"
    description: "Combina datos por fecha para mostrar detalle y diferencia en tabla."

design_decisions:
  backend: "Node/Express ligero para proxy y trazas sin exponer API keys."
  frontend: "React + TypeScript con hooks y tipado fuerte."
  charts: "Recharts, responsive, líneas, barras, tooltips."
  filters: "Filtrado por fecha y coin (BTC, ETH, combined)."
  css: "Flex/grid responsive para mobile y desktop."
  drill_down: "Tabla debajo de gráficos, clic en legend/highlight."

visualizations:
  - type: "line"
    name: "Precio promedio por día"
  - type: "line"
    name: "Media móvil 7 días"
  - type: "line"
    name: "Precio normalizado"
  - type: "line"
    name: "Cambio diario (%)"
  - type: "bar"
    name: "Top 5 Market Cap"
  - type: "table"
    name: "Detalle BTC vs ETH (drill-down)"

interactivity:
  filters:
    - type: "date_range"
    - type: "coin_selection"
      options: ["BTC", "ETH", "combined"]
  drill_down: "Clic en gráfico resalta coin y muestra tabla debajo."
  tooltips: "Muestra valores exactos al pasar el mouse."

error_handling:
  loading: "Mensaje 'Loading...' mientras se cargan datos."
  error: "Mensaje 'Error: <error>' en fallo de red o API."
  empty: "Mensaje 'No hay datos en este rango' cuando no hay resultados."

evidence:
  video:
    duration: "5 minutos"
    content:
      - "Cambio de filtros (fechas y coin)"
      - "Drill-down en la tabla"
      - "Archivo backend/logs/http_trace.jsonl creciendo en vivo"

ai_usage:
  description: "Se utilizó ChatGPT como apoyo puntual"
  details:
    - "Ayuda para organizarme por sprints y dividir entregas"
    - "Completar pequeños fragmentos de código"
    - "Sugerir estructura mínima del proyecto (backend y frontend)"
  note: "El código final fue implementado y revisado manualmente."


