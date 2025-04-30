import Lottie from "lottie-react";
import burgerAnimation from "@/assets/burgerAnimation.json"

export default function BurgerLoader() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Lottie
        animationData={burgerAnimation}
        loop={true}
        className="w-48 h-48"
      />
      <p className="text-md font-semibold text-gray-200 my-2">Fetching nearby restaurants...</p>
    </div>
  );
}
