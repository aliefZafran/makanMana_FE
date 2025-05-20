// V4 no rotation on stacked cards, just scale to the front but issue is swiping does not feel smooth
import { Restaurant } from "@/types";
import { formatTag, TagDisplay } from "@/utils/tagFormat";
import {
  motion,
  PanInfo,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { radiusAtom } from "@/atoms/restaurantAtoms";
import { useEffect, useState } from "react";
import TagList from "./TagList";
import { useAtom } from "jotai";
import StarRating from "@/utils/StarRating";
import { FaStar } from "react-icons/fa";
import { Star } from "lucide-react";

export type SwipeDirection = "left" | "right" | "up";

type Props = {
  restaurant: Restaurant;
  onSwipe: (dir: SwipeDirection, restaurant: Restaurant) => void;
  index: number;
  stackSize: number;
};

export default function RestaurantCard({
  restaurant,
  onSwipe,
  index,
  stackSize,
}: Props) {
  const tags: TagDisplay[] = Object.entries(restaurant.tags || {}).flatMap(
    ([k, v]) => {
      if (k === "cuisine") {
        return v
          .split(";")
          .map((raw) => raw.replace(/_/g, " "))
          .map((clean) => ({
            label: `${clean[0].toUpperCase()}${clean.slice(1)} cuisine`,
            colorClass: "bg-yellow-100 text-yellow-800",
          }));
      } else {
        return formatTag(k, v); // `formatTag` now always returns an array
      }
    }
  );

  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacityX = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const opacityY = useTransform(y, [-150, 0, 150], [0, 1, 0]);
  const [opacity, setOpacity] = useState(1);
  const [flashDirection, setFlashDirection] = useState<SwipeDirection | null>(
    null
  );

  useEffect(() => {
    const update = () => setOpacity(Math.min(opacityX.get(), opacityY.get()));
    const ux = opacityX.onChange(update);
    const uy = opacityY.onChange(update);
    return () => {
      ux();
      uy();
    };
  }, [opacityX, opacityY]);

  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const isFront = index === stackSize - 1;
  const rotate = useTransform(() => {
    if (isFront) {
      return `${rotateRaw.get()}deg`;
    }
    return `0deg`;
  });

  // Animate scale with offset for stacking
  useEffect(() => {
    const scale = isFront ? 1 : 0.98 - (stackSize - 1 - index) * 0.02;
    const offsetY = (stackSize - 1 - index) * 8;
    controls.start({
      scale,
      y: offsetY,
      transition: {
        type: "spring",
        stiffness: 160,
        damping: 14,
      },
    });
  }, [isFront, index, stackSize, controls]);

  const animateFlight = (dir: SwipeDirection) => {
    setFlashDirection(dir);
    setTimeout(() => {
      setFlashDirection(null); // hide flash after 300ms
    }, 300);

    const w = window.innerWidth * 0.3;
    const h = window.innerHeight * 0.6;
    const flyX = dir === "left" ? -w : dir === "right" ? w : 0;
    const flyY = dir === "up" ? -h : 0;

    controls
      .start({
        x: flyX,
        y: flyY,
        opacity: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
      })
      .then(() => {
        onSwipe(dir, restaurant);
      });
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    let dir: SwipeDirection | null = null;
    if (Math.abs(info.offset.x) > 140) {
      dir = info.offset.x > 0 ? "right" : "left";
    } else if (info.offset.y < -120) {
      dir = "up";
    }

    if (!dir) {
      controls.start({
        x: 0,
        y: 0,
        transition: { type: "spring", stiffness: 200, damping: 20 },
      });
      return;
    }
    animateFlight(dir);
  };

  const handleButtonSwipe = (dir: SwipeDirection) => animateFlight(dir);

  const [glow, setGlow] = useState(false);
  useEffect(() => {
    if (!isFront) return;

    const timeout = setTimeout(() => {
      setGlow(true);
    }, 8000);

    return () => clearTimeout(timeout); // reset when component re-renders
  }, [restaurant.id, isFront]);

  const [radius] = useAtom(radiusAtom);

  return (
    <motion.div
      key={restaurant.id}
      style={{
        x,
        y,
        opacity: isFront ? opacity : 1,
        rotate,
        zIndex: index,
        backgroundImage: `url(${restaurant.photo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      drag={isFront}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{
        scale: isFront ? 1 : 0.94,
      }}
      className="absolute top-0 left-0 right-0 mx-auto w-60 md:w-76 h-90 md:h-100 bg-[var(--color-cream)] border border-[var(--color-card-border)]
                 rounded-2xl p-3 select-none touch-none cursor-grab active:cursor-grabbing flex flex-col justify-end gap-y-2 md:gap-y-4"
    >
      {flashDirection && (
        <motion.div
          key={flashDirection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`absolute inset-0 flex items-center justify-center z-50
            ${flashDirection === "left" && "bg-red-500"}
            ${flashDirection === "right" && "bg-green-500"}
            ${flashDirection === "up" && "bg-blue-500"}
            text-white font-bold text-2xl rounded-2xl pointer-events-none`}
        >
          {flashDirection === "left" && "Nope 👎"}
          {flashDirection === "right" && "Liked 👍"}
          {flashDirection === "up" && "Selected 🎯"}
        </motion.div>
      )}

      <div className="flex flex-col gap-y-2">
        <div className="text-left">
          {restaurant.rating ? (
            <div className="flex items-center gap-x-1.5 p-1 bg-white/80 rounded-lg max-w-fit">
              <p className="text-black font-medium text-xs">
                {restaurant.rating}
              </p>
              <FaStar className="text-yellow-400" />
            </div>
          ) : null}

          <h2 className="text-base md:text-xl font-bold text-white text-shadow-lg">
            {restaurant.name}
          </h2>
          <p className="text-white text-xs md:text-sm font-semibold text-shadow-lg">
            {restaurant.distance_km
              ? `${restaurant.distance_km.toFixed(1)} km away`
              : `< ${radius / 1000} km away`}
          </p>
        </div>
        {tags.length === 0 ? null : <TagList tags={tags} />}
      </div>

      <div className="flex items-center justify-center md:justify-between">
        <button
          onClick={() => handleButtonSwipe("left")}
          className="hidden md:block bg-red-400/60 hover:bg-red-500/80 rounded-full !px-4 text-white"
        >
          🙅🏻‍♀️
        </button>
        <div className={`relative ${glow ? "animate-glow-border" : ""}`}>
          <button
            onClick={() => {
              setGlow(false);
              handleButtonSwipe("up");
            }}
            className="relative z-10 bg-blue-500 hover:bg-blue-600 text-white !text-sm !font-semibold rounded-md !px-6 md:!px-5 !py-1 md:!py-2"
          >
            I want this!
          </button>
        </div>

        <button
          onClick={() => handleButtonSwipe("right")}
          className="hidden md:block bg-green-400/60 hover:bg-green-500/80 !px-4 rounded-full text-white"
        >
          🙆🏼‍♂️
        </button>
      </div>
    </motion.div>
  );
}
