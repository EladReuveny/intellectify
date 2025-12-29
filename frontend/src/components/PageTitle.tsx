type PageTitleProps = {
  title: string;
};

const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-full h-0.5 bg-linear-to-r from-transparent to-(--text-clr)" />
      <h1 className="text-4xl font-bold whitespace-nowrap">{title}</h1>
      <div className="w-full h-0.5 bg-linear-to-r from-(--text-clr) to-transparent" />
    </div>
  );
};

export default PageTitle;
