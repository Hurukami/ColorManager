import { Group } from "@/types/color";

type Props = {
  groups: Group[];
  groupId: string;
  setGroupId: (id: string) => void;
};

export default function GroupSelectSection({
  groups,
  groupId,
  setGroupId,
}: Props) {
  return (
    <div>
      <label className="text-sm font-medium">グループ</label>

      <select
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
        className="w-full border p-2 rounded mt-1"
      >
        <option value="">グループなし</option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>
    </div>
  );
}
