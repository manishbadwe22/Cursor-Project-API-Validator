# Test validate_api_key RPC - replace YOUR_ANON_KEY with your Supabase anon key from .env.local
$headers = @{
  "Content-Type"  = "application/json"
  "apikey"        = "YOUR_ANON_KEY"
  "Authorization" = "Bearer YOUR_ANON_KEY"
}
$body = '{"p_input_key": "hdheee"}'
Invoke-RestMethod -Uri "https://beupeyvprdapyrbaqgby.supabase.co/rest/v1/rpc/validate_api_key" -Method POST -Headers $headers -Body $body
