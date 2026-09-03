# Punto de partida - Clase de Autenticacion/Autorizacion con Passport

Proyecto NestJS ya armado con lo aburrido resuelto (setup, dependencias,
tablas, CRUD sin proteger) para que en el video se escriba en vivo **solo**
la parte de autenticacion y autorizacion con Passport.

Ya instalados y listos para usar (`node_modules` al dia): `passport`,
`passport-local`, `passport-jwt`, `@nestjs/passport`, `@nestjs/jwt`,
`bcrypt`. No hace falta correr `npm install` de nuevo salvo que agregues
algo nuevo.

**Base de datos**: Postgres local (`localhost:5432`, usuario `postgres`),
base `nest_auth_demo` ya creada. Credenciales en `.env` (`DB_HOST`,
`DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`). Si el servicio de
Postgres no esta corriendo, arrancalo antes de `npm run start:dev`
(`Get-Service postgresql-x64-17` / `Start-Service postgresql-x64-17` en
PowerShell).

## Estado actual (a proposito, sin auth)

- `POST /users` y `GET /users` -> sin proteger, el password se guarda y se
  devuelve **en texto plano**. Buen gancho para arrancar la clase:
  "miren lo que pasa si no hacemos nada".
- `POST/GET/PATCH/DELETE /tasks` -> sin proteger, cualquiera ve y edita
  las tareas de cualquiera. `CreateTaskDto` pide `ownerId` a mano porque
  todavia no existe `@CurrentUser()`.
- 2 tablas: `User` (`email`, `password`, `role`) y `Task` (`title`, `done`,
  `ownerId`). `role` ya existe en la entidad para no perder tiempo de
  video modelando la tabla, pero no se usa en ningun lado todavia.
- DB: Postgres local, base `nest_auth_demo`. `synchronize: true` en
  `app.module.ts` (crea/actualiza las tablas solo, comodo para la demo).

## Correr

```bash
npm run start:dev
```

Se cae si hay dos instancias corriendo en el puerto 3000 (`EADDRINUSE`) --
si reiniciaste el server, fijate que no haya quedado un `node` viejo
corriendo (`Get-Process node` en PowerShell).

## Guion sugerido para el video (lo que falta escribir)

1. **Hashear el password**: en `UsersService.create` (`src/users/users.service.ts`),
   agregar `bcrypt.hash` antes de guardar. Mostrar el "antes" (texto plano)
   vs "despues".
2. **Modulo de auth**: `nest g module auth`, `nest g service auth`,
   `nest g controller auth`.
3. **DTOs de auth**: `RegisterDto` (igual a `CreateUserDto`, o reusarlo) y
   `LoginDto`.
4. **`AuthService.register`**: delega en `UsersService.create`.
5. **`AuthService.validateUser`**: busca por email, compara con
   `bcrypt.compare`.
6. **`LocalStrategy`** (`passport-local`): usa `validateUser`, se registra
   en `AuthModule` con `PassportModule`.
7. **`LocalAuthGuard`**: `extends AuthGuard('local')`, se aplica en
   `POST /auth/login`.
8. **`AuthService.login`**: firma un JWT con `@nestjs/jwt`
   (`JwtModule.registerAsync` leyendo `JWT_SECRET`/`JWT_EXPIRES_IN` del
   `.env`, ya estan puestos).
9. **`JwtStrategy`** (`passport-jwt`): extrae el Bearer token, valida y
   deja el payload en `request.user`.
10. **`JwtAuthGuard`**: `extends AuthGuard('jwt')`. Aplicarlo en
    `UsersController` y `TasksController` para exigir login.
11. **`@CurrentUser()`**: decorador custom para leer `request.user` en los
    controllers -- reemplaza el `ownerId` manual de `CreateTaskDto` por el
    usuario logueado.
12. **Autorizacion por rol**: `Roles` decorator + `RolesGuard` +
    `@Roles('admin')` en `GET /users` -- solo un admin ve la lista
    completa de usuarios.
13. **Autorizacion por dueño**: en `TasksService`, comparar
    `task.ownerId` contra el usuario logueado (o `role === 'admin'`) antes
    de dejar ver/editar/borrar -- segundo tipo de autorizacion, distinto
    de "por rol".

`.env` ya tiene `JWT_SECRET` y `JWT_EXPIRES_IN` cargados para no perder
tiempo de camara configurando variables de entorno.

## Para armar un usuario admin durante la demo de roles

Como `/users` (o el futuro `/auth/register`) siempre va a crear usuarios
con rol `user`, para probar el caso admin se puede: parar el server, abrir
`database.sqlite` con un cliente SQLite y cambiar el `role` a mano, o
armar un mini script/seed en el momento -- buen punto para comentar en
el video por que un endpoint publico no deberia poder auto-asignarse
admin.
