CREATE VIRTUAL TABLE PersonsFTS USING fts4(
    id, username, first_name, second_name, email, created_at
);

INSERT INTO PersonsFTS(docid, id, username, first_name, second_name, email, created_at)
SELECT id, id, username, first_name, second_name, email, created_at FROM Persons;


--SELECT * FROM PersonsFTS
--WHERE PersonsFTS MATCH 'search_term*'
--LIMIT $itemsPerPage OFFSET $offset;
