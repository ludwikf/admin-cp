const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-3xl bg-secondTheme p-2 shadow-sm w-[100%] h-[100%]`}
    >
      <div className="flex p-5">
        <div className="h-6 w-10 rounded-md bg-[#333]" />
        <div className="ml-2 h-6 w-24 rounded-md bg-[#333] text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-[#444] px-4 py-14">
        <div className="h-7 w-20 rounded-md bg-[#333]" />
      </div>
      <div className="flex p-4">
        <div className="h-6 w-10 rounded-md bg-[#333]" />
        <div className="ml-2 h-6 w-24 rounded-md bg-[#333] text-sm font-medium" />
      </div>
    </div>
  );
}
