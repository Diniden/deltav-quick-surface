const { random } = Math;

export function rand(min = 0, max = 1) {
  return random() * (max - min) + min;
}
