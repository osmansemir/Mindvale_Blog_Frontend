import { ModeToggle } from "@/components/ModeToggle";
import MELogo from "@/components/markdownEditor/MELogo";
import METitleField from "@/components/markdownEditor/METitleField";
import MEDescription from "@/components/markdownEditor/MEDescription";
import METags from "@/components/markdownEditor/METags";
import MEButtons from "@/components/markdownEditor/MEButtons";

function MEHeader() {
  return (
    <>
      <div className="flex w-full gap-4  justify-between font-bold items-center border-b px-6 h-[50px]">
        <MELogo />
        <ModeToggle className="" />
        {/* TODO: Change ModeToggle with a smaller switch */}
      </div>
      <div className="grid grid-cols-2  w-full gap-x-2 font-bold border-b px-6 h-[150px] pt-2">
        <METitleField className="h-1/2 gap-1" />
        <MEDescription className="h-1/2 gap-1" />
        <METags className="h-1/2 gap-0" />
        <div className="flex h-1/2 justify-end">
          <MEButtons />
        </div>
      </div>
    </>
  );
}
export default MEHeader;
