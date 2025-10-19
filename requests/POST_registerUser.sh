curl --request POST http://localhost:3000/users/register \
  --header "Content-Type: application/json" \
  --data '{
    "name": "John Doe",
    "email": "johndo@example.com",
    "password": "password13"
  }'