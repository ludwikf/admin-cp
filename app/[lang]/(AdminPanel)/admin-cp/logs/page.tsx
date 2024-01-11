import LogsMain from "@/app/ui/logs/logsMain";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/libs/dictionary";

export default async function Logs({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { logs } = await getDictionary(lang);
  return (
    <main className="flex min-h-[100dvh]">
      <div className="my-[25px] flex w-screen lg:h-auto flex-col short:justify-start lg:justify-center items-center">
        <div className="w-[100%] short:w-[100%] lg:w-[90%] short:h-[auto] lg:h-[16%] flex justify-center short:justify-center lg:justify-start mb-[20px] short:mb-[20px] lg:mb-[0px]">
          <div className="flex flex-col items-center short:flex lg:block">
            <h1 className="text-3xl font-bold">{logs.title}</h1>
            <p className="text-mainTheme mb-1">{logs.description}</p>
          </div>
        </div>
        <div className="w-[90%] lg:h-[84%] flex flex-col items-start">
          <LogsMain />
        </div>
      </div>
    </main>
  );
}
