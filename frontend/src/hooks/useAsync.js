import { useCallback, useEffect, useRef, useState } from "react";
export default function useAsync(loader, dependencies = []) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });
  const sequence = useRef(0);
  const reload = useCallback(async () => {
    const version = ++sequence.current;
    setState((old) => ({ ...old, loading: true, error: null }));
    try {
      const data = await loader();
      if (version === sequence.current)
        setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      if (version === sequence.current)
        setState((old) => ({ ...old, loading: false, error }));
      return null;
    }
  }, dependencies);
  useEffect(() => {
    reload();
    return () => {
      sequence.current++;
    };
  }, [reload]);
  return { ...state, reload };
}
