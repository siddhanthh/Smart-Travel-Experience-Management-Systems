export default function NotificationBadge({ count }) {
  if (!count) return null;
  return (
    <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
      {count > 99 ? '99+' : count}
    </span>
  );
}
