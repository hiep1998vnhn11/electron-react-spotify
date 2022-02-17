import { useState, useCallback } from 'react';

export function useToggle(initialValue?: boolean) {
  const [value, setValue] = useState(initialValue || false);
  const toggle = useCallback(
    (toggleValue?: any) => {
      if (typeof toggleValue === 'boolean') return setValue(toggleValue);
      return setValue((t) => !t);
    },
    [setValue]
  );

  return [value, toggle] as const;
}
