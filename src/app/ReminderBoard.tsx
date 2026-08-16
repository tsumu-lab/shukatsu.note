import { groupReminders } from "@/lib/groupReminders";
import { updateReminder, deleteReminder } from "@/app/actions";
import ReminderBoardItem from "./ReminderBoardItem";
import { updateReminder, deleteReminder, toggleReminder } from "@/app/actions";

type ReminderWithCompany = {
  id: number;
  title: string;
  dueDate: Date | null;
  memo: string | null;
  companyId: number | null;
  company: { id: number; name: string } | null;
};

export default function ReminderBoard({ reminders }: { reminders: ReminderWithCompany[] }) {
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
                toggleReminder={toggleReminder}
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