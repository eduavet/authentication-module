## Authentication module

#### Setup instructions

1. Create a database using the queries in `postgres` folder
2. Configure the user token lifespan and database connection credentials in `.env` file

## API endpoints

### Register
`POST /register`

##### Payload:

* username `(String)`
* password `(String, min. 8 characters)`

##### Success:
`{ "token": USER_ACCESS_TOKEN }`

##### Errors:
* 400: Validation error
* 409: User with that username already exists
___

#### Login
`POST /login`

##### Payload:
* username `(String)`
* password `(String)`

##### Success:
`{ "token": USER_ACCESS_TOKEN }`

##### Errors:
* 400: Validation error
* 401: Wrong username/password combination

___
#### Get user
`GET /user`

##### Query:
* token `(String)`

##### Success:
```
{
	"username": USERNAME,
	"expiring_at": TOKEN_EXPIRATION_DATE
}
```

##### Errors:
* 400: Validation error
* 401: Token has expired
* 401: Invalid token
