export interface TagDisplay {
  label: string;
  colorClass: string;
}
export function formatTag(key: string, value: string): TagDisplay[] {
  const tagDisplays: TagDisplay[] = [];

  if (key === "type" && Array.isArray(value)) {
    value.forEach((type) => {
      tagDisplays.push({
        label: capitalize(type),
        colorClass: "bg-green-100 text-green-800",
      });
    });
  }

  if (key === "amenity" && typeof value === "string") {
    tagDisplays.push({
      label: capitalize(value),
      colorClass: "bg-blue-100 text-blue-800",
    });
  }

  if (key.startsWith("diet:halal")) {
    if (value === "yes") {
      tagDisplays.push({
        label: "Halal",
        colorClass: "bg-green-100 text-green-800",
      });
    } else if (value === "no") {
      tagDisplays.push({
        label: "Non-halal",
        colorClass: "bg-gray-100 text-gray-800",
      });
    }
  }

  if (["delivery", "takeaway", "outdoor_seating"].includes(key)) {
    if (value === "yes") {
      tagDisplays.push({
        label: humanizeKey(key),
        colorClass: "bg-purple-100 text-purple-800",
      });
    }
  }
  function humanizeKey(key: string): string {
    return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return tagDisplays;
}

// export function formatTag(key: string, value: string): TagDisplay | null {

//   const tagDisplays: TagDisplay[] = []
//   //TO REMOVE AS THIS WAS FOR OVERPASS API
//   if (key === 'cuisine') {
//     return {
//       label: `${capitalize(value)} cuisine`,
//       colorClass: 'bg-yellow-100 text-yellow-800',
//     };
//   }

//   if (key === "type" && Array.isArray(value)) {
//     value.forEach((type) => {
//       tagDisplays.push({
//         label: capitalize(type),
//         colorClass: "bg-blue-100 text-blue-800",
//       });
//     });
//   }

//   if(key === 'amenity'){
//     return{
//       label: humanizeKey(value),
//       colorClass: 'bg-blue-100 text-blue-800'
//     }
//   }

//   if (key.startsWith('diet:halal')) {
//     if (value === 'yes') {
//       return {
//         label: 'Halal',
//         colorClass: 'bg-green-100 text-green-800',
//       };
//     } else if (value === 'no'){
//       return {
//         label: 'Non-halal',
//         colorClass: 'bg-gray-100 text-gray-800',
//       }
//     }
//     return null;
//   }

//   if (['delivery', 'takeaway', 'outdoor_seating'].includes(key)) {
//     if (value === 'yes') {
//       return {
//         label: humanizeKey(key),
//         colorClass: 'bg-purple-100 text-purple-800',
//       };
//     }
//     return null;
//   }

//   return null;
// }
