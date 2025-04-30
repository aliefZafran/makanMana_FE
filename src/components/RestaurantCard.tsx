import { Restaurant } from "@/types";
import { formatTag, TagDisplay } from "@/utils/tagFormat";
import {
  motion,
  PanInfo,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";

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
        const tag = formatTag(k, v);
        return tag ? [tag] : [];
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

  const isFront = index === stackSize - 1;

  // const rotate = useTransform(x, (val) => {
  //   if (!isFront) return `${index % 2 ? 4 : -4}deg`;
  //   return `${(val / 150) * 15}deg`; // smoothed
  // });

  // Animate scale + rotate when card becomes front
  useEffect(() => {
    controls.start({
      scale: isFront ? 1 : 0.94,
      rotate: isFront ? "0deg" : `${index % 2 ? 4 : -4}deg`,
      transition: {
        type: "spring",
        stiffness: 160,
        damping: 14,
      },
    });
  }, [isFront, index, controls]);

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
    if (Math.abs(info.offset.x) > 80) {
      dir = info.offset.x > 0 ? "right" : "left";
    } else if (info.offset.y < -80) {
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

  return (
    <motion.div
      key={restaurant.id}
      style={{
        x,
        y,
        opacity,
        zIndex: index,
      }}
      drag={isFront}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{
        scale: isFront ? 1 : 0.98,
        rotate: isFront ? "0deg" : `${index % 2 ? 4 : -4}deg`,
      }}
      className="absolute top-0 left-0 right-0 mx-auto w-72 md:w-80 h-72 bg-[var(--color-cream)] border-2 border-[var(--color-card-border)]
                 rounded-2xl p-6 select-none touch-none cursor-grab active:cursor-grabbing flex flex-col justify-between"
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

      <div className="flex flex-col gap-y-4">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-700">
            {restaurant.name}
          </h2>
          <p className="text-gray-500 text-sm">
            {restaurant.distance_km.toFixed(1)} km away
          </p>
        </div>
        <div className="flex flex-wrap max-h-24 overflow-y-auto justify-center gap-2">
          {tags.map((t, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-full ${t.colorClass} text-xs md:text-sm`}
            >
              {t.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-x-2">
        <button
          onClick={() => handleButtonSwipe("left")}
          className="hidden md:block bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-white"
        >
          👎
        </button>
        <button
          onClick={() => handleButtonSwipe("up")}
          className="bg-blue-500 hover:bg-blue-600 rounded-xl text-white"
        >
          <span className="text-xs md:text-base">I want this!</span>
        </button>
        <button
          onClick={() => handleButtonSwipe("right")}
          className="hidden md:block bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl text-white"
        >
          👍
        </button>
      </div>
    </motion.div>
  );
}

// import { Restaurant } from "@/types";
// import { formatTag, TagDisplay } from "@/utils/tagFormat";
// import {
//   motion,
//   PanInfo,
//   useAnimation,
//   useMotionValue,
//   useTransform,
// } from "framer-motion";
// import { useEffect, useState } from "react";

// export type SwipeDirection = "left" | "right" | "up";

// type Props = {
//   restaurant: Restaurant;
//   onSwipe: (dir: SwipeDirection, restaurant: Restaurant) => void;
//   // index within the *visible* stack (0 = bottom, stackSize-1 = front)
//   index: number;
//   stackSize: number;
// };

// export default function RestaurantCard({
//   restaurant,
//   onSwipe,
//   index,
//   stackSize,
// }: Props) {
//   // tags formatting…
//   const tags: TagDisplay[] = Object.entries(restaurant.tags || {})
//   .flatMap(([k, v]) => {
//     if (k === "cuisine") {
//       return v
//         .split(";")               // ["steak_house","chinese","asian"]
//         .map(raw => raw.replace(/_/g, " "))  // ["steak house","chinese","asian"]
//         .map(clean => ({
//           label: `${clean[0].toUpperCase()}${clean.slice(1)} cuisine`,
//           colorClass: "bg-yellow-100 text-yellow-800",
//         }));
//     } else {
//       const tag = formatTag(k, v);
//       return tag ? [tag] : [];
//     }
//   });
//   // const tags = Object.entries(restaurant.tags || {})
//   //   .map(([k, v]) => formatTag(k, v))
//   //   .filter((t): t is TagDisplay => t !== null);

//   // animation controls + motion values
//   const controls = useAnimation();
//   const x = useMotionValue(0);
//   const y = useMotionValue(0);
//   const opacityX = useTransform(x, [-80, 0, 80], [0, 1, 0]);
//   const opacityY = useTransform(y, [-150, 0, 150], [0, 1, 0]);
//   const [opacity, setOpacity] = useState(1);

//   // combine X/Y fade
//   useEffect(() => {
//     const update = () => setOpacity(Math.min(opacityX.get(), opacityY.get()));
//     const ux = opacityX.onChange(update);
//     const uy = opacityY.onChange(update);
//     return () => {
//       ux();
//       uy();
//     };
//   }, [opacityX, opacityY]);

//   // small static tilt on the back cards
//   const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
//   const isFront = index === stackSize - 1;

//   // scale the front card to 1, the others slightly down
//   useEffect(() => {
//     controls.start({ scale: isFront ? 1 : 0.98 });
//   }, [isFront, controls]);

//   const rotate = useTransform(() => {
//     if (isFront) {
//       return `${rotateRaw.get()}deg`;
//     }
//     return `${index % 2 ? 4 : -4}deg`;
//   });

//   // Shared fly-off animation
//   function animateFlight(dir: SwipeDirection) {
//     const w = window.innerWidth * 0.3;
//     const h = window.innerHeight * 0.6;
//     const flyX = dir === "left" ? -w : dir === "right" ? w : 0;
//     const flyY = dir === "up" ? -h : 0;

//     controls
//       .start({
//         x: flyX,
//         y: flyY,
//         opacity: 0,
//         transition: {
//           duration: 0.5,
//           ease: [0.25, 0.1, 0.25, 1], // nice “easeOut”
//         },
//       })
//       .then(() => {
//         onSwipe(dir, restaurant);
//       });
//   }

//   // Drag end handler: decide dir, either spring back or fly
//   const handleDragEnd = (_: any, info: PanInfo) => {
//     let dir: SwipeDirection | null = null;
//     if (Math.abs(info.offset.x) > 80) {
//       dir = info.offset.x > 0 ? "right" : "left";
//     } else if (info.offset.y < -80) {
//       dir = "up";
//     }

//     if (!dir) {
//       // snap back
//       controls.start({
//         x: 0,
//         y: 0,
//         transition: { type: "spring", stiffness: 200, damping: 20 },
//       });
//       return;
//     }
//     animateFlight(dir);
//   };

//   // Button handler
//   const handleButtonSwipe = (dir: SwipeDirection) => animateFlight(dir);

//   return (
//     <motion.div
//       key={restaurant.id}
//       style={{
//         gridRow: 1,
//         gridColumn: 1,
//         x,
//         y,
//         opacity,
//         rotate,
//         zIndex: index,
//       }}
//       drag={isFront}
//       dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
//       onDragEnd={handleDragEnd}
//       animate={controls}
//       className="absolute top-0 left-0 right-0 mx-auto w-72 md:w-80 h-72 bg-[var(--color-cream)] border-2 border-[var(--color-card-border)]
//                  rounded-2xl p-6 select-none touch-none cursor-grab active:cursor-grabbing flex flex-col justify-between"
//     >
//       <div className="flex flex-col gap-y-4">
//         {/* Header */}
//         <div className="text-center">
//           <h2 className="text-xl md:text-2xl font-bold text-gray-700">
//             {restaurant.name}
//           </h2>
//           <p className="text-gray-500 text-sm">
//             {restaurant.distance_km.toFixed(1)} km away
//           </p>
//         </div>

//         {/* Tags */}
//         <div className="flex flex-wrap max-h-24 overflow-y-auto justify-center gap-2">
//           {tags.map((t, i) => (
//             <span key={i} className={`px-3 py-1 rounded-full ${t.colorClass} text-xs md:text-sm`}>
//               {t.label}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-center gap-x-2">
//         <button
//           onClick={() => handleButtonSwipe("left")}
//           className="hidden md:block bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-white"
//         >
//           👎
//         </button>
//         <button
//           onClick={() => handleButtonSwipe("up")}
//           className="bg-blue-500 hover:bg-blue-600 rounded-xl text-white"
//         >
//           <span className="text-xs md:text-base">I want this!</span>
//         </button>
//         <button
//           onClick={() => handleButtonSwipe("right")}
//           className="hidden md:block bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl text-white"
//         >
//           👍
//         </button>
//       </div>
//     </motion.div>
//   );
// }
