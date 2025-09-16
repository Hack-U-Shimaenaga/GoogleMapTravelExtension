import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlaceCard from "./placeCard";
import { useEffect } from "react";

function SortableItem({ id, address }) {
  console.log("address?")
  console.log(address);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: "1rem",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <PlaceCard address={address} />
    </div>
  );
}

export default function SortablePlaceList({ initialAddresses }) {
  console.log("initialAddresses");
  console.log(initialAddresses)
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    setAddresses(initialAddresses);
  }, [initialAddresses]); // initialAddresses が変わったら更新
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setAddresses((items) => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };


  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
    <SortableContext
      items={addresses}  // ← index ではなく address を渡す
      strategy={verticalListSortingStrategy}
    >
      {addresses.map((address) => (
        <SortableItem key={address} id={address} address={address} />
      ))}
    </SortableContext>

  </DndContext>

  );
}
