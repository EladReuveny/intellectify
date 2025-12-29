type LoadingProps = {};

const Loading = ({}: LoadingProps) => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-4 border-gray-400 border-t-(--text-clr) animate-[spin_3s_linear_infinite]"></div>
    </div>
  );
};

export default Loading;
