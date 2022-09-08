-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "todo_due" DROP NOT NULL;
