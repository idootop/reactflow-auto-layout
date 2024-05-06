/* eslint-disable @typescript-eslint/no-explicit-any */

export const nextTick = async (frames = 1) => {
  const _nextTick = async (idx: number) => {
    return new Promise((resolve) => {
      requestAnimationFrame(() => resolve(idx));
    });
  };
  for (let i = 0; i < frames; i++) {
    await _nextTick(i);
  }
};

export const firstOf = <T = any>(datas?: T[]) =>
  datas ? (datas.length < 1 ? undefined : datas[0]) : undefined;

export const lastOf = <T = any>(datas?: T[]) =>
  datas ? (datas.length < 1 ? undefined : datas[datas.length - 1]) : undefined;

export const randomInt = (min: number, max?: number) => {
  if (!max) {
    max = min;
    min = 0;
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const pickOne = <T = any>(datas: T[]) =>
  datas.length < 1 ? undefined : datas[randomInt(datas.length - 1)];

export const range = (start: number, end?: number) => {
  if (!end) {
    end = start;
    start = 0;
  }
  return Array.from({ length: end - start }, (_, index) => start + index);
};

/**
 * clamp(-1,0,1)=0
 */
export function clamp(num: number, min: number, max: number): number {
  return num < max ? (num > min ? num : min) : max;
}

export const toSet = <T = any>(datas: T[], byKey?: (e: T) => any) => {
  if (byKey) {
    const keys: Record<string, boolean> = {};
    const newDatas: T[] = [];
    datas.forEach((e) => {
      const key = jsonEncode({ key: byKey(e) }) as any;
      if (!keys[key]) {
        newDatas.push(e);
        keys[key] = true;
      }
    });
    return newDatas;
  }
  return Array.from(new Set(datas));
};

export function jsonEncode(obj: any, prettier = false) {
  try {
    return prettier ? JSON.stringify(obj, undefined, 4) : JSON.stringify(obj);
  } catch (error) {
    return undefined;
  }
}

export function jsonDecode(json: string | undefined) {
  if (json == undefined) return undefined;
  try {
    return JSON.parse(json!);
  } catch (error) {
    return undefined;
  }
}

export function removeEmpty<T = any>(data: T): T {
  if (Array.isArray(data)) {
    return data.filter((e) => e != undefined) as any;
  }
  const res = {} as any;
  for (const key in data) {
    if (data[key] != undefined) {
      res[key] = data[key];
    }
  }
  return res;
}

export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    const copy: any[] = [];
    obj.forEach((item, index) => {
      copy[index] = deepClone(item);
    });

    return copy as unknown as T;
  }

  const copy = {} as T;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      (copy as any)[key] = deepClone((obj as any)[key]);
    }
  }

  return copy;
};
