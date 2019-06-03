ALTER TABLE "Action" DROP CONSTRAINT "Action_author_fkey";
ALTER TABLE "Action" DROP CONSTRAINT "Action_comment_fkey";
ALTER TABLE "Action" DROP CONSTRAINT "Action_timeline_fkey";
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_timeline_fkey";
ALTER TABLE "Timeline" DROP CONSTRAINT "Timeline_author_fkey";
ALTER TABLE "_MentionsByUsers" DROP CONSTRAINT "_MentionsByUsers_A_fkey";
ALTER TABLE "_MentionsByUsers" DROP CONSTRAINT "_MentionsByUsers_B_fkey";

DROP INDEX "default$default.User.email._UNIQUE";
DROP INDEX "_MentionsByUsers_AB_unique";
DROP INDEX "_MentionsByUsers_B";

ALTER TABLE "Action" DROP CONSTRAINT "Action_pkey";
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_pkey";
ALTER TABLE "Timeline" DROP CONSTRAINT "Timeline_pkey";
ALTER TABLE "User" DROP CONSTRAINT "User_pkey";

DROP TABLE "Action";
DROP TABLE "Attachment";
DROP TABLE "Timeline";
DROP TABLE "User";
DROP TABLE "_MentionsByUsers";

CREATE TABLE "Action" (
"id" varchar(25) COLLATE "default" NOT NULL,
"type" text COLLATE "default" NOT NULL,
"content" text COLLATE "default",
"createdAt" timestamp(3),
"author" varchar(25) COLLATE "default",
"timeline" varchar(25) COLLATE "default",
"comment" varchar(25) COLLATE "default",
CONSTRAINT "Action_pkey" PRIMARY KEY ("id") 
)
WITHOUT OIDS;
ALTER TABLE "Action" OWNER TO "prisma";

CREATE TABLE "Attachment" (
"id" varchar(25) COLLATE "default" NOT NULL,
"type" text COLLATE "default" NOT NULL,
"url" text COLLATE "default" NOT NULL,
"createdAt" timestamp(3) NOT NULL,
"timeline" varchar(25) COLLATE "default",
CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id") 
)
WITHOUT OIDS;
ALTER TABLE "Attachment" OWNER TO "prisma";

CREATE TABLE "Timeline" (
"id" varchar(25) COLLATE "default" NOT NULL,
"title" text COLLATE "default" NOT NULL,
"content" text COLLATE "default" NOT NULL,
"isPublished" bool,
"createdAt" timestamp(3) NOT NULL,
"updatedAt" timestamp(3) NOT NULL,
"author" varchar(25) COLLATE "default",
CONSTRAINT "Timeline_pkey" PRIMARY KEY ("id") 
)
WITHOUT OIDS;
ALTER TABLE "Timeline" OWNER TO "prisma";

CREATE TABLE "User" (
"id" varchar(25) COLLATE "default" NOT NULL,
"username" text COLLATE "default" NOT NULL,
"email" text COLLATE "default" NOT NULL,
"password" text COLLATE "default" NOT NULL,
"createdAt" timestamp(3) NOT NULL,
CONSTRAINT "User_pkey" PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE UNIQUE INDEX "default$default.User.email._UNIQUE" ON "User" USING btree ("email" "pg_catalog"."text_ops" ASC);
ALTER TABLE "User" OWNER TO "prisma";

CREATE TABLE "_MentionsByUsers" (
"A" varchar(25) COLLATE "default" NOT NULL,
"B" varchar(25) COLLATE "default" NOT NULL
)
WITHOUT OIDS;
CREATE UNIQUE INDEX "_MentionsByUsers_AB_unique" ON "_MentionsByUsers" USING btree ();
CREATE INDEX "_MentionsByUsers_B" ON "_MentionsByUsers" USING btree ();
ALTER TABLE "_MentionsByUsers" OWNER TO "prisma";


ALTER TABLE "Action" ADD CONSTRAINT "Action_author_fkey" FOREIGN KEY ("author") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE NO ACTION;
ALTER TABLE "Action" ADD CONSTRAINT "Action_comment_fkey" FOREIGN KEY ("comment") REFERENCES "Action" ("id") ON DELETE SET NULL ON UPDATE NO ACTION;
ALTER TABLE "Action" ADD CONSTRAINT "Action_timeline_fkey" FOREIGN KEY ("timeline") REFERENCES "Timeline" ("id") ON DELETE SET NULL ON UPDATE NO ACTION;
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_timeline_fkey" FOREIGN KEY ("timeline") REFERENCES "Timeline" ("id") ON DELETE SET NULL ON UPDATE NO ACTION;
ALTER TABLE "Timeline" ADD CONSTRAINT "Timeline_author_fkey" FOREIGN KEY ("author") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE NO ACTION;
ALTER TABLE "_MentionsByUsers" ADD CONSTRAINT "_MentionsByUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Timeline" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "_MentionsByUsers" ADD CONSTRAINT "_MentionsByUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

