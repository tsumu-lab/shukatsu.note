import { prisma } from "@/lib/prisma";
import { groupReminders } from "@/lib/groupReminders";
import { requireUserId } from "@/lib/auth-helpers";
import { updateReminder, deleteReminder } from "@/app/actions";
import ReminderBoardItem from "./ReminderBoardItem";

export default async function ReminderBoard() {
  const userId = await requireUserId();

  const reminders = await prisma.reminder.findMany({
    where: {
      userId,
      completed: false,
      deletedAt: null,
      OR: [{ companyId: null }, { company: { deletedAt: null } }],
    },
    include: { company: true },
  });

  const groups = groupReminders(reminders);

  if (groups.length === 0) return null;

  return (
    <div className="border rounded-lg mb-3 divide-y">
      {groups.map((group) => (
        <div key={group.label} className="px-4 py-2">
          <p className="text-xs font-semibold text-gray-500 mt-1 mb-1">{group.label}</p>
          <div className="space-y-1">
            {group.items.map((item) => (
              <ReminderBoardItem
                key={item.id}
                item={item}
                updateReminder={updateReminder}
                deleteReminder={deleteReminder}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}