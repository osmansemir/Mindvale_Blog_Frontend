import { ModeToggle } from "@/components/ModeToggle";
import MELogo from "@/components/markdownEditor/MELogo";
import METitleField from "@/components/markdownEditor/METitleField";
import MEDescription from "@/components/markdownEditor/MEDescription";
import METags from "@/components/markdownEditor/METags";
import MEButtons from "@/components/markdownEditor/MEButtons";

function MEHeader() {
  return (
    <>
      <div className="flex w-full gap-4  justify-between font-bold items-center border-b px-6 h-14">
        <MELogo />
        <ModeToggle className="self-end" />
      </div>
      <div className="flex  w-screen  justify-between font-bold items-center border-b px-6 min-h-16 py-4">
        <METitleField />
        <MEDescription />
        <METags />
        <MEButtons />
      </div>
    </>
  );
}
export default MEHeader;
