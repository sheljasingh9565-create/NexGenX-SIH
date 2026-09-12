# Waste2Worth Dashboard API Integration

The dashboard charts are **not image/PNG based**. They are rendered from JavaScript data on a Chart.js canvas, so the backend can replace the temporary mock arrays with live API responses without changing the HTML layout.

## Endpoints

### Summary
`GET /api/dashboard/summary`

Example response:
```json
{
  "userName": "Eren",
  "headerName": "Eren",
  "segregatedKg": 95,
  "earnedRupees": 9527,
  "co2SavedKg": 210
}
```

### Waste segregated
`GET /api/dashboard/analytics?metric=wasteSegregated`

```json
{
  "labels": ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  "values": [12, 18, 15, 22, 27, 31],
  "unit": "kg"
}
```

### Recyclable waste segregated
`GET /api/dashboard/analytics?metric=recyclableWaste`

```json
{
  "labels": ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  "values": [7, 11, 9, 14, 18, 21],
  "unit": "kg"
}
```

### Expected vs actual income
`GET /api/dashboard/analytics?metric=incomeComparison`

```json
{
  "labels": ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  "expected": [1100, 1600, 2200, 2900, 3600, 4300],
  "actual": [980, 1510, 2050, 2780, 3490, 4120],
  "unit": "₹"
}
```

The UI uses the API response when available and falls back to mock data when the endpoint is unavailable. No PNG needs to be edited or regenerated.
