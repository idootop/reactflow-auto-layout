export function uuid(): string {
  const uuid = new Array(36);
  for (let i = 0; i < 36; i++) {
    uuid[i] = Math.floor(Math.random() * 16);
  }
  uuid[14] = 4;
  uuid[19] = uuid[19] &= ~(1 << 2);
  uuid[19] = uuid[19] |= 1 << 3;
  uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
  return uuid.map((x) => x.toString(16)).join("");
}
