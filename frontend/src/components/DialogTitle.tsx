type DialogTitleProps = {
  title: string;
};

const DialogTitle = ({ title }: DialogTitleProps) => {
  return (
    <div className="flex items-center gap-4 mb-5 whitespace-nowrap">
      <div className="w-full h-0.5 bg-linear-to-r from-transparent to-(--text-clr)" />
      <h1 className="text-4xl font-bold">{title}</h1>
      <div className="w-full h-0.5 bg-linear-to-r from-(--text-clr) to-transparent" />
    </div>
  );
};

export default DialogTitle;
