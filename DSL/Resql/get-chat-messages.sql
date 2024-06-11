SELECT m.base_id      AS id,
       m.chat_base_id AS chat_id,
       m.content,
       m.buttons,
       m.event,
       m.author_id,
       m.author_timestamp,
       m.author_first_name,
       m.author_last_name,
       m.author_role,
       m.forwarded_by_user,
       m.forwarded_from_csa,
       m.forwarded_to_csa,
       rating,
       m.created,
       updated,
       u.csa_title
FROM message m
LEFT JOIN "user" u ON m.author_id = u.id_code
WHERE m.id IN (SELECT max(id) FROM message WHERE chat_base_id = :chatId GROUP BY base_id)
ORDER BY created ASC;
