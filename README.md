# Dentech API

Backend for a dental lab. Dentists place orders for products, the lab tracks them, marks them sent, and keeps a running credit balance per dentist.

Built with Node, Express, TypeScript, and MongoDB.

## Client

The front end for this API lives here:

https://github.com/alexandrosgialantzis/Dentech-vue

## Roles

Admin, dentist, plain user.

Admins manage products, credits, and users. Dentists see and place their own orders. A new sign up starts uncategorized and waits for an admin to give them a role.

The role check sits on the router mount in `server.ts`, not inside each controller. Product and credit routes are wrapped in `authorizePermissions(Roles.ADMIN)` once, and everything under them is covered.

## The shape

Four layers, each thin.

Routes map a url to a chain of middlewares and one controller. Controllers read the request and call a service. Services hold the rules. Under them sits `DataLayerService`, one generic class over a mongoose model, with get, create, update, delete written once.

Each service extends it and adds only what its resource needs.

## The middlewares

Twenty small files, each answering one question. Does this entity exist. Does this order belong to you. Are the dates valid. Is this credit already used.

Route chains read like a sentence because of it, and no check is written twice.

## Credits

A dentist can hold credits against future orders. `handle-credits` applies them when an order is priced, and marks each one used so it cannot be spent twice.

## Layout

```
routes/         url to controller
controllers/    read request, call service
services/       the rules
services/general-services/  the generic data layer
middlewares/    one check each
models/         User, Product, Order, Credit
errors/         one class per status code
helpers/        queries, dates, cost math
```

## Run it

```
git clone https://github.com/alexandrosgialantzis/Dentech-api.git
npm install
npm start
```

Make a `.env` file with:

```
MONGO_URI=
PORT=
JWT_SECRET=
JWT_LIFETIME=
```

## Notes

Errors are thrown, not returned. `express-async-errors` catches them from async controllers, and the handler at the end of `server.ts` reads the status off the error class. That is why no controller has a try catch in it.

Security: helmet style headers, mongo sanitize on the body, and a rate limit.

Messages returned to the client are in Greek.
