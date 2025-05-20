import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TagDisplay } from "@/utils/tagFormat"; // Adjust path as necessary

interface TagListProps {
  tags: TagDisplay[];
}

export default function TagList({ tags }: TagListProps) {
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tagRef.current;
    if (el) {
      requestAnimationFrame(() => {
        setShowToggle(el.scrollHeight > el.offsetHeight);
      });
    }
  }, [tags, expanded]);

  return (
    <div className="relative flex">
      <motion.div
        ref={tagRef}
        animate={{ height: expanded ? "auto" : "2rem" }}
        className={`transition-all duration-300 flex flex-wrap items-center ${
          expanded ? "max-h-18 overflow-y-auto" : "overflow-hidden"
        } min-h-6 justify-start gap-2`}
      >
        {tags.map((tag, i) => (
          <span
            key={i}
            className={`${tag.colorClass} px-2 py-1 rounded-lg font-semibold text-xs md:text-sm`}
          >
            {tag.label}
          </span>
        ))}
      </motion.div>

      {showToggle && (
        <div>
          <button
            className="text-xs rounded-full !p-1 m-0 focus:outline-none"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
      )}
    </div>
  );
}

// import { useRef, useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { ChevronDown, ChevronUp } from "lucide-react";

// export default function TagList({ tags }: { tags: string[] }) {
//   const [expanded, setExpanded] = useState(false);
//   const [showToggle, setShowToggle] = useState(false);
//   const tagRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const el = tagRef.current;
//     if (el) {
//       requestAnimationFrame(() => {
//         setShowToggle(el.scrollHeight > el.offsetHeight);
//       });
//     }
//   }, [tags, expanded]);

//   return (
//     <div className="relative flex">
//       <motion.div
//         ref={tagRef}
//         animate={{ height: expanded ? "auto" : "2rem" }}
//         className={`transition-all duration-300 flex flex-wrap items-center ${expanded? "max-h-18 overflow-y-auto" : "overflow-hidden"} min-h-6 justify-start gap-2`}
//       >
//         {tags.map((tag, i) => (
//           <span
//             key={i}
//             className={`bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg font-semibold text-xs md:px-3 md:text-sm`}
//           >
//             {tag}
//           </span>
//         ))}
//       </motion.div>

//       {showToggle && (
//         <div className="">
//           <button
//             className="text-xs  rounded-full !p-1 m-0 focus:outline-none focus:ring-0 active:outline-none active:ring-0"
//             onClick={() => setExpanded(!expanded)}
//           >
//             {expanded ? <ChevronUp /> : <ChevronDown />}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
