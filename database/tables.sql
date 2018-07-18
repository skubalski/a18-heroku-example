drop schema if exists a18 cascade;
create schema a18;

create table a18.qr_code(
  id bigserial primary key,
  asset text,
  s3_object_name text unique
);

create table a18.csv_export(
  id bigserial primary key,
  uuid1 text,
  uuid2 text,
  payload json
);

alter table a18.qr_code add foreign key (asset) references salesforce.asset__c(sfid);