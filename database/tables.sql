drop schema if exists a18;
create schema a18;

create table a18.qr_code(
  id bigserial primary key,
  asset text,
  url text unique
);