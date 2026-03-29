# Fresher's Cafe Backend (Spring Boot)

This is a Spring Boot backend scaffold for the Fresher's Cafe project.

## Tech Stack
- Java 17
- Spring Boot 3
- Maven

## Run
From the `backend` folder:

```bash
mvn spring-boot:run
```

Backend URL:
- `http://localhost:8081`

Test endpoint:
- `GET http://localhost:8081/api/health`

## Auth & Profile APIs
- `POST /api/auth/register`
	- Body: `{ "username": "john", "email": "john@example.com", "password": "secret" }`
- `POST /api/auth/login`
	- Body: `{ "email": "john@example.com", "password": "secret" }`
- `GET /api/auth/profile`
	- Header: `Authorization: Bearer <token>`
- `PUT /api/auth/profile`
	- Header: `Authorization: Bearer <token>`
	- Body: `{ "username": "newname" }`

## Cart APIs
- `GET /api/cart`
- `POST /api/cart/add`
	- Body: `{ "name": "Latte", "price": 6.49, "image": "...", "quantity": 1 }`
- `PUT /api/cart/quantity`
	- Body: `{ "name": "Latte", "quantity": 2 }`
- `DELETE /api/cart/{productName}`
- `DELETE /api/cart/clear`

All cart endpoints require:
- Header: `Authorization: Bearer <token>`

## Build
```bash
mvn clean package
```

Jar output:
- `target/backend-0.0.1-SNAPSHOT.jar`
