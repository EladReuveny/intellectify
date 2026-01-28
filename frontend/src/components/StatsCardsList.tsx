import StatsCard, { type StatsData } from "./StatsCard";

type StatsCardsListProps = {
  statsCards: StatsData[];
};

const StatsCardsList = ({ statsCards }: StatsCardsListProps) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
      {statsCards.map((s) => (
        <StatsCard key={s.id} statsCard={s} />
      ))}
    </div>
  );
};

export default StatsCardsList;
