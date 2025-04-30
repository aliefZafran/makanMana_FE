import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import TopPicks from "./TopPicks";
import { Button } from "./ui/button";
import { resetAppAtom } from "@/atoms/resetAppAtom";
import { useAtom } from "jotai";

export default function FinalSection() {
  const [, resetApp] = useAtom(resetAppAtom);

  return (
    <div className="text-center flex flex-col gap-y-4 mt-6">
      <h2 className="text-xl font-semibold mb-2">You've seen all! 🎉</h2>
      <div className="flex flex-col gap-y-4 text-center mt-6">
        <Dialog>
          <DialogTrigger className="bg-green-500 rounded-xl hover:bg-green-700">
            <span className="font-semibold">View Top Picks</span>
          </DialogTrigger>
          <DialogContent className="w-[80vw]">{<TopPicks />}</DialogContent>
        </Dialog>
        <Button onClick={resetApp}>Play Again</Button>
      </div>
    </div>
  );
}
