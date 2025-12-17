pasos para crear la bd

cd ”C:\ProgramFiles\PostgreSQL\17\bin" o donde tengan el postgresql instalado

psql -U postgres

CREATE DATABASE bdgrupo26;

CREATE USER grupo26 WITH PASSWORD '12345';

GRANT ALL PRIVILEGES ON DATABASE bdgrupo26 TO grupo26;

\c bdgrupo26

ALTER DEFAULT PRIVILEGES GRANT ALL ON TABLES TO grupo26;
ALTER DEFAULT PRIVILEGES GRANT ALL ON SEQUENCES TO grupo26;
ALTER DEFAULT PRIVILEGES GRANT ALL ON FUNCTIONS TO grupo26;

GRANT ALL PRIVILEGES ON SCHEMA public TO grupo26;

El usuario para ingresar al sistema se generan automaticamente una vez se ejecuta el programa.
Usuario: admin
Contraseña: admin

Para ejecutar las pruebas unitarias, ingresar el siguiente comando:

.\mvnw clean verify

Para verificar el porcentaje cubierto en las clases Huesped, Reserva, Usuario, ir a la carptea raiz del proyecto, 
por ejemplo: C:\Users\user\Documents\tpdisenogrupo26\target\site\jacoco/index