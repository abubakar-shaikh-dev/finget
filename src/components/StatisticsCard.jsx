export default function StatisticsCard({
  title,
  value,
  icon,
  iconBg,
  iconColor,
}) {
  return (
    <div
      key={title}
      className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
    >
      <div className="flex w-full justify-between">
        <div>
          <dt className="truncate text-lg font-medium text-gray-800">
            {title}
          </dt>
          <span className="font-normal text-sm text-gray-400">
            Apr 4 2024 - May 4 2024
          </span>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {value}
          </dd>
        </div>
        <div>
          <div
            style={{
              background: iconBg,
              color: iconColor,
              borderRadius: "0.4em",
              fontSize: "2.1em",
              padding: "0.3em",
            }}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
