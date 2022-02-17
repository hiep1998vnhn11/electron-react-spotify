import { useState } from 'react';
export function useArray<T = any>(
  initValue: T[] | (() => T[]) = []
): {
  array: T[];
  add: any;
  remove: any;
  setArray: ((array: T[]) => any) | T[];
} {
  const [array, setArray] = useState<T[]>(
    typeof initValue === 'function' ? initValue() : initValue
  );
  const add = (item: T) => setArray((value) => [...value, item]);
  const remove = (item: T) =>
    setArray((value) => value.filter((v) => v !== item));
  return {
    array,
    add,
    remove,
    setArray,
  };
}
