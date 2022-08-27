INSERT INTO department (name)
VALUES
  ('Baking'),
  ('Sleeping'),
  ('Fishing');

INSERT INTO role (title, salary, department_id)
VALUES
  ('Baker', 14000, 1),
  ('Supplier', 14000, 1),
  ('Bed tester', 82000, 2),
  ('Nap Developer', 25000, 2),
  ('Baiter', 48000, 3),
  ('Fisher', 50000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Sam', 'Smelter', 1, 1),
  ('Jeff', 'Wolf', 2, null),
  ('Jeff', 'Jeffreys', 1, null),
  ('Brittney', 'Qui', 3, 2),
  ('Bob', 'Steve', 4, null),
  ('Franklin', 'Board', 5, null),
  ('Kait', 'Feld', 6, null);