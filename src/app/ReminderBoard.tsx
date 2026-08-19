import { groupReminders } from "@/lib/groupReminders";
import { updateReminder, deleteReminder, toggleReminder } from "@/app/actions";
import ReminderBoardItem from "./ReminderBoardItem";

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
    <div className="space-y-3">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--color-taupe)" }}>
            {group.label}
          </p>
          <div className="space-y-2">
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