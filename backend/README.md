### Testing Redis Cache

1. `npm i -g redis-commander`
2. Run on CMD: `redis-commander`
3. Run the BE: `npm run dev`
4. Go to `endpoints/auth.http` and press `Send Request` via Visual Studio Code (need Client Request Plugin)
5. Navigate to `localhost:8081` and watch vars of redis :).

### Navigating to Bull Dashboard Queues

1. Run `npm run dev`
2. Navigate to `localhost:5000/queues`

### For Testing the Sending Email Service use:

1. you can use <a>https://ethereal.email/