INSERT INTO "user" VALUES
(1, 'axel canton', 'axel', 'canton', 'axelcanton@gmail.com', 'Male', 'abcd', true, '', true, NOW(), NOW(), 'IG'),
(2, 'jean pierre', 'jean', 'pierre', 'jeanpierre@gmail.com', 'Male', 'abcd', true, '', true, NOW(), NOW(), 'IG'),
(3, 'henry trans', 'henry', 'tran', 'henrytran@gmail.com', 'Male', 'abcd', true, '', true, NOW(), NOW(), 'MEA'),
(4, 'rémy fougère', 'rémy', 'fougère', 'remyfougere@gmail.com', 'Male', 'abcd', true, '', true, NOW(), NOW(), 'MI'),
(5, 'julie gonzales', 'julie', 'gonzales', 'juliegonzales@gmail.com', 'Female', 'abcd', true, '', true, NOW(), NOW(), 'GBA');

INSERT INTO location VALUES
(1, 'France', '13290', 'Aix en provence', 43.531924, 5.450328, 1),
(2, 'France', '34000', 'Montpellier', 43.61428, 3.884008, 1),
(3, 'France', '19100', 'Brive-la-Gaillarde', 45.157838, 1.525526, 2),
(4, 'France', '75001 ', 'Paris', 48.856926, 2.344693, 3),
(5, 'France', '14500', 'La petite motte', 48.840669, -0.901971, 4),
(6, 'France', '44200', 'Nantes', 47.204993, -1.556104, 5),
(7, 'France', '17000', 'La Rochelle', 46.169443, -1.151022, 5);

INSERT INTO reservation VALUES
(1, 'this is a message from axel to jean', 1, '2022-01-01 09:00:35', 1, 2, 3),
(2, 'this is a message from axel to jean', 0, '2022-02-27 09:00:35', 1, 2, 3),
(3, 'this is a message from julie to axel', 1, '2022-01-01 09:00:35', 5, 1, 1),
(4, 'this is a message from henry to axel', -1, '2022-01-01 09:00:35', 3, 1, 2);