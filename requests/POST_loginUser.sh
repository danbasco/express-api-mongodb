curl --request POST http://localhost:3000/users/login \
  --header "Content-Type: application/json" \
  --data '{
    "email": "johndoe@example.com",
    "password": "password123"
  }'