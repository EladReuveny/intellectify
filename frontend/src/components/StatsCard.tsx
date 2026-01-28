export type StatsData = {
  id: number;
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor?: string;
  textColor?: string;
};

type StatsCardProps = {
  statsCard: StatsData;
};

const StatsCard = ({ statsCard }: StatsCardProps) => {
  return (
    <div className="flex flex-col items-center gap-2 bg-(--text-clr)/15 p-4 rounded-lg shadow-lg hover:bg-(--text-clr)/25">
      <span
        className={`text-2xl p-2 rounded inline-block ${statsCard.bgColor} ${statsCard.textColor}`}
      >
        {statsCard.icon}
      </span>
      <span className="text-3xl font-bold text-gray-900 dark:text-white">
        {statsCard.value}
      </span>
      <span className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
        {statsCard.title}
      </span>
    </div>
  );
};

export default StatsCard;
