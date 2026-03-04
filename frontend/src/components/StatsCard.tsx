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
      <span className="text-3xl font-bold">{statsCard.value}</span>
      <span className="text-(--text-clr)/60 text-sm font-medium mb-1">
        {statsCard.title}
      </span>
    </div>
  );
};

export default StatsCard;
