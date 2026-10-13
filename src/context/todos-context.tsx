/**
 * Shared todo list state, persisted with AsyncStorage so tasks survive app restarts.
 * Provided in `src/app/_layout.tsx` so every screen (List, Settings) sees the same data.
 *
 * Docs: https://docs.expo.dev/versions/latest/sdk/async-storage/
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export type Todo = {
  id: string;
  text: string;
  done: boolean;
};

const STORAGE_KEY = '@todolist:todos:v1';

type TodosContextValue = {
  todos: Todo[];
  isLoading: boolean;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  clearCompleted: () => void;
};

const TodosContext = createContext<TodosContextValue | null>(null);

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseTodos(raw: string | null): Todo[] | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (item): item is Todo =>
        !!item &&
        typeof item === 'object' &&
        typeof (item as Todo).id === 'string' &&
        typeof (item as Todo).text === 'string',
    );
  } catch {
    return null;
  }
}

export function TodosProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hydrated = useRef(false);

  // Load persisted tasks once on mount.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const stored = parseTodos(raw);
        if (!cancelled && stored) setTodos(stored);
      } catch {
        // Ignore read errors and start with an empty list.
      } finally {
        hydrated.current = true;
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Persist on every change after the initial load (skip the hydration render).
  useEffect(() => {
    if (!hydrated.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos)).catch(() => {
      // Ignore write errors; the in-memory list still works.
    });
  }, [todos]);

  const addTodo = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [...prev, { id: createId(), text: trimmed, done: false }]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)));
  }, []);

  const removeTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.done));
  }, []);

  const value = useMemo(
    () => ({ todos, isLoading, addTodo, toggleTodo, removeTodo, clearCompleted }),
    [todos, isLoading, addTodo, toggleTodo, removeTodo, clearCompleted],
  );

  return <TodosContext.Provider value={value}>{children}</TodosContext.Provider>;
}

export function useTodos(): TodosContextValue {
  const context = useContext(TodosContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodosProvider');
  }
  return context;
}
