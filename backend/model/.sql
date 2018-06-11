CREATE TABLE teacher ( --子表
        type      varchar(40),
        status    varchar(20) default '审核中',
        CONSTRAINT teacher_pkey PRIMARY KEY (id)
) INHERITS (auth);

CREATE TABLE student ( --子表
        grade     int,
        major     varchar(40),
        CONSTRAINT student_pkey PRIMARY KEY (id)
) INHERITS (auth)