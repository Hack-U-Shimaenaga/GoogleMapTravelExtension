import React, { useState, useEffect } from "react";
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

function SortableItem({ place, onChange }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: place.address });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: "1rem",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <PlaceCard
        address={place.address}
        todo={place.todo}
        time={place.time}
        dragHandleProps={listeners}
        onChange={(updated) => onChange(place.address, updated)}
      />

    </div>
  );
}

export default function SortablePlaceList({ initialAddresses, onOrderChange }) {
  const [addresses, setAddresses] = useState([]);
  const [places, setPlaces] = useState([]);

  // 初回のみ初期化
  useEffect(() => {
    if (places.length === 0 && initialAddresses.length > 0) {
      const initialPlaces = initialAddresses.map(addr => ({
        address: addr,
        todo: "観光",
        time: ""
      }));
      setPlaces(initialPlaces);
      setAddresses(initialAddresses);
    }
  }, [initialAddresses, places.length]);

  const handlePlaceChange = (address, updated) => {
  setPlaces(prev => {
    const newPlaces = prev.map(p => (p.address === address ? { ...p, ...updated } : p));

    // 親にも通知（並び替え以外の変更も）
    if (onOrderChange) {
      onOrderChange(addresses, newPlaces);
    }

    return newPlaces;
  });
};


  const sensors = useSensors(useSensor(PointerSensor));

const handleDragEnd = (event) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  const oldIndex = addresses.findIndex(a => a === active.id);
  const newIndex = addresses.findIndex(a => a === over.id);

  // 並び替え後の新しい配列を作成
  const newAddresses = arrayMove(addresses, oldIndex, newIndex);
  const newPlaces = arrayMove(places, oldIndex, newIndex);

  // state を一度だけ更新
  setAddresses(newAddresses);
  setPlaces(newPlaces);

  // 親にも通知
  if (onOrderChange) {
    onOrderChange(newAddresses, newPlaces);
  }
};




  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={addresses}
          strategy={verticalListSortingStrategy}
        >
          {places.map(place => (
            <SortableItem
              key={place.address}
              place={place}
              onChange={handlePlaceChange}
            />
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
}
